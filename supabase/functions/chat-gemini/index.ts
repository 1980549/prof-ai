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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Chave da API Gemini não configurada');
    }

    // Construir o prompt personalizado com contexto do usuário
    const systemPrompt = `Você é um(a) professor(a) particular digital especializado em ensino fundamental. 

CONTEXTO DO ALUNO:
- Nome: ${userContext?.nome || 'Estudante'}
- Tipo de perfil: ${userContext?.tipo || 'aluno'}
- Série: ${userContext?.serie || 'não informada'}
- Idade: ${userContext?.idade || 'não informada'}
- Região: ${userContext?.regiao || 'Brasil'}
- Objetivo: ${userContext?.objetivo || 'aprender'}
- Moedas conquistadas: ${userContext?.moedas || 0}
- Conquistas recentes: ${userContext?.conquistas?.slice(-3)?.join(', ') || 'nenhuma ainda'}

INSTRUÇÕES:
- Adapte sua linguagem à idade e série do aluno
- Use exemplos regionais quando apropriado
- Seja motivador e use tom acolhedor
- Para exercícios, dê dicas progressivas antes da resposta completa
- Celebre conquistas e progresso
- Use português brasileiro
- Seja didático e paciente
- Incentive o pensamento crítico
${tipo === 'imagem' ? '- Analise a imagem fornecida e explique o conteúdo de forma educativa' : ''}

Responda de forma educativa, personalizada e motivadora.`;

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