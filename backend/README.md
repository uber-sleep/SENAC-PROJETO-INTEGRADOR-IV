# Backend - Da Terra Pra Mesa

## Sobre

Este é o backend da aplicação Da Terra Pra Mesa, um e-commerce de produtos orgânicos. A API foi desenvolvida com Node.js, Express e MySQL, oferecendo endpoints para autenticação de produtores e cadastro de produtos.

## Requisitos do Sistema

- Node.js (v18.x ou superior)
- NPM (v8.x ou superior)
- MySQL Server (v8.0 ou superior)
- MySQL Workbench (recomendado para gerenciamento do banco)

## Configuração do Ambiente

### 1. Instalação do Node.js

#### Windows
1. Acesse [nodejs.org](https://nodejs.org/)
2. Baixe a versão LTS recomendada
3. Execute o instalador e siga as instruções

#### macOS
```bash
# Usando Homebrew
brew install node
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Instalação do MySQL

#### Windows
1. Baixe o instalador MySQL Server e MySQL Workbench em [dev.mysql.com/downloads](https://dev.mysql.com/downloads/installer/)
2. Execute o instalador e selecione:
   - MySQL Server
   - MySQL Workbench
3. Siga o assistente de instalação e defina uma senha para o usuário root

#### macOS
```bash
# Usando Homebrew
brew install mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 3. Configuração do Banco de Dados

1. Abra o MySQL Workbench
2. Conecte-se ao servidor local (localhost:3306) com suas credenciais
3. Execute o seguinte comando SQL para criar o banco de dados:

```sql
CREATE DATABASE daterra;
```

### 4. Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://github.com/uber-sleep/SENAC-PROJETO-INTEGRADOR-IV.git
cd SENAC-PROJETO-INTEGRADOR-IV/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz da pasta backend com as seguintes variáveis:
```
DB_URL=mysql://root:sua_senha@localhost:3306/daterra
JWT_SECRET=suaChaveSecretaParaTokens
```

Substitua `sua_senha` pela senha do seu usuário MySQL e `suaChaveSecretaParaTokens` por uma string aleatória segura.

## Executando o Servidor

Para iniciar o servidor em modo de desenvolvimento com hot-reload:
```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

Para iniciar em modo de produção:
```bash
npm start
```

## Estrutura do Projeto

```
backend/
├── config/         # Configurações da aplicação
│   ├── app.js
│   ├── auth.js
│   ├── database.js
│   └── env.js
├── docs/           # Documentação
├── middlewares/    # Middlewares personalizados
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── producerMiddleware.js
├── services/       # Serviços da aplicação
│   ├── product/    # Serviço de produtos
│   │   ├── controller/
│   │   ├── models/
│   │   └── routes/
│   └── user/       # Serviço de usuários
│       ├── controllers/
│       ├── models/
│       └── routes/
├── .env            # Variáveis de ambiente (não versionado)
├── .gitignore
├── package-lock.json
├── package.json
└── server.js       # Ponto de entrada da aplicação
```

## API Endpoints

### Autenticação
- `POST /auth/sign-up` - Cadastro de produtor
- `POST /auth/sign-in` - Login de produtor

### Produtos
- `POST /products` - Cadastrar novo produto

## Resolução de Problemas

### Erro de conexão com o banco de dados
- Verifique se o serviço MySQL está rodando
- Confirme se as credenciais no arquivo `.env` estão corretas na variável `DB_URL`
- Verifique se o banco de dados `daterra` foi criado

### Erro de permissão no MySQL
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;
```

### Problemas com dependências
```bash
rm -rf node_modules
npm cache clean --force
npm install
```