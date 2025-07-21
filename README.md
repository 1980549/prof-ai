# Prof AI — Chat Educacional Gamificado

## Visão Geral
O Prof AI é um app de tutoria com IA focado em estudantes brasileiros do Fundamental, priorizando classes C, D e E. A experiência do chat é moderna, engajadora, acessível, lúdica e compatível com padrões globais de usabilidade (inspiração: Duolingo, Discord, Photomath, apps bancários, Kahoot!).

## Principais Funcionalidades
- **Chat em cards animados**: Todas as mensagens (usuário, IA, sistema) são exibidas em cards arredondados, com gradiente, sombra e microanimações.
- **Gamificação**: Barra superior fixa exibe moedas, streak e avatar do usuário. Cards especiais para conquistas, microdesafios e feedbacks.
- **Acessibilidade**: Contraste alto, navegação por teclado, botões grandes, suporte a TTS (áudio das respostas), fontes ajustáveis.
- **Mobile-first**: Interface otimizada para uso com o polegar, menus fixos, responsividade total.
- **Expansível**: Pronto para novos tipos de cards (parental, mini jogos, etc).

## Componentes Principais

### `<CardChat />`
- Exibe mensagens, microdesafios, conquistas e feedbacks em cards animados.
- Props:
  - `tipo`: 'microdesafio' | 'conquista' | 'feedback'
  - `conteudo`, `emoji`, `resultado`, `moedas`, `streak`, `progresso`, `onAudioClick`, etc.
- Acessível e responsivo.

### `<TopBarGamificacao />`
- Barra fixa no topo com moedas, streak e avatar.
- Props:
  - `moedas`, `streak`, `avatarUrl`, `usuario`, `progressoStreak`
- Visual gamificado, expansível para notificações/conquistas.

## Como rodar localmente
```bash
npm install
npm run dev
```
Acesse [http://localhost:8081/](http://localhost:8081/) ou [http://192.168.1.6:8081/](http://192.168.1.6:8081/) na sua rede.

## Deploy de Produção
1. Gere o build:
   ```bash
   npm run build
   ```
2. Faça o deploy dos arquivos da pasta `dist/` no seu serviço de hospedagem (Vercel, Netlify, etc).

## Acessibilidade
- Todos os componentes seguem padrões de contraste, navegação por teclado e labels ARIA.
- Botões e áreas interativas têm tamanho mínimo de 44x44px.
- Suporte a TTS (áudio) nas respostas da IA.

## Expansão futura
- Cards para pais/responsáveis
- Mini jogos e desafios diários
- Notificações e conquistas contextuais

## Contato e Contribuição
Sugestões, bugs ou contribuições? Abra uma issue ou envie um PR!