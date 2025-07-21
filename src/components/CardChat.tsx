import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2 } from 'lucide-react';

interface CardChatProps {
  tipo: 'microdesafio' | 'conquista' | 'feedback';
  conteudo: string;
  opcoes?: string[]; // Para microdesafio
  onOpcaoSelecionada?: (opcao: string) => void;
  correta?: string; // Para feedback
  resultado?: 'acerto' | 'erro';
  moedas?: number;
  streak?: number;
  progresso?: number; // 0-100
  emoji?: string;
  animacao?: 'confete' | 'shake' | 'pulse' | 'brilho' | 'medalha';
  audioUrl?: string;
  onAudioClick?: () => void;
  acessivelLabel?: string;
}

export const CardChat: React.FC<CardChatProps> = ({
  tipo,
  conteudo,
  opcoes,
  onOpcaoSelecionada,
  correta,
  resultado,
  moedas,
  streak,
  progresso,
  emoji,
  animacao,
  audioUrl,
  onAudioClick,
  acessivelLabel,
}) => {
  // Animações Framer Motion
  const variants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    acerto: { scale: [1, 1.1, 1], boxShadow: '0 0 24px #22c55e55' },
    erro: { x: [0, -10, 10, -10, 10, 0] },
    conquista: { scale: [1, 1.15, 1], boxShadow: '0 0 32px #facc15aa' },
  };

  // Escolhe animação
  let animate = 'animate';
  if (resultado === 'acerto') animate = 'acerto';
  if (resultado === 'erro') animate = 'erro';
  if (tipo === 'conquista') animate = 'conquista';

  // Gradiente por tipo
  const gradiente =
    tipo === 'conquista'
      ? 'bg-gradient-to-r from-yellow-300 via-orange-200 to-pink-200'
      : tipo === 'microdesafio'
      ? 'bg-gradient-to-r from-blue-200 via-cyan-100 to-green-100'
      : resultado === 'acerto'
      ? 'bg-gradient-to-r from-green-200 via-green-100 to-emerald-100'
      : resultado === 'erro'
      ? 'bg-gradient-to-r from-red-200 via-pink-100 to-orange-100'
      : 'bg-card';

  // Emoji grande animado
  const renderEmoji = () =>
    emoji ? (
      <motion.span
        className="text-4xl md:text-5xl block mb-2"
        animate={resultado === 'acerto' ? { scale: [1, 1.3, 1] } : {}}
        aria-label={acessivelLabel || 'Emoji'}
      >
        {emoji}
      </motion.span>
    ) : null;

  // Microanimações (exemplo: confete)
  // Aqui pode-se integrar Lottie ou SVG animado no futuro

  return (
    <motion.div
      initial="initial"
      animate={animate}
      exit="exit"
      variants={variants}
      className={`rounded-2xl shadow-lg p-4 md:p-6 mb-3 ${gradiente} relative focus-within:ring-2 ring-primary transition-all outline-none`}
      tabIndex={0}
      aria-label={acessivelLabel}
    >
      {/* Emoji animado */}
      {renderEmoji()}
      {/* Conteúdo principal */}
      <div className="text-base md:text-lg font-medium text-foreground mb-2">
        {conteudo}
      </div>
      {/* Barra de progresso para microdesafio */}
      {typeof progresso === 'number' && (
        <Progress value={progresso} className="h-2 mb-2" aria-label="Progresso do desafio" />
      )}
      {/* Opções de resposta para microdesafio */}
      {tipo === 'microdesafio' && opcoes && (
        <div className="flex flex-col gap-2 mt-2">
          {opcoes.map((opcao, idx) => (
            <Button
              key={opcao}
              className="w-full min-h-[44px] text-base rounded-xl"
              variant="secondary"
              onClick={() => onOpcaoSelecionada && onOpcaoSelecionada(opcao)}
              aria-label={`Escolher opção ${idx + 1}: ${opcao}`}
            >
              {opcao}
            </Button>
          ))}
        </div>
      )}
      {/* Feedback de acerto/erro */}
      {tipo === 'feedback' && resultado && (
        <div className={`mt-2 text-lg font-bold ${resultado === 'acerto' ? 'text-green-600' : 'text-red-600'}`}
             aria-live="polite">
          {resultado === 'acerto' ? '🎉 Acertou! +Moedas!' : '😅 Tente novamente!'}
        </div>
      )}
      {/* Card de conquista */}
      {tipo === 'conquista' && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-yellow-600 font-bold">🏅 Conquista desbloqueada!</span>
          {moedas && <span className="ml-2 text-base text-amber-700 font-semibold">+{moedas} moedas</span>}
          {streak && <span className="ml-2 text-base text-orange-600 font-semibold">🔥 {streak} streak</span>}
        </div>
      )}
      {/* Botão de áudio (TTS) */}
      {audioUrl || onAudioClick ? (
        <Button
          size="icon"
          variant="ghost"
          aria-label="Ouvir explicação"
          onClick={onAudioClick}
          className="absolute top-3 right-3"
        >
          <Volume2 className="w-6 h-6" />
        </Button>
      ) : null}
    </motion.div>
  );
};
