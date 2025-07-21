import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Coins, User } from 'lucide-react';

/**
 * TopBarGamificacao
 * Barra superior fixa para exibir moedas, streak e avatar do usuário.
 * Visual gamificado, responsivo e acessível.
 * Props podem ser expandidas para incluir notificações, conquistas, etc.
 */
interface TopBarGamificacaoProps {
  moedas: number;
  streak: number;
  avatarUrl?: string;
  usuario?: string;
  progressoStreak?: number; // 0-100
}

export const TopBarGamificacao: React.FC<TopBarGamificacaoProps> = ({ moedas, streak, avatarUrl, usuario, progressoStreak }) => {
  return (
    <header
      className="w-full fixed top-0 left-0 z-30 bg-gradient-to-r from-blue-100 via-cyan-50 to-green-100 shadow-md flex items-center justify-between px-4 py-2 md:px-8 md:py-3 gap-2 md:gap-4"
      role="banner"
      aria-label="Barra de gamificação"
    >
      {/* Moedas */}
      <div className="flex items-center gap-2">
        <Coins className="w-6 h-6 text-amber-500" aria-hidden="true" />
        <span className="font-bold text-lg text-amber-700" aria-label="Moedas">{moedas}</span>
      </div>
      {/* Streak */}
      <div className="flex flex-col items-center min-w-[80px]">
        <div className="flex items-center gap-1">
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" aria-hidden="true" />
          <span className="font-semibold text-base text-orange-600" aria-label="Streak">{streak} dias</span>
        </div>
        {/* Barra de progresso do streak */}
        {typeof progressoStreak === 'number' && (
          <Progress value={progressoStreak} className="h-1 mt-1 w-20" aria-label="Progresso do streak" />
        )}
      </div>
      {/* Avatar do usuário */}
      <div className="flex items-center gap-2">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={usuario ? `Avatar de ${usuario}` : 'Avatar do usuário'}
            className="w-9 h-9 rounded-full border-2 border-primary shadow-sm object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-primary" aria-label="Avatar padrão" />
        )}
      </div>
    </header>
  );
}; 