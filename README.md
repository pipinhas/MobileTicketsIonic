# Sistema de Controle de Atendimento

Este projeto é um sistema de gerenciamento de filas baseado em senhas, desenvolvido com Ionic + Angular.
Ele simula o funcionamento de centrais de atendimento, como hospitais e laboratórios.

---

## Funcionalidades

- Emissão de senhas:
  - SG (Senha Geral)
  - SP (Senha Prioritária)
  - SE (Senha de Exames)

- Formato das senhas:
  - YYMMDD-PPSQ  
    Onde: - YY: ano - MM: mês - DD: dia - PP: tipo da senha (SP, SG, SE) - SQ: sequência diária

  - Exemplo: 240406-SP01

- Controle de filas por tipo de senha

- Controle de expediente:
  - Horário padrão das 07h às 17h
  - Botão para iniciar expediente manualmente
  - Descarte das senhas pendentes após o fim do expediente

- Chamada de senhas com prioridade:
  - Alternância entre prioridades:
    SP -> (SE ou SG) -> SP -> (SE ou SG)

- Painel de atendimento (telão):
  - Exibe senha atual em destaque
  - Mostra as últimas 5 senhas chamadas
  - Registra o guichê responsável pelo atendimento

- Relatório:
  - Total de senhas emitidas
  - Total de senhas atendidas
  - Total de senhas descartadas
  - Quantidade por tipo de senha
  - Relatório diário e mensal
  - Detalhamento das senhas com data de emissão, atendimento, guichê e status
  - Cálculo do tempo médio de atendimento

- Persistência local:
  - Os dados ficam salvos no navegador
  - O armazenamento é feito com localStorage

---

## Telas do Sistema

### Cliente (Emissão de senha)

![Cliente](https://github.com/pipinhas/MobileTicketsIonic/blob/main/screenshots/AbaCliente.png)

### Atendente (Painel / Telão)

![Atendente](https://github.com/pipinhas/MobileTicketsIonic/blob/main/screenshots/AbaAtendente.png)

### Relatório

![Relatorio](https://github.com/pipinhas/MobileTicketsIonic/blob/main/screenshots/AbaRelatorio.png)

---

## Tecnologias utilizadas

- Ionic
- Angular
- TypeScript
- Node.js

---

## Como rodar o projeto

### 1. Instalar o NVM (Node Version Manager)

Baixe e instale o NVM:
https://github.com/coreybutler/nvm-windows

---

### 2. Instalar o Node.js

Após instalar o NVM, execute no terminal:

```bash
nvm install --lts
nvm use --lts
```

---

### 3. Instalar dependências globais

```bash
npm install -g @ionic/cli
npm install -g @angular/cli
npm install -g typescript
npm install -g eslint
```

---

### 4. Clonar o projeto

```bash
git clone https://github.com/pipinhas/MobileTicketsIonic.git
cd MobileTicketsIonic
```

---

### 5. Instalar dependências do projeto

```bash
npm install
```

---

### 6. Rodar o projeto

```bash
ionic serve
```

O sistema abrirá automaticamente no navegador:

```
http://localhost:8100
```

---

## Como o sistema funciona

1. O expediente precisa estar aberto para gerar ou chamar senhas
2. O cliente gera uma senha (SG, SP ou SE)
3. A senha entra na fila correspondente
4. O atendente informa o guichê
5. O atendente chama a próxima senha
6. O sistema respeita a prioridade definida
7. A senha aparece no painel (telão)
8. As últimas 5 chamadas ficam registradas
9. O relatório mostra as senhas emitidas, atendidas e descartadas

---

## Observações

- A numeração das senhas não se repete no mesmo dia e no mesmo tipo
- O sistema simula um ambiente real de atendimento
- As filas são gerenciadas em tempo real
- O expediente padrão funciona das 07h às 17h
- O botão de iniciar expediente permite usar o sistema fora do horário padrão
- Existe uma simulação de 5% de senhas descartadas quando o cliente não aparece
- O tempo médio de atendimento é simulado conforme o tipo da senha

---

## Limitações atuais

- Não há persistência em banco de dados
- Os dados ficam salvos apenas no navegador
- Não há backend conectado ao sistema
- Não há login de usuário
- O tempo de atendimento é simulado, não cronometrado em tempo real

---

## Autor

- Desenvolvido por Willian Gabriel
- Curso de Análise e Desenvolvimento de Sistemas
