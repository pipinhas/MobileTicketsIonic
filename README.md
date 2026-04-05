# Sistema de Controle de Atendimento

Este projeto é um sistema de gerenciamento de filas baseado em senhas, desenvolvido com Ionic + Angular.
Ele simula o funcionamento de centrais de atendimento, como hospitais e laboratórios.

---

## Funcionalidades

* Emissão de senhas:

  * SG (Senha Geral)
  * SP (Senha Prioritária)
  * SE (Senha de Exames)

* Formato das senhas:

  * YYMMDD-PPSQ  
Onde:
    - YY: ano
    - MM: mês
    - DD: dia
    - PP: tipo da senha (SP, SG, SE)
    - SQ: sequência diária

  * Exemplo: 240406-SP01

* Controle de filas por tipo de senha

* Chamada de senhas com prioridade:

  * Alternância entre prioridades:
    SP → (SE ou SG) → SP → (SE ou SG)
    
* Painel de atendimento (telão):

  * Exibe senha atual em destaque
  * Mostra as últimas 5 senhas chamadas

* Relatório simples:

  * Total de senhas emitidas
  * Quantidade por tipo

---

## Telas do Sistema

### Cliente (Emissão de senha)

![Cliente](https://github.com/user-attachments/assets/3cc4a2b2-823a-4b44-a800-cf6f4e84706a)

### Atendente (Painel / Telão)

![Atendente](https://github.com/user-attachments/assets/adc38c99-0de5-4806-a5ed-cf02093d44dc)

### Relatório

![Relatorio](https://github.com/user-attachments/assets/2e69e313-3fc5-4dc6-b107-d48de0dee915)


---

## Tecnologias utilizadas

* Ionic
* Angular
* TypeScript
* Node.js

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

1. O cliente gera uma senha (SG, SP ou SE)
2. A senha entra na fila correspondente
3. O atendente chama a próxima senha
4. O sistema respeita a prioridade definida
5. A senha aparece no painel (telão)
6. As últimas 5 chamadas ficam registradas

---

## Observações

* A numeração das senhas não se repete
* O sistema simula um ambiente real de atendimento
* As filas são gerenciadas em tempo real

---

## Limitações atuais

* Não há persistência em banco de dados
* Não há controle de horário (07h às 17h)
* Não há cálculo de tempo médio de atendimento

---

## Autor

Desenvolvido por Willian Gabriel
Curso de Análise e Desenvolvimento de Sistemas
