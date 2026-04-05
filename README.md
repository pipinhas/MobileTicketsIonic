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
    (Exemplo: 240406-SP01)

* Controle de filas por tipo de senha

* Chamada de senhas com prioridade:

  * SP → SE/SG → SP → SE/SG

* Painel de atendimento (telão):

  * Exibe senha atual em destaque
  * Mostra as últimas 5 senhas chamadas

* Relatório simples:

  * Total de senhas emitidas
  * Quantidade por tipo

---

## Telas do Sistema

### Cliente (Emissão de senha)

![Cliente](./screenshots/AbaCliente.jpeg)

### Atendente (Painel / Telão)

![Atendente](./screenshots/AbaAtendente.jpeg)

### Relatório

![Relatório](./screenshots/AbaRelatorio.jpeg)

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
nvm install 18
nvm use 18
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

-> O sistema abrirá automaticamente no navegador:

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

## Autor

Desenvolvido por Willian Gabriel
Curso de Análise e Desenvolvimento de Sistemas
