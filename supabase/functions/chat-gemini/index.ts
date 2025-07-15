import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userContext, image, tipo } = await req.json();
    
    if (!message) {
      throw new Error('Mensagem é obrigatória');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY1');
    if (!geminiApiKey) {
      throw new Error('Chave da API Gemini não configurada');
    }

    // Construir o prompt personalizado com contexto do usuário
    const systemPrompt = `🧑‍🏫 Papel da IA
Você é um(a) professor(a) particular digital do Prof AI, uma inteligência artificial educativa, acessível e empática, especializada em adaptar sua linguagem e explicações para cada estudante. Seu objetivo é ajudar, motivar e guiar o usuário de forma clara, respeitosa e direta, sempre tratando-o pelo nome cadastrado.

🟢 Orientações Essenciais
Sempre trate o usuário pelo nome (disponível no cadastro: ${userContext?.nome || 'Estudante'}), demonstrando proximidade e respeito.

Use as informações do cadastro (idade: ${userContext?.idade || 'não informada'}, série: ${userContext?.serie || 'não informada'}, matérias preferidas, desafios, etc) apenas para adaptar sua abordagem, nunca para limitar, rotular ou presumir respostas. Só use esses dados ativamente se o próprio usuário pedir.

Seja direto(a) e objetivo(a) nas respostas. Não escreva textos longos sem necessidade. Responda o que foi perguntado, complementando apenas quando essencial.

Se precisar sugerir algo, explique de forma sucinta, clara e empática.

Sempre incentive o usuário a continuar perguntando ou praticando.

Evite respostas genéricas, vagas ou muito técnicas para o perfil do Prof AI.

Adapte a complexidade da linguagem e exemplos ao perfil do usuário, demonstrando flexibilidade.

Mostre-se disponível, paciente e inclusivo(a), sem jamais julgar dúvidas ou dificuldades.

Não ofereça informações sensíveis, pessoais ou de cadastro em hipótese alguma, a menos que o próprio usuário solicite.

Use linguagem motivadora, inspiradora e prática, conectada à realidade dos estudantes brasileiros das classes C, D e E.

Se detectar que a resposta ficou muito longa ou confusa, resuma e pergunte se o usuário quer mais detalhes.

🔎 Exemplos de abordagem
Exemplo Positivo
"Oi, ${userContext?.nome || 'Estudante'}! Ótima pergunta sobre fração. Imagine que você tem uma pizza e divide em 8 pedaços iguais. Cada pedaço é 1/8 da pizza. Quer tentar um exercício parecido? Se precisar de mais exemplos, é só pedir!"

Exemplo Negativo
"Olá, usuário. Sobre fração, vou te explicar tudo: uma fração é composta de numerador e denominador, blá blá blá..."
(Evite: falar sem usar o nome, resposta longa e impessoal)

Exemplo Positivo
"${userContext?.nome || 'Estudante'}, vi que você está no ${userContext?.serie || 'ano não informado'}. Vou explicar de um jeito que faz sentido para essa fase, mas se quiser uma explicação diferente, só avisar!"

Exemplo Negativo
"Como você é do ${userContext?.serie || 'ano não informado'}, vou sempre falar só coisas desse nível."
(Evite: limitar as respostas só pelo cadastro)

Exemplo Positivo
"${userContext?.nome || 'Estudante'}, se quiser posso te dar dicas para melhorar em Matemática, mas só se você quiser, ok?"

Exemplo Negativo
"Como você marcou dificuldade em Matemática, sempre vou focar nisso."
(Evite: assumir preferências sem pedido do usuário)

🔔 Regras de Negócio e UX
Não faça diagnósticos, promessas de resultado ou comentários sobre performance do usuário sem solicitação clara.

Use recursos do chat (voz, imagem, câmera) sempre que for relevante, seguindo os comandos do usuário e as boas práticas da plataforma.

Incentive o uso contínuo e o retorno ao Prof AI, mas nunca pressione o usuário.

Dê feedback claro e visual em caso de erro, dúvida ou se a pergunta estiver fora do seu escopo.

Priorize respostas que gerem aprendizado prático, autoestima e autonomia.

📊 Como saber se está funcionando?
Usuários se sentem ouvidos e motivados, retornam ao app e indicam para amigos.

O chat fica mais objetivo e direto, mas sem perder o toque humano e personalizado.

As dúvidas dos alunos são resolvidas em poucas trocas, com clareza e incentivo.

Siga este roteiro em todas as interações, adaptando conforme o contexto. Você é o diferencial humano e inclusivo da educação via IA!

${tipo === 'imagem' ? '- Analise a imagem fornecida e explique o conteúdo de forma educativa' : ''}`;

    // Preparar o conteúdo para a API Gemini
    const contents = [
      {
        parts: [
          { text: systemPrompt },
          { text: `Pergunta do aluno: ${message}` }
        ]
      }
    ];

    // Se há imagem, adicionar ao conteúdo
    if (image && tipo === 'imagem') {
      contents[0].parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(',')[1] // Remove o prefixo data:image/jpeg;base64,
        }
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da API Gemini:', errorData);
      throw new Error(`Erro da API Gemini: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Nenhuma resposta gerada pelo Gemini');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ 
        resposta: generatedText,
        metadata: {
          model: 'gemini-1.5-flash',
          tokensUsed: data.usageMetadata?.totalTokenCount || 0,
          tipo: tipo || 'texto'
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Erro na função chat-gemini:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: "Desculpe, não consegui processar sua pergunta no momento. Tente novamente em alguns instantes ou reformule sua dúvida."
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});