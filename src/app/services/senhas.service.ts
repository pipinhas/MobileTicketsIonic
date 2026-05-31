import { Injectable } from '@angular/core';

export type TipoSenha = 'SG' | 'SP' | 'SE';
export type StatusSenha = 'aguardando' | 'atendida' | 'descartada';
export type PeriodoRelatorio = 'diario' | 'mensal';

export interface RegistroSenha {
  numero: string;
  tipo: TipoSenha;
  dataEmissao: string;
  dataAtendimento?: string;
  guiche?: string;
  status: StatusSenha;
  tempoAtendimentoMin?: number;
}

interface EstadoSenhas {
  inputNovaSenha: string;
  guicheAtual: string;
  periodoRelatorio: PeriodoRelatorio;
  expedienteManualAtivo: boolean;
  filaChamados: string[];
  ultimasChamadas: string[];
  ultimaPrioridade: TipoSenha | '';
  ultimaNaoPrioritaria: Exclude<TipoSenha, 'SP'> | '';
  senhaAtualPainel: string;
  senhasArray: Record<TipoSenha, string[]>;
  registros: RegistroSenha[];
}

interface RelatorioResumo {
  emitidasTotal: number;
  atendidasTotal: number;
  descartadasTotal: number;
  emitidasPorTipo: Record<TipoSenha, number>;
  atendidasPorTipo: Record<TipoSenha, number>;
  tempoMedioPorTipo: Record<TipoSenha, number>;
}

@Injectable({
  providedIn: 'root',
})
export class Senhas {
  private readonly storageKey = 'mobile-tickets-senhas-v1';

  public senhasGeral = 0;
  public senhasPrior = 0;
  public senhasExame = 0;
  public senhasTotal = 0;

  public atendidasGeral = 0;
  public atendidasPrior = 0;
  public atendidasExame = 0;
  public atendidasTotal = 0;

  public descartadasTotal = 0;
  public inputNovaSenha = '';
  public guicheAtual = '1';
  public mensagemSistema = '';
  public periodoRelatorio: PeriodoRelatorio = 'diario';
  public expedienteManualAtivo = false;

  public filaChamados: string[] = [];
  public ultimasChamadas: string[] = [];
  public ultimaPrioridade: TipoSenha | '' = '';
  public ultimaNaoPrioritaria: Exclude<TipoSenha, 'SP'> | '' = '';
  public senhaAtualPainel = '';

  public senhasArray: Record<TipoSenha, string[]> = {
    SG: [],
    SP: [],
    SE: [],
  };

  public registros: RegistroSenha[] = [];

  constructor() {
    this.carregarEstado();
    this.descartarFilasSeExpedienteEncerrado();
    this.atualizarContadores();
  }

  get expedienteAberto(): boolean {
    const hora = new Date().getHours();
    return this.expedienteManualAtivo || (hora >= 7 && hora < 17);
  }

  get statusExpediente(): string {
    if (this.expedienteManualAtivo) {
      return 'Expediente aberto manualmente';
    }

    return this.expedienteAberto ? 'Expediente aberto' : 'Expediente fechado';
  }

  get registrosRelatorio(): RegistroSenha[] {
    return this.registros.filter((registro) =>
      this.periodoRelatorio === 'diario'
        ? this.ehMesmoDia(registro.dataEmissao)
        : this.ehMesmoMes(registro.dataEmissao)
    );
  }

  get relatorio(): RelatorioResumo {
    const registros = this.registrosRelatorio;

    return {
      emitidasTotal: registros.length,
      atendidasTotal: registros.filter((senha) => senha.status === 'atendida')
        .length,
      descartadasTotal: registros.filter((senha) => senha.status === 'descartada')
        .length,
      emitidasPorTipo: this.contarPorTipo(registros),
      atendidasPorTipo: this.contarPorTipo(
        registros.filter((senha) => senha.status === 'atendida')
      ),
      tempoMedioPorTipo: {
        SG: this.calcularTempoMedio(registros, 'SG'),
        SP: this.calcularTempoMedio(registros, 'SP'),
        SE: this.calcularTempoMedio(registros, 'SE'),
      },
    };
  }

  novaSenha(tipoSenha: TipoSenha): void {
    if (!this.expedienteAberto) {
      this.mensagemSistema =
        'Expediente fechado. Inicie o expediente manualmente para testar fora do horario.';
      return;
    }

    const agora = new Date();
    const sequencia = this.proximaSequenciaDiaria(tipoSenha, agora);
    const numero = this.formatarSenha(tipoSenha, sequencia, agora);
    const registro: RegistroSenha = {
      numero,
      tipo: tipoSenha,
      dataEmissao: agora.toISOString(),
      status: 'aguardando',
    };

    this.inputNovaSenha = numero;
    this.senhasArray[tipoSenha].push(numero);
    this.registros.unshift(registro);
    this.mensagemSistema = `Senha ${numero} emitida.`;

    this.atualizarContadores();
    this.salvarEstado();
  }

  chamarSenha(): void {
    this.descartarFilasSeExpedienteEncerrado();

    if (!this.expedienteAberto) {
      this.mensagemSistema =
        'Expediente fechado. Inicie o expediente manualmente para testar fora do horario.';
      return;
    }

    const numero = this.escolherProximaSenha();
    if (!numero) {
      this.mensagemSistema = 'Nao ha senhas aguardando atendimento.';
      return;
    }

    const registro = this.localizarRegistro(numero);
    if (!registro) {
      this.mensagemSistema = 'Senha nao encontrada no historico.';
      return;
    }

    if (Math.random() < 0.05) {
      registro.status = 'descartada';
      this.senhaAtualPainel = '';
      this.mensagemSistema = `Senha ${numero} descartada: cliente nao compareceu.`;
    } else {
      const agora = new Date();

      registro.status = 'atendida';
      registro.dataAtendimento = agora.toISOString();
      registro.guiche = this.guicheAtual || '1';
      registro.tempoAtendimentoMin = this.calcularTempoAtendimento(registro.tipo);

      this.senhaAtualPainel = numero;
      this.ultimasChamadas.unshift(numero);
      if (this.ultimasChamadas.length > 5) {
        this.ultimasChamadas.pop();
      }

      this.mensagemSistema = `Senha ${numero} chamada no guiche ${registro.guiche}.`;
    }

    this.atualizarContadores();
    this.salvarEstado();
  }

  alternarExpedienteManual(): void {
    this.expedienteManualAtivo = !this.expedienteManualAtivo;
    this.mensagemSistema = this.expedienteManualAtivo
      ? 'Expediente manual iniciado.'
      : 'Expediente manual encerrado.';

    this.salvarEstado();
  }

  limparDados(): void {
    this.inputNovaSenha = '';
    this.filaChamados = [];
    this.ultimasChamadas = [];
    this.ultimaPrioridade = '';
    this.ultimaNaoPrioritaria = '';
    this.senhaAtualPainel = '';
    this.senhasArray = { SG: [], SP: [], SE: [] };
    this.registros = [];
    this.mensagemSistema = 'Dados locais limpos.';

    this.atualizarContadores();
    this.salvarEstado();
  }

  formatarData(data?: string): string {
    if (!data) {
      return '-';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(data));
  }

  private escolherProximaSenha(): string | undefined {
    let tipoEscolhido: TipoSenha | undefined;

    if (this.ultimaPrioridade !== 'SP' && this.senhasArray.SP.length > 0) {
      tipoEscolhido = 'SP';
    } else if (
      this.ultimaNaoPrioritaria !== 'SE' &&
      this.senhasArray.SE.length > 0
    ) {
      tipoEscolhido = 'SE';
    } else if (this.senhasArray.SG.length > 0) {
      tipoEscolhido = 'SG';
    } else if (this.senhasArray.SE.length > 0) {
      tipoEscolhido = 'SE';
    } else if (this.senhasArray.SP.length > 0) {
      tipoEscolhido = 'SP';
    }

    if (!tipoEscolhido) {
      return undefined;
    }

    const numero = this.senhasArray[tipoEscolhido].shift();
    this.ultimaPrioridade = tipoEscolhido;

    if (tipoEscolhido !== 'SP') {
      this.ultimaNaoPrioritaria = tipoEscolhido;
    }

    return numero;
  }

  private calcularTempoAtendimento(tipo: TipoSenha): number {
    if (tipo === 'SP') {
      return this.numeroAleatorioInteiro(10, 20);
    }

    if (tipo === 'SG') {
      return this.numeroAleatorioInteiro(2, 8);
    }

    return Math.random() < 0.95 ? 1 : 5;
  }

  private descartarFilasSeExpedienteEncerrado(): void {
    const hora = new Date().getHours();
    const haFila =
      this.senhasArray.SG.length > 0 ||
      this.senhasArray.SP.length > 0 ||
      this.senhasArray.SE.length > 0;

    if (this.expedienteAberto || hora < 17 || !haFila) {
      return;
    }

    const senhasPendentes = [
      ...this.senhasArray.SG,
      ...this.senhasArray.SP,
      ...this.senhasArray.SE,
    ];

    senhasPendentes.forEach((numero) => {
      const registro = this.localizarRegistro(numero);
      if (registro && registro.status === 'aguardando') {
        registro.status = 'descartada';
      }
    });

    this.senhasArray = { SG: [], SP: [], SE: [] };
    this.mensagemSistema =
      'Expediente encerrado. Senhas pendentes foram descartadas.';
    this.atualizarContadores();
    this.salvarEstado();
  }

  private formatarSenha(
    tipoSenha: TipoSenha,
    sequencia: number,
    data: Date
  ): string {
    const ano = data.getFullYear().toString().substring(2, 4);
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const ordem = sequencia.toString().padStart(2, '0');

    return `${ano}${mes}${dia}-${tipoSenha}${ordem}`;
  }

  private proximaSequenciaDiaria(tipoSenha: TipoSenha, data: Date): number {
    const dia = data.toISOString().substring(0, 10);

    return (
      this.registros.filter(
        (registro) =>
          registro.tipo === tipoSenha &&
          registro.dataEmissao.substring(0, 10) === dia
      ).length + 1
    );
  }

  private localizarRegistro(numero: string): RegistroSenha | undefined {
    return this.registros.find((registro) => registro.numero === numero);
  }

  private contarPorTipo(registros: RegistroSenha[]): Record<TipoSenha, number> {
    return {
      SG: registros.filter((registro) => registro.tipo === 'SG').length,
      SP: registros.filter((registro) => registro.tipo === 'SP').length,
      SE: registros.filter((registro) => registro.tipo === 'SE').length,
    };
  }

  private calcularTempoMedio(
    registros: RegistroSenha[],
    tipo: TipoSenha
  ): number {
    const tempos = registros
      .filter(
        (registro) =>
          registro.tipo === tipo &&
          registro.status === 'atendida' &&
          registro.tempoAtendimentoMin !== undefined
      )
      .map((registro) => registro.tempoAtendimentoMin || 0);

    if (tempos.length === 0) {
      return 0;
    }

    const total = tempos.reduce((soma, tempo) => soma + tempo, 0);
    return Number((total / tempos.length).toFixed(1));
  }

  private atualizarContadores(): void {
    const emitidas = this.contarPorTipo(this.registros);
    const atendidas = this.contarPorTipo(
      this.registros.filter((registro) => registro.status === 'atendida')
    );

    this.senhasGeral = emitidas.SG;
    this.senhasPrior = emitidas.SP;
    this.senhasExame = emitidas.SE;
    this.senhasTotal = this.registros.length;

    this.atendidasGeral = atendidas.SG;
    this.atendidasPrior = atendidas.SP;
    this.atendidasExame = atendidas.SE;
    this.atendidasTotal =
      this.atendidasGeral + this.atendidasPrior + this.atendidasExame;
    this.descartadasTotal = this.registros.filter(
      (registro) => registro.status === 'descartada'
    ).length;
  }

  private ehMesmoDia(data: string): boolean {
    const alvo = new Date(data);
    const hoje = new Date();

    return (
      alvo.getFullYear() === hoje.getFullYear() &&
      alvo.getMonth() === hoje.getMonth() &&
      alvo.getDate() === hoje.getDate()
    );
  }

  private ehMesmoMes(data: string): boolean {
    const alvo = new Date(data);
    const hoje = new Date();

    return (
      alvo.getFullYear() === hoje.getFullYear() &&
      alvo.getMonth() === hoje.getMonth()
    );
  }

  private numeroAleatorioInteiro(minimo: number, maximo: number): number {
    return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
  }

  private carregarEstado(): void {
    const localStorageSeguro =
      typeof localStorage === 'undefined' ? undefined : localStorage;
    const estadoSalvo = localStorageSeguro?.getItem(this.storageKey);

    if (!estadoSalvo) {
      return;
    }

    try {
      const estado = JSON.parse(estadoSalvo) as Partial<EstadoSenhas>;

      this.inputNovaSenha = estado.inputNovaSenha || '';
      this.guicheAtual = estado.guicheAtual || '1';
      this.periodoRelatorio = estado.periodoRelatorio || 'diario';
      this.expedienteManualAtivo = estado.expedienteManualAtivo || false;
      this.filaChamados = estado.filaChamados || [];
      this.ultimasChamadas = estado.ultimasChamadas || [];
      this.ultimaPrioridade = estado.ultimaPrioridade || '';
      this.ultimaNaoPrioritaria = estado.ultimaNaoPrioritaria || '';
      this.senhaAtualPainel = estado.senhaAtualPainel || '';
      this.senhasArray = estado.senhasArray || { SG: [], SP: [], SE: [] };
      this.registros = estado.registros || [];
    } catch {
      this.mensagemSistema =
        'Nao foi possivel carregar os dados salvos no navegador.';
    }
  }

  private salvarEstado(): void {
    const localStorageSeguro =
      typeof localStorage === 'undefined' ? undefined : localStorage;

    if (!localStorageSeguro) {
      return;
    }

    const estado: EstadoSenhas = {
      inputNovaSenha: this.inputNovaSenha,
      guicheAtual: this.guicheAtual,
      periodoRelatorio: this.periodoRelatorio,
      expedienteManualAtivo: this.expedienteManualAtivo,
      filaChamados: this.filaChamados,
      ultimasChamadas: this.ultimasChamadas,
      ultimaPrioridade: this.ultimaPrioridade,
      ultimaNaoPrioritaria: this.ultimaNaoPrioritaria,
      senhaAtualPainel: this.senhaAtualPainel,
      senhasArray: this.senhasArray,
      registros: this.registros,
    };

    localStorageSeguro.setItem(this.storageKey, JSON.stringify(estado));
  }
}
