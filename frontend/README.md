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

1. Clone o repositório (caso ainda não tenha feito):
```bash
git clone https://github.com/seu-usuario/daterra.git
cd daterra/frontend
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
├── public/         # Arquivos estáticos
├── src/
│   ├── assets/     # Imagens e outros recursos
│   ├── components/ # Componentes React reutilizáveis
│   ├── contexts/   # Contextos React
│   ├── hooks/      # Custom hooks
│   ├── pages/      # Páginas da aplicação
│   ├── services/   # Serviços de API e integração
│   ├── styles/     # Estilos globais
│   ├── types/      # Definições de tipos TypeScript
│   ├── utils/      # Funções utilitárias
│   ├── App.tsx     # Componente principal
│   ├── main.tsx    # Ponto de entrada da aplicação
│   └── vite-env.d.ts # Tipagens do Vite
├── .eslintrc.json  # Configuração do ESLint
├── index.html      # Template HTML
├── tailwind.config.ts # Configuração do Tailwind
├── tsconfig.json   # Configuração do TypeScript
└── vite.config.ts  # Configuração do Vite
```

## Funcionalidades Implementadas

- Página de registro de produtor
- Página de login
- Dashboard do produtor
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