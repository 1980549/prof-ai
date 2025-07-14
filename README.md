# 🤖 Prof AI

Uma plataforma educacional inteligente que combina tutoria personalizada, gamificação e tecnologia de IA para proporcionar uma experiência de aprendizado envolvente e eficaz.

## ✨ Funcionalidades

- **Chat Multimídia:** Envie perguntas por texto, voz (reconhecimento de fala) ou imagem (upload com OCR).
- **Respostas em Áudio:** Ouça as respostas da IA com um clique.
- **Análise de Exercícios por Imagem:** Faça upload de fotos de exercícios, extraia o texto automaticamente e receba explicações/resoluções da IA.
- **Limites de uso:** Controle de perguntas diárias e uploads mensais, com alertas claros ao atingir limites.
- **Histórico e Gamificação:** Todo o histórico de interações é salvo, com conquistas e moedas por participação.
- **Privacidade e Segurança:** Apenas imagens JPEG/PNG até 5MB são aceitas. Dados sensíveis não são compartilhados.

## 🛠️ Bibliotecas e Tecnologias
- React, Vite, TypeScript
- Tesseract.js (OCR)
- react-speech-recognition (voz)
- Supabase (backend, auth, storage)
- shadcn/ui (UI)

## 🚀 Como usar

1. Clone o repositório:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd prof-ai
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Rode o projeto:
   ```bash
   npm run dev
   ```

## 💡 Exemplos de uso
- Clique em **Foto** para enviar uma imagem de exercício e receba a explicação da IA.
- Clique em **Falar** para ditar sua dúvida e ouça a resposta.
- Veja seu histórico, conquistas e moedas acumuladas.

## 🔒 Privacidade
- Suas imagens e áudios são processados com segurança e não são compartilhados.
- Evite enviar fotos de pessoas ou dados sensíveis.

## 📄 Contribuição
Pull requests são bem-vindos! Veja os comentários no código para entender os fluxos principais.

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
cd prof-ai
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

## ⚠️ Observações sobre Reconhecimento de Voz (Microfone)

- O botão "Falar" utiliza reconhecimento de voz via navegador (react-speech-recognition).
- Se o navegador bloquear o acesso ao microfone (por permissão negada ou política de segurança), o usuário recebe um aviso na tela (toast) explicando o erro.
- **Para produção (Netlify):**
  - É obrigatório o arquivo `public/_headers` com:
    ```
    /*
      Permissions-Policy: microphone=*
    ```
  - Sem esse header, navegadores podem bloquear o microfone mesmo em HTTPS.
- Sempre teste o microfone em produção após deploy.

---

**Desenvolvido com ❤️ para revolucionar a educação através da tecnologia**