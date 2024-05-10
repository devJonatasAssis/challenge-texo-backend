## Projeto Challenge Texo Backend Node.js com Express, TypeScript, MongoDB Memory Server, csvtojson, Jest e SuperTest

Este é um projeto que lista os indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards. As bibliotecas são Node.js utilizando Express e TypeScript, com integração de testes usando Jest e SuperTest, e um banco de dados MongoDB em memória usando MongoDB Memory Server. Além disso, o projeto utiliza a biblioteca csvtojson para converter arquivos CSV em JSON.

## Instalação

Certifique-se de ter o Node.js e o npm instalados em sua máquina. Você pode baixá-los e instalá-los a partir do [site oficial do Node.js](https://nodejs.org/).

1. Clone este repositório:

   ```bash
   git clone https://github.com/devJonatasAssis/challenge-texo-backend.git
   ```

2. Instale as dependências do projeto:
   ```bash
   cd challenge-texo-backend
   npm install
   ```

## Configuração

Este projeto utiliza MongoDB Memory Server para facilitar o desenvolvimento local sem a necessidade de um servidor de banco de dados MongoDB instalado.

## Uso

Para iniciar o servidor, execute o seguinte comando:

```bash
npm start
```

Para executar os testes, utilize o comando:

```bash
npm test
```

## Rota para teste

```bash
GET /movies/producers-awards
```

## Retorno da Rota (/movies/producers-awards)

```bash
{
	"min": [
		{
			"producer": "Joel Silver",
			"interval": 1,
			"previousWin": 1990,
			"followingWin": 1991
		}
	],
	"max": [
		{
			"producer": "Matthew Vaughn",
			"interval": 13,
			"previousWin": 2002,
			"followingWin": 2015
		}
	]
}
```

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/): Plataforma de desenvolvimento JavaScript do lado do servidor.
- [Express](https://expressjs.com/): Framework web para Node.js.
- [TypeScript](https://www.typescriptlang.org/): Superset tipado de JavaScript.
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server): Servidor de banco de dados MongoDB em memória para desenvolvimento.
- [csvtojson](https://github.com/Keyang/node-csvtojson): Biblioteca para converter arquivos CSV em JSON.
- [Jest](https://jestjs.io/): Framework de teste para JavaScript e TypeScript.
- [SuperTest](https://github.com/visionmedia/supertest): Biblioteca de testes de integração para aplicativos Express.
