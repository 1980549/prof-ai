// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Limites de contexto por modelo (tokens)
const CONTEXT_LIMITS = {
  deepseek: 16384,
  openai: 4096,
  huggingface: 4096,
  gemini: 8192,
};

// Função utilitária para truncar contexto
function truncateContext(text: string, maxTokens: number): string {
  // Simples: 1 token ≈ 4 chars (ajuste se necessário)
  const maxChars = maxTokens * 4;
  return text.length > maxChars ? text.slice(-maxChars) : text;
}

// Banco de prompts (resumido para exemplo, insira todos os 22 conforme sua lista)
const PROMPTS = {
  boas_vindas: (nome: string) => `Oi, ${nome}! Aqui quem fala é seu(a) prof 100% IA — pronto(a) para estudar do seu jeito!\nO que você quer aprender, treinar ou perguntar hoje? Pode escolher matéria, pedir desafio, ou só conversar sobre escola.\nO app é todo seu!`,
  incentivo_tentativa: (nome: string) => `Ótima dúvida, ${nome}! Antes de eu mostrar a resposta, que tal tentar resolver?\nPode chutar, desenhar, ou explicar do seu jeito – eu vou te ajudar em cada passo!\nSe quiser, posso dar uma dica ou mostrar um exemplo parecido.`,
  dica_progressiva: () => `Vejo que está com dúvida nesse exercício. Que tal começarmos juntos?\n👉 Dica 1: [Dê uma dica leve, sem entregar a resposta]\nSe precisar, posso dar mais uma dica ou explicar de outro jeito!`,
  explicacao_idade: (idade: string, gosto: string) => `Você prefere que eu explique como se você tivesse ${idade} anos, ou de um jeito mais avançado?\nPosso usar exemplos do seu dia a dia – só me contar do que gosta!${gosto ? ` Por exemplo: ${gosto}` : ''}`,
  feedback_tentativa: (nome: string, erro: string) => `Mandou bem tentando, ${nome}! Veja só: você errou por pouco aqui — ${erro}.\nVamos tentar juntos de novo? O importante é não desistir!`,
  desafio_personalizado: (materia: string) => `Agora, vou criar um desafio só para você, no seu nível e focado em ${materia}.\nPreparado(a) para praticar? Se acertar, já ganha moedas para personalizar seu avatar!`,
  recebendo_imagem: () => `Recebi sua foto do caderno! Vou analisar o exercício. Aguenta só um segundo…\n[Depois do OCR:]\nPronto, entendi o que você precisa! Quer tentar resolver antes de eu explicar?`,
  privacidade_imagem: () => `Percebi que você tentou enviar uma imagem que não é de um exercício ou atividade escolar.\nPor segurança, só aceito imagens de cadernos, provas ou materiais de estudo.\nSe precisar de ajuda, me conte por texto ou áudio!`,
  multimidia: () => `Você prefere ouvir a explicação em áudio ou ler o texto?\nPosso gravar um áudio explicando, ou se quiser, gerar um desenho/diagrama para facilitar!`,
  gamificacao: (nome: string, moedas: string) => `Parabéns, ${nome}! Você ganhou ${moedas} moedas por concluir esse desafio!\nQuer usar suas moedas para trocar o avatar, desbloquear dicas ou marcar uma revisão especial?`,
  sugestao_agenda: () => `Que tal agendar um lembrete para revisar esse conteúdo amanhã?\nPosso te avisar quando chegar a hora!`,
  resumo_outra_forma: (idade: string) => `Se quiser, posso resumir a explicação, explicar de outro jeito ou ensinar como se você tivesse ${idade} anos.\nMe diga qual prefere!`,
  regional_inclusivo: (nome: string) => `Bora resolver essa juntxs, ${nome}? Se empacar, não tem problema — a gente desenrola aqui do jeitinho brasileiro!\nMe diz: prefere um exemplo, um resumão ou uma dica esperta?`,
  acolhimento_frustracao: () => `Percebi que você ficou um pouco parado(a) ou talvez desanimado(a). Isso acontece, viu? Todo mundo tem dias assim.\nQue tal tentarmos um desafio rapidinho, só para aquecer? Se quiser conversar ou só jogar um miniquiz, estou aqui!`,
  autonomia_descoberta: () => `Você sabia que pode pedir para eu te ensinar de outras formas?\nSó falar: “me explica com história”, “quero dica”, “faz um desenho”, ou “me manda um áudio”!\nDo que você precisa agora?`,
  exploracao_funcionalidades: () => `Sabia que dá pra gravar sua dúvida em áudio? Ou pedir para eu guardar essa explicação para revisar depois?\nÉ só pedir! O que você quer experimentar agora?`,
  microdesafio: (tema: string) => `Topa um desafio relâmpago valendo moedas?\nVou criar uma pergunta surpresa sobre o tema que você escolher!\nSe acertar, já desbloqueia uma dica exclusiva para o próximo exercício.`,
  curiosidade_professor: () => `E se você pudesse criar uma pergunta para mim, sobre qualquer coisa que aprendeu hoje?\nManda ver! Se eu errar, você ganha moedas extras!`,
  inclusao_parental: () => `Se quiser, pode pedir para eu mostrar um resumo para seus pais ou responsáveis, explicando o que você estudou hoje e seu progresso!`,
  feedback_ultra: (nome: string) => `Uau, que evolução, ${nome}!\nPercebi que você tentou, errou, tentou de novo e chegou mais perto da resposta certa.\nIsso é aprender de verdade! Sigo aqui para o que precisar, sempre comemorando cada avanço seu!`,
  troca_professor: () => `Quer experimentar outro jeito de aprender?\nPosso trocar minha voz para masculina, feminina, ou até mudar o sotaque!\nFala como prefere!`,
  modo_offline: () => `Sem internet agora? Sem crise!\nPosso te propor miniquizzes prontos ou desafios rápidos pra treinar até a conexão voltar.`,
  revisao_exercicio: (materia: string, data: string) =>
    `Você pediu para revisar o exercício de ${materia} feito em ${data}.\nVou localizar e te mostrar o exercício e a explicação que fizemos juntos.\nSe quiser tentar resolver de novo, me avise!`,
};

// Função para buscar secrets do Supabase
async function getSecret(key: string): Promise<string> {
  // @ts-ignore
  return await Deno.env.get(key) || "";
}

// Funções para chamada das LLMs
// Garantir que todas as funções retornem { resposta, metadata } ou lancem erro
async function callDeepSeek({ prompt, context, image }: any): Promise<{ resposta: string, metadata: any }> {
  const apiKey = await getSecret('DEEPSEEK_API_KEY');
  if (!apiKey) throw new Error('Chave DeepSeek não configurada');
  const url = 'https://api.deepseek.com/chat/completions';
  const messages = [
    { role: 'system', content: prompt },
    { role: 'user', content: context }
  ];
  const body = {
    model: 'deepseek-chat',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.8,
    top_k: 40
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro da API DeepSeek: ${response.status} - ${errorData}`);
  }
  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Nenhuma resposta gerada pelo DeepSeek');
  }
  return {
    resposta: data.choices[0].message.content,
    metadata: {
      model: data.model || 'deepseek-chat',
      tokensUsed: data.usage?.total_tokens || 0,
      tipo: image ? 'imagem' : 'texto'
    }
  };
}
async function callOpenAI({ prompt, context, image }: any): Promise<{ resposta: string, metadata: any }> {
  const apiKey = await getSecret('OPENAI_API_KEY');
  if (!apiKey) throw new Error('Chave OpenAI não configurada');
  const url = 'https://api.openai.com/v1/chat/completions';
  const messages = [
    { role: 'system', content: prompt },
    { role: 'user', content: context }
  ];
  const body = {
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.8
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro da API OpenAI: ${response.status} - ${errorData}`);
  }
  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Nenhuma resposta gerada pelo OpenAI');
  }
  return {
    resposta: data.choices[0].message.content,
    metadata: {
      model: data.model || 'gpt-3.5-turbo',
      tokensUsed: data.usage?.total_tokens || 0,
      tipo: image ? 'imagem' : 'texto'
    }
  };
}
async function callHuggingFace({ prompt, context, image }: any): Promise<{ resposta: string, metadata: any }> {
  const apiKey = await getSecret('HUGGINGFACE_API_KEY');
  if (!apiKey) throw new Error('Chave HuggingFace não configurada');
  const url = 'https://api.endpoints.huggingface.cloud/v1/chat/completions';
  let messages;
  if (image) {
    messages = [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: image } },
          { type: 'text', text: context }
        ]
      }
    ];
  } else {
    messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: context }
    ];
  }
  const body = {
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.8
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro da API HuggingFace: ${response.status} - ${errorData}`);
  }
  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Nenhuma resposta gerada pelo HuggingFace');
  }
  return {
    resposta: data.choices[0].message.content,
    metadata: {
      model: data.model || 'meta-llama/Meta-Llama-3-8B-Instruct',
      tokensUsed: data.usage?.total_tokens || 0,
      tipo: image ? 'imagem' : 'texto'
    }
  };
}
async function callGemini({ prompt, context, image }: any): Promise<{ resposta: string, metadata: any }> {
  const apiKey = await getSecret('GEMINI_API_KEY1');
  if (!apiKey) throw new Error('Chave Gemini não configurada');
  const systemPrompt = prompt;
  // Permitir parts com text ou inlineData
  const parts: Array<any> = [
    { text: systemPrompt },
    ...(context ? [{ text: `Pergunta do aluno: ${context}` }] : [])
  ];
  if (image) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: image.split(',')[1]
      }
    });
  }
  const contents = [ { parts } ];
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro da API Gemini: ${response.status} - ${errorData}`);
  }
  const data = await response.json();
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('Nenhuma resposta gerada pelo Gemini');
  }
  return {
    resposta: data.candidates[0].content.parts[0].text,
    metadata: {
      model: 'gemini-1.5-flash',
      tokensUsed: data.usageMetadata?.totalTokenCount || 0,
      tipo: image ? 'imagem' : 'texto'
    }
  };
}

// Função principal com fallback
export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { message, userContext, image, tipo, momento } = await req.json();
    if (!message && !image) {
      throw new Error('Mensagem ou imagem obrigatória');
    }
    const nome = userContext?.nome || 'Estudante';
    // Seleciona prompt conforme momento
    let prompt = '';
    switch (momento) {
      case 'boas_vindas':
        prompt = PROMPTS.boas_vindas(nome);
        break;
      case 'incentivo_tentativa':
        prompt = PROMPTS.incentivo_tentativa(nome);
        break;
      case 'dica_progressiva':
        prompt = PROMPTS.dica_progressiva();
        break;
      case 'explicacao_idade':
        prompt = PROMPTS.explicacao_idade(userContext?.idade || '12', userContext?.gosto || '');
        break;
      case 'feedback_tentativa':
        prompt = PROMPTS.feedback_tentativa(nome, userContext?.erro || '');
        break;
      case 'desafio_personalizado':
        prompt = PROMPTS.desafio_personalizado(userContext?.materia || 'matemática');
        break;
      case 'recebendo_imagem':
        prompt = PROMPTS.recebendo_imagem();
        break;
      case 'privacidade_imagem':
        prompt = PROMPTS.privacidade_imagem();
        break;
      case 'multimidia':
        prompt = PROMPTS.multimidia();
        break;
      case 'gamificacao':
        prompt = PROMPTS.gamificacao(nome, userContext?.moedas?.toString() || 'X');
        break;
      case 'sugestao_agenda':
        prompt = PROMPTS.sugestao_agenda();
        break;
      case 'resumo_outra_forma':
        prompt = PROMPTS.resumo_outra_forma(userContext?.idade || '12');
        break;
      case 'regional_inclusivo':
        prompt = PROMPTS.regional_inclusivo(nome);
        break;
      case 'acolhimento_frustracao':
        prompt = PROMPTS.acolhimento_frustracao();
        break;
      case 'autonomia_descoberta':
        prompt = PROMPTS.autonomia_descoberta();
        break;
      case 'exploracao_funcionalidades':
        prompt = PROMPTS.exploracao_funcionalidades();
        break;
      case 'microdesafio':
        prompt = PROMPTS.microdesafio(userContext?.tema || 'matemática');
        break;
      case 'curiosidade_professor':
        prompt = PROMPTS.curiosidade_professor();
        break;
      case 'inclusao_parental':
        prompt = PROMPTS.inclusao_parental();
        break;
      case 'feedback_ultra':
        prompt = PROMPTS.feedback_ultra(nome);
        break;
      case 'troca_professor':
        prompt = PROMPTS.troca_professor();
        break;
      case 'modo_offline':
        prompt = PROMPTS.modo_offline();
        break;
      case 'revisao_exercicio':
        prompt = PROMPTS.revisao_exercicio(userContext?.materia || 'matemática', userContext?.data || 'ontem');
        break;
      default:
        prompt = message;
    }
    // Trunca contexto para o menor limite
    const contextLimit = Math.min(CONTEXT_LIMITS.deepseek, CONTEXT_LIMITS.openai, CONTEXT_LIMITS.huggingface, CONTEXT_LIMITS.gemini);
    const context = truncateContext(message, contextLimit);
    // Fallback: DeepSeek → OpenAI → HuggingFace → Gemini
    let resposta, metadata;
    try {
      ({ resposta, metadata } = await callDeepSeek({ prompt, context, image }));
    } catch (e1) {
      try {
        ({ resposta, metadata } = await callOpenAI({ prompt, context, image }));
      } catch (e2) {
        try {
          ({ resposta, metadata } = await callHuggingFace({ prompt, context, image }));
        } catch (e3) {
          ({ resposta, metadata } = await callGemini({ prompt, context, image }));
        }
      }
    }
    return new Response(
      JSON.stringify({ resposta, metadata }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, fallback: "Desculpe, não consegui processar sua pergunta no momento. Tente novamente em alguns instantes ou reformule sua dúvida." }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
