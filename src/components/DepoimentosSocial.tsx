import React from 'react';
import { Star, ShieldCheck, BadgeCheck } from 'lucide-react';

// Dados dos depoimentos
const depoimentos = [
  {
    nome: 'Ana, mãe da Luiza',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    texto: 'Minha filha tirou 10 na prova com a ajuda da Prof AI!'
  },
  {
    nome: 'Lucas, 8º ano',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    texto: 'Agora não fico mais perdido nas tarefas. Muito fácil!'
  },
  {
    nome: 'Júlia, 6º ano',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    texto: 'A IA explica de um jeito que entendo de verdade!'
  },
];

// Selos de confiança
const selos = [
  {
    icone: <ShieldCheck className="h-5 w-5 text-success" />, texto: 'Privacidade garantida'
  },
  {
    icone: <BadgeCheck className="h-5 w-5 text-primary" />, texto: 'Conteúdo validado por educadores'
  },
];

/**
 * Componente DepoimentosSocial
 * Exibe depoimentos, avaliação e selos de confiança.
 * Modular, responsivo, acessível e independente.
 */
export const DepoimentosSocial: React.FC = () => {
  return (
    <section aria-label="Depoimentos e Prova Social" className="w-full max-w-4xl mx-auto py-8 px-2">
      {/* Avaliação em estrelas */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-yellow-200'} fill-yellow-400`} aria-hidden="true" />
          ))}
        </div>
        <span className="text-sm text-muted-foreground font-medium">4.9/5 — Baseado em 10k+ avaliações</span>
      </div>
      {/* Depoimentos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {depoimentos.map((dep, idx) => (
          <figure key={dep.nome} className="bg-card border border-border rounded-2xl shadow-sm p-5 flex flex-col items-center text-center h-full">
            <img
              src={dep.avatar}
              alt={`Avatar de ${dep.nome}`}
              className="w-14 h-14 rounded-full object-cover mb-2 border border-muted"
              loading="lazy"
            />
            <blockquote className="text-base text-foreground font-medium mb-2 max-w-xs">“{dep.texto}”</blockquote>
            <figcaption className="text-xs text-muted-foreground font-semibold">{dep.nome}</figcaption>
          </figure>
        ))}
      </div>
      {/* Selos de confiança */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {selos.map((selo, idx) => (
          <div key={selo.texto} className="flex items-center gap-2 bg-muted/60 rounded-full px-4 py-2 text-sm font-medium shadow-sm">
            {selo.icone}
            <span>{selo.texto}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// Dica de uso:
// <DepoimentosSocial /> 