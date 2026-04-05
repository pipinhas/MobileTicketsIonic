import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Senhas {
  public senhasGeral: number = 0;
  public senhasPrior: number = 0;
  public senhasExame: number = 0;
  public senhasTotal: number = 0;

  public inputNovaSenha: string = '';

  public filaChamados: string[] = [];
  public ultimasChamadas: string[] = [];
  public ultimaPrioridade: string = '';
  public ultimaNaoPrioritaria: string = '';

  public senhaAtualPainel: string = '';

  public senhasArray: any = {
    SG: [],
    SP: [],
    SE: [],
  };

  somaGeral() {
    this.senhasGeral++;
    this.senhasTotal++;
  }
  somaPrior() {
    this.senhasPrior++;
    this.senhasTotal++;
  }

  somaExame() {
    this.senhasExame++;
    this.senhasTotal++;
  }
  novaSenha(tipoSenha: string = '') {
    if (tipoSenha == 'SG') {
      this.somaGeral();
      this.inputNovaSenha =
        new Date().getFullYear().toString().substring(2, 4) +
        (new Date().getMonth() + 1).toString().padStart(2, '0') +
        new Date().getDate().toString().padStart(2, '0') +
        '-' +
        tipoSenha +
        this.senhasGeral.toString().padStart(2, '0');
      this.senhasArray.SG.push(this.inputNovaSenha);
    } else if (tipoSenha == 'SP') {
      this.somaPrior();
      this.inputNovaSenha =
        new Date().getFullYear().toString().substring(2, 4) +
        (new Date().getMonth() + 1).toString().padStart(2, '0') +
        new Date().getDate().toString().padStart(2, '0') +
        '-' +
        tipoSenha +
        this.senhasPrior.toString().padStart(2, '0');
      this.senhasArray.SP.push(this.inputNovaSenha);
    } else if (tipoSenha == 'SE') {
      this.somaExame();
      this.inputNovaSenha =
        new Date().getFullYear().toString().substring(2, 4) +
        (new Date().getMonth() + 1).toString().padStart(2, '0') +
        new Date().getDate().toString().padStart(2, '0') +
        '-' +
        tipoSenha +
        this.senhasExame.toString().padStart(2, '0');
      this.senhasArray.SE.push(this.inputNovaSenha);
    }
    console.log(this.senhasArray);
  }

  chamarSenha() {
    let senha: string | undefined;

    if (Math.random() < 0.05) {
      console.log('Senha descartada (cliente não apareceu)');
      return;
    }

    // alternar prioridade
    if (this.ultimaPrioridade !== 'SP' && this.senhasArray.SP.length > 0) {
      senha = this.senhasArray.SP.shift();
      this.ultimaPrioridade = 'SP';
    } else {
      // alternância entre SE e SG
      if (
        this.ultimaNaoPrioritaria !== 'SE' &&
        this.senhasArray.SE.length > 0
      ) {
        senha = this.senhasArray.SE.shift();
        this.ultimaPrioridade = 'SE';
        this.ultimaNaoPrioritaria = 'SE';
      } else if (this.senhasArray.SG.length > 0) {
        senha = this.senhasArray.SG.shift();
        this.ultimaPrioridade = 'SG';
        this.ultimaNaoPrioritaria = 'SG';
      } else if (this.senhasArray.SE.length > 0) {
        // fallback se não tiver SG
        senha = this.senhasArray.SE.shift();
        this.ultimaPrioridade = 'SE';
        this.ultimaNaoPrioritaria = 'SE';
      }
    }

    if (senha) {
      this.senhaAtualPainel = senha;

      // salva histórico (máx 5)
      this.ultimasChamadas.unshift(senha);
      if (this.ultimasChamadas.length > 5) {
        this.ultimasChamadas.pop();
      }
    }
  }
}
