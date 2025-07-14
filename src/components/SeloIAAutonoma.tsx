import React from 'react';
import { Bot } from 'lucide-react';

/**
 * SeloIAAutonoma
 * Badge visual destacando que a IA responde na hora, 24/7.
 * Responsivo, acessível, independente.
 */
export const SeloIAAutonoma: React.FC = () => (
  <div
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg font-semibold text-sm sm:text-base border-2 border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    aria-label="IA autônoma — Responde na hora, 24/7"
    tabIndex={0}
    role="status"
  >
    <Bot className="h-5 w-5 text-white drop-shadow" aria-hidden="true" />
    <span className="whitespace-nowrap">IA autônoma — Responde na hora, 24/7</span>
  </div>
);

// Dica de uso:
// <SeloIAAutonoma /> 