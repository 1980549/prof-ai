import React from 'react';
import { BookOpen, HelpCircle, CheckCircle, Lightbulb, MessageCircle } from 'lucide-react';

// Tipagem para callback de ação
export type AcaoCard = {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  contexto: string;
};

interface CardsDeAcaoProps {
  onSelecionarAcao?: (contexto: string) => void; // Callback ao clicar no card
}

// Lista de ações disponíveis
const cards: AcaoCard[] = [
  {
    titulo: 'Tarefa de Casa',
    descricao: 'Envie a foto ou escreva seu exercício. Te ajudo passo a passo!',
    icone: <BookOpen className="h-7 w-7 text-primary" />,
    contexto: 'Preciso de ajuda com a tarefa de casa...'
  },
  {
    titulo: 'Ajuda com a Prova',
    descricao: 'Me fale a matéria e a data da prova. Vamos revisar juntos!',
    icone: <HelpCircle className="h-7 w-7 text-primary" />,
    contexto: 'Preciso de ajuda para estudar para a prova...'
  },
  {
    titulo: 'Corrigir Exercício',
    descricao: 'Envie a resolução que eu corrijo para você.',
    icone: <CheckCircle className="h-7 w-7 text-primary" />,
    contexto: 'Quero que corrija este exercício para mim...'
  },
  {
    titulo: 'Explicar um Tema',
    descricao: 'Qual assunto está difícil? Explico de outro jeito.',
    icone: <Lightbulb className="h-7 w-7 text-primary" />,
    contexto: 'Preciso que explique este tema...'
  },
  {
    titulo: 'Tira-dúvidas Rápidas',
    descricao: 'Pergunte qualquer coisa! Respondo na hora.',
    icone: <MessageCircle className="h-7 w-7 text-primary" />,
    contexto: 'Tenho uma dúvida rápida...'
  },
];

/**
 * Componente CardsDeAcao
 * Exibe cards de ação para facilitar o início de conversas no chat.
 * Modular, responsivo, acessível e independente.
 */
export const CardsDeAcao: React.FC<CardsDeAcaoProps> = ({ onSelecionarAcao }) => {
  return (
    <section aria-label="Ações rápidas" className="w-full max-w-4xl mx-auto py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <button
            key={card.titulo}
            className="group flex flex-col items-start justify-between bg-card border border-border rounded-2xl shadow-sm p-5 h-full min-h-[160px] transition-all duration-200 hover:shadow-lg hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={card.titulo}
            tabIndex={0}
            onClick={() => onSelecionarAcao?.(card.contexto)}
          >
            <div className="flex items-center gap-3 mb-2">
              {card.icone}
              <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{card.titulo}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{card.descricao}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

// Dica de uso:
// <CardsDeAcao onSelecionarAcao={contexto => setChatMessage(contexto)} /> 