# Documentação do Sistema Prof AI

## 🔑 Variáveis de Ambiente

### Frontend (Vite)
```env
VITE_SUPABASE_URL=https://nxincjuhkijzyjjcisml.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Edge Functions
```env
DEEPSEEK_API_KEY=sk-...
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...
GEMINI_API_KEY=...
```

## 🚀 Endpoints

### POST /functions/v1/multi-ai-proxy
Endpoint principal para interação com múltiplos LLMs em cascata.

#### Payload
```typescript
{
  message: string;              // Mensagem do usuário
  userContext?: {              // Contexto do usuário para personalização
    nome?: string;
    tipo?: string;
    serie?: string;
    idade?: string;
    regiao?: string;
    objetivo?: string;
    moedas?: number;
    conquistas?: string[];
    // Campos extras específicos do momento
    materia?: string;
    data?: string;
    erro?: string;
    tema?: string;
    gosto?: string;
  };
  momento?: string;            // Identificador do prompt personalizado
  image?: string;             // Base64 da imagem (opcional)
  tipo?: 'texto' | 'imagem';  // Tipo da entrada
}
```

#### Resposta
```typescript
{
  resposta: string;           // Resposta gerada pelo LLM
  metadata: {
    model: string;           // Modelo usado (deepseek-chat, gpt-3.5-turbo, etc)
    tokensUsed: number;      // Tokens consumidos
    tipo: 'texto' | 'imagem'; // Tipo da resposta
  };
  fallback?: string;         // Mensagem em caso de erro
}
```

## 🎯 Momentos e Prompts

### Lista de Momentos Disponíveis
1. `boas_vindas`: Primeira interação
2. `incentivo_tentativa`: Incentiva tentar antes da resposta
3. `dica_progressiva`: Dicas graduais para exercícios
4. `explicacao_idade`: Explicação adaptada à idade
5. `feedback_tentativa`: Feedback após tentativa
6. `desafio_personalizado`: Exercício personalizado
7. `recebendo_imagem`: Análise de imagem
8. `privacidade_imagem`: Alerta de privacidade
9. `multimidia`: Opções de formato
10. `gamificacao`: Sistema de recompensas
11. `sugestao_agenda`: Agendamento de revisão
12. `resumo_outra_forma`: Opções de explicação
13. `regional_inclusivo`: Linguagem regional
14. `acolhimento_frustracao`: Suporte emocional
15. `autonomia_descoberta`: Exploração de recursos
16. `exploracao_funcionalidades`: Tour de features
17. `microdesafio`: Desafios rápidos
18. `curiosidade_professor`: Inversão de papéis
19. `inclusao_parental`: Resumo para responsáveis
20. `feedback_ultra`: Feedback motivacional
21. `troca_professor`: Personalização de voz/estilo
22. `modo_offline`: Recursos sem internet
23. `revisao_exercicio`: Revisão de conteúdo anterior

### Exemplos de Uso
```typescript
// Exemplo 1: Boas-vindas personalizada
{
  message: "Olá!",
  momento: "boas_vindas",
  userContext: {
    nome: "João",
    idade: "12"
  }
}

// Exemplo 2: Revisão de exercício
{
  message: "Quero revisar o exercício de ontem",
  momento: "revisao_exercicio",
  userContext: {
    materia: "matemática",
    data: "ontem"
  }
}
```

## 🔄 Fluxo de Fallback LLMs
1. DeepSeek (16K tokens)
2. OpenAI (4K tokens)
3. HuggingFace (4K tokens)
4. Gemini (8K tokens)

## 🎨 Frontend

### Atalhos Inteligentes
Os atalhos no topo do chat mapeiam diretamente para momentos específicos:

```typescript
interface AcaoCard {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  contexto: string;
  momento: string;
  extra?: Record<string, any>;
}
```

#### Mapeamento de Atalhos
1. **Tarefa de Casa**
   - Momento: `desafio_personalizado`
   - Extra: `{ materia: 'matemática' }`

2. **Ajuda com a Prova**
   - Momento: `dica_progressiva`

3. **Corrigir Exercício**
   - Momento: `feedback_tentativa`
   - Extra: `{ erro: '' }`

4. **Explicar um Tema**
   - Momento: `explicacao_idade`
   - Extra: `{ idade: '12', gosto: '' }`

5. **Tira-dúvidas Rápidas**
   - Momento: `incentivo_tentativa`

6. **Revisar Exercício**
   - Momento: `revisao_exercicio`
   - Extra: `{ materia: 'matemática', data: 'ontem' }`

7. **Microdesafio**
   - Momento: `microdesafio`
   - Extra: `{ tema: 'matemática' }`

8. **Gamificação**
   - Momento: `gamificacao`
   - Extra: `{ moedas: 'X' }`

9. **Modo Offline**
   - Momento: `modo_offline`

10. **Inclusão Parental**
    - Momento: `inclusao_parental`

### Componentes Principais

#### ChatDemo
```typescript
interface ChatDemoProps {
  chatMessage?: string;
  setChatMessage?: (msg: string) => void;
  chatMomento?: string;
  chatExtra?: Record<string, any>;
  setChatMomento?: (momento?: string) => void;
  setChatExtra?: (extra?: Record<string, any>) => void;
}
```

#### CardsDeAcao
```typescript
interface CardsDeAcaoProps {
  onSelecionarAcao?: (
    contexto: string,
    momento: string,
    extra?: Record<string, any>
  ) => void;
}
```

## 🔒 Segurança e Privacidade
- Imagens são processadas localmente via OCR
- Dados sensíveis não são armazenados
- API Keys são gerenciadas via Supabase Secrets
- Contexto é truncado para limites seguros

## 🎮 Gamificação
- Moedas por interação
- Conquistas por marcos
- Sequências diárias
- Desafios personalizados

## 📱 Recursos Multimodais
- Texto
- Imagem (OCR)
- Áudio (Text-to-Speech)
- Desenhos/Diagramas

## 🔍 Limites e Cotas
- Perguntas diárias
- Uploads mensais
- Tokens por modelo
- Tamanho de contexto

## 🚦 Status Codes
- 200: Sucesso
- 400: Payload inválido
- 403: Não autorizado
- 429: Limite excedido
- 500: Erro interno
- 503: Serviço indisponível 

## O que está acontecendo?

- O navegador bloqueou a requisição porque a função Edge do Supabase **não está permitindo requisições vindas do domínio do seu site (Netlify)**.
- Isso impede que o frontend consiga conversar com o backend, resultando em “Failed to fetch” e nenhum retorno da IA.

---

## Como resolver o CORS no Supabase Edge Functions

Você precisa garantir que sua função `multi-ai-proxy` **retorne os headers de CORS corretamente** para todas as origens que você deseja permitir (ex: seu domínio Netlify).

### Passos:

1. **Abra o arquivo da função:**  
   `supabase/functions/multi-ai-proxy/index.ts`

2. **Verifique se existe algo assim no início do arquivo:**
   ```typescript
   const corsHeaders = {
     "Access-Control-Allow-Origin": "*", // ou coloque seu domínio específico
     "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
     "Access-Control-Allow-Methods": "POST, OPTIONS"
   };
   ```

3. **Garanta que o handler OPTIONS está presente:**
   ```typescript
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
   ```

4. **Garanta que TODAS as respostas (inclusive de erro) retornam esses headers:**
   ```typescript
   return new Response(
     JSON.stringify({ resposta, metadata }),
     { headers: { ...corsHeaders, "Content-Type": "application/json" } }
   );
   ```

   E para erros:
   ```typescript
   return new Response(
     JSON.stringify({ error: error.message, fallback: "Desculpe, não consegui processar sua pergunta no momento." }),
     { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
   );
   ```

5. **Se quiser restringir para seu domínio Netlify, troque o `*` por:**
   ```typescript
   "Access-Control-Allow-Origin": "https://profai.netlify.app"
   ```

6. **Salve, faça o deploy novamente da função:**
   ```bash
   npx supabase functions deploy multi-ai-proxy --project-ref nxincjuhkijzyjjcisml
   ```

---

## Resumo

- O erro é de CORS, não de código da IA.
- Corrija os headers de CORS na função.
- Faça o deploy novamente.
- Teste no site, deve funcionar normalmente.

Se quiser, posso revisar o trecho do seu código da função para garantir que está tudo certo! Se precisar de um exemplo pronto, só pedir! 