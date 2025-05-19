# Frontend - Da Terra Pra Mesa

## Sobre

Este é o frontend da aplicação Da Terra Pra Mesa, um e-commerce de produtos orgânicos. A interface foi desenvolvida com React, TypeScript e Tailwind CSS, oferecendo uma experiência moderna para produtores cadastrarem seus produtos orgânicos.

## Requisitos do Sistema

- Node.js (v18.x ou superior)
- NPM (v8.x ou superior)

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

### 2. Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://github.com/uber-sleep/SENAC-PROJETO-INTEGRADOR-IV.git
cd SENAC-PROJETO-INTEGRADOR-IV/frontend
```

2. Instale as dependências:
```bash
npm install
```

## Executando a Aplicação

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

Para criar a build de produção:
```bash
npm run build
```

Para visualizar a build de produção localmente:
```bash
npm run preview
```

## Estrutura do Projeto

```
frontend/
├── .vite/          # Arquivos de configuração do Vite
├── node_modules/   # Dependências do projeto
├── src/            # Código-fonte da aplicação
│   ├── components/ # Componentes React reutilizáveis
│   ├── constants/  # Constantes utilizadas no projeto
│   ├── contexts/   # Contextos React
│   ├── lib/        # Bibliotecas e utilitários
│   ├── models/     # Definições de modelos/tipos
│   ├── pages/      # Páginas da aplicação
│   ├── routes/     # Configuração de rotas
│   ├── services/   # Serviços de API e integração
│   ├── storage/    # Gerenciamento de armazenamento local
│   ├── utils/      # Funções utilitárias
│   ├── App.tsx     # Componente principal
│   ├── index.css   # Estilos globais
│   ├── main.tsx    # Ponto de entrada da aplicação
│   └── vite-env.d.ts # Tipagens do Vite
├── .gitignore      # Arquivos ignorados pelo Git
├── components.json # Configuração de componentes
├── eslint.config.js # Configuração do ESLint
├── index.html      # Template HTML
├── package-lock.json # Lock de dependências
├── package.json    # Manifesto do projeto
├── README.md       # Documentação
├── tsconfig.app.json # Configuração específica do app
├── tsconfig.json   # Configuração principal do TypeScript
├── tsconfig.node.json # Configuração do TypeScript para Node
└── vite.config.ts  # Configuração do Vite
```

## Funcionalidades Implementadas

- Página de registro de produtor
- Página de login
- Cadastro de produtos

## Tecnologias Utilizadas

- **React 19**: Framework JavaScript para criação de interfaces
- **TypeScript**: Adiciona tipagem estática ao JavaScript
- **Vite**: Ferramenta de build moderna e rápida
- **Tailwind CSS**: Framework CSS utility-first
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de esquemas com TypeScript
- **Axios**: Cliente HTTP para realizar requisições à API
- **React Router**: Roteamento da aplicação
- **React Toastify**: Notificações de feedback ao usuário

## Conexão com o Backend

Por padrão, o frontend está configurado para se conectar ao backend na URL `http://localhost:3000`. Se o seu backend estiver rodando em outro endereço, você precisará ajustar essa configuração.

## Resolução de Problemas

### Erros de build ou execução
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Erros de conexão com API
- Verifique se o backend está rodando
- Verifique se a URL da API está configurada corretamente
- Verifique se o CORS está configurado no backend

### Problemas de compatibilidade
- Certifique-se de estar usando as versões corretas de Node.js e NPM
- Execute `npm update` para atualizar as dependências