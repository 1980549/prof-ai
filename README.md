# 🤖 Tutor AI Amigo

Uma plataforma educacional inteligente que combina tutoria personalizada, gamificação e tecnologia de IA para proporcionar uma experiência de aprendizado envolvente e eficaz.

## 📋 Visão Geral

O **Tutor AI Amigo** é um sistema de tutoria digital que utiliza inteligência artificial para oferecer suporte educacional personalizado. A plataforma conta com:

- 🎯 **Tutoria Personalizada**: Chat inteligente com IA Gemini que se adapta ao perfil do estudante
- 🎮 **Gamificação**: Sistema de moedas, conquistas e missões para motivar o aprendizado
- 📊 **Acompanhamento**: Histórico detalhado de interações e progresso do estudante
- 🔐 **Segurança**: Autenticação robusta e políticas de privacidade rigorosas
- 📱 **Multimídia**: Suporte a texto, áudio, imagens e comandos de voz
- 👥 **Múltiplos Perfis**: Suporte para alunos, responsáveis e professores

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e desenvolvimento
- **Tailwind CSS** - Framework de estilização
- **shadcn/ui** - Componentes de interface
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários

### Backend & Integrações
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions
  - Storage
- **Google Gemini API** - Inteligência Artificial
- **Lucide React** - Ícones

## 🚀 Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm
- Conta no Supabase
- Chave da API Google Gemini

### 1. Clone o repositório
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd tutor-ai-amigo
```

### 2. Instale as dependências
```bash
npm install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:
- Configure o projeto Supabase
- Adicione a chave da API Gemini
- Configure as URLs de redirecionamento

### 4. Configure o Supabase

#### 4.1. Crie um novo projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anon do projeto

#### 4.2. Execute as migrações do banco
As tabelas necessárias já estão configuradas no projeto. O sistema inclui:
- `profiles` - Perfis dos usuários
- `historico` - Histórico de interações
- `exercicios` - Exercícios e respostas
- `conquistas` - Sistema de conquistas
- `missoes` - Missões e desafios
- `uploads` - Gerenciamento de arquivos
- `limites` - Controle de uso da API

#### 4.3. Configure a API Gemini
1. No dashboard do Supabase, vá para Settings > Edge Functions
2. Adicione a secret `GEMINI_API_KEY` com sua chave da API Google Gemini

### 5. Execute o projeto
```bash
npm run dev
# ou
pnpm dev
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── ChatDemo.tsx    # Interface do chat com IA
│   ├── ConquistasDisplay.tsx # Exibição de conquistas
│   └── UserStats.tsx   # Estatísticas do usuário
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks personalizados
│   ├── useProfile.ts   # Gerenciamento de perfil
│   ├── useHistorico.ts # Histórico de interações
│   ├── useConquistas.ts # Sistema de conquistas
│   └── useLimites.ts   # Controle de limites
├── integrations/       # Integrações externas
│   └── supabase/       # Configuração Supabase
├── pages/              # Páginas da aplicação
│   ├── Auth.tsx        # Página de autenticação
│   ├── Index.tsx       # Página principal
│   └── NotFound.tsx    # Página 404
├── lib/                # Utilitários
│   └── utils.ts        # Funções auxiliares
└── main.tsx           # Ponto de entrada da aplicação

supabase/
├── functions/          # Edge Functions
│   └── chat-gemini/    # Função para integração com Gemini
└── config.toml        # Configuração do Supabase
```

## 🔧 Funcionalidades Principais

### 🔐 Autenticação
- Login/registro com email e senha
- Gestão de sessão automática
- Redirecionamento baseado no estado de autenticação
- Suporte a múltiplos tipos de perfil (aluno, responsável, professor)

### 💬 Chat Inteligente
- Integração com Google Gemini AI
- Contexto personalizado baseado no perfil do usuário
- Respostas adaptadas ao nível educacional
- Histórico de conversas salvo automaticamente

### 🎮 Sistema de Gamificação
- **Moedas**: Ganhe moedas por atividades realizadas
- **Conquistas**: Desbloqueie badges por marcos alcançados
- **Missões**: Complete desafios diários e semanais
- **Progresso**: Acompanhe seu desenvolvimento

### 📊 Histórico e Analytics
- Registro completo de interações
- Filtros por matéria, tipo e data
- Busca avançada no histórico
- Exportação de dados

### 📁 Upload de Arquivos
- Upload seguro de imagens e áudios
- Associação automática ao contexto
- Controle de acesso por usuário
- Integração com Supabase Storage

### ⚖️ Controle de Limites
- Monitoramento de uso da API
- Alertas de limite próximo ao máximo
- Bloqueio automático quando necessário
- Sugestões de upgrade de plano

## 🔒 Políticas de Segurança

### Row Level Security (RLS)
Todas as tabelas implementam RLS para garantir que usuários só acessem seus próprios dados:

- **profiles**: Usuários só veem/editam seu próprio perfil
- **historico**: Histórico privado por usuário
- **exercicios**: Exercícios isolados por usuário
- **conquistas**: Conquistas pessoais protegidas
- **missoes**: Missões específicas do usuário
- **uploads**: Arquivos privados por usuário
- **limites**: Limites individuais protegidos

### Proteção de Dados
- Dados sensíveis nunca expostos no frontend
- API keys armazenadas de forma segura no Supabase
- Validação de entrada em todas as operações
- Logs de auditoria para ações importantes

## 🎯 Fluxos de Uso Principais

### 1. Primeiro Acesso
1. Usuário faz registro/login
2. Preenche perfil inicial (nome, série, objetivos)
3. Recebe conquista de "Primeiro Login"
4. É direcionado ao chat principal

### 2. Interação com IA
1. Usuário digita pergunta no chat
2. Sistema envia contexto + pergunta para Gemini
3. IA gera resposta personalizada
4. Interação é salva no histórico
5. Usuário pode ganhar moedas/conquistas

### 3. Sistema de Recompensas
1. Ações do usuário são monitoradas
2. Sistema verifica critérios de conquistas
3. Conquistas são desbloqueadas automaticamente
4. Notificações motivacionais são exibidas

## 🗺️ Roadmap / Melhorias Futuras

### Próximas Funcionalidades
- [ ] Integração com APIs educacionais (Khan Academy, etc)
- [ ] Sistema de notificações push
- [ ] App mobile (React Native)
- [ ] Relatórios para responsáveis/professores
- [ ] Integração com calendário escolar
- [ ] Sistema de grupos e colaboração
- [ ] Análise de sentimento nas interações
- [ ] Recomendações de conteúdo personalizadas

### Melhorias Técnicas
- [ ] Testes automatizados (Jest, Cypress)
- [ ] CI/CD pipeline
- [ ] Monitoramento e observabilidade
- [ ] Cache Redis para melhor performance
- [ ] Compressão de imagens automática
- [ ] PWA com offline support

## 🤝 Como Contribuir

### 1. Fork e Clone
```bash
git fork <URL_DO_REPOSITORIO>
git clone <URL_DO_SEU_FORK>
cd tutor-ai-amigo
```

### 2. Crie uma Branch
```bash
git checkout -b feature/nova-funcionalidade
```

### 3. Padrões de Código
- Use TypeScript para tipagem forte
- Siga os padrões ESLint configurados
- Documente funções complexas
- Escreva testes para novas funcionalidades
- Use commits semânticos (feat:, fix:, docs:, etc)

### 4. Teste Localmente
```bash
npm run dev
npm run build
npm run test
```

### 5. Abra Pull Request
- Descreva claramente as mudanças
- Inclua screenshots se aplicável
- Referencie issues relacionadas
- Aguarde review do time

### Reportar Bugs
Abra uma issue com:
- Descrição clara do problema
- Passos para reproduzir
- Screenshots/logs se disponível
- Versão do browser/sistema

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Time

- **Desenvolvimento**: [Seu Nome]
- **IA Integration**: Google Gemini
- **Backend**: Supabase
- **Design System**: shadcn/ui + Tailwind CSS

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no GitHub
- Entre em contato: [seu-email@exemplo.com]
- Documentação Supabase: [supabase.com/docs](https://supabase.com/docs)
- Documentação Gemini: [ai.google.dev](https://ai.google.dev)

---

**Desenvolvido com ❤️ para revolucionar a educação através da tecnologia**