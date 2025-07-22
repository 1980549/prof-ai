import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Brain, User as UserIcon } from 'lucide-react';

// Define a interface de propriedades para o componente
interface ChatBubbleProps {
  author: 'user' | 'assistant';
  name: string;
  avatarUrl?: string;
  message: string;
  timestamp?: string; // Opcional, para futuras implementações
}

/**
 * ChatBubble é um componente para renderizar uma única bolha de mensagem no chat.
 * Ele diferencia visualmente as mensagens do usuário e do assistente (Prof AI).
 *
 * @param {ChatBubbleProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente de bolha de chat renderizado.
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({ author, name, avatarUrl, message }) => {
  const isUser = author === 'user';

  // Define as classes de estilo com base no autor da mensagem
  const bubbleClasses = cn(
    'flex items-start gap-3 my-4',
    { 'justify-end': isUser, 'justify-start': !isUser }
  );

  const contentClasses = cn(
    'flex flex-col',
    { 'items-end': isUser, 'items-start': !isUser }
  );

  const messageClasses = cn(
    'p-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg break-words',
    {
      'bg-primary text-primary-foreground rounded-br-none': isUser,
      'bg-muted rounded-bl-none': !isUser,
    }
  );

  // Gera as iniciais para o avatar de fallback
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const avatarComponent = (
    <Avatar className="shadow-sm">
      <AvatarImage src={avatarUrl} alt={`Avatar de ${name}`} />
      <AvatarFallback>
        {isUser ? getInitials(name) : <Brain className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className={bubbleClasses} aria-label={`Mensagem de ${name}`}>
      {!isUser && avatarComponent} 
      <div className={contentClasses}>
        <span className="text-xs text-muted-foreground px-2 mb-1">{name}</span>
        <div className={messageClasses}>
          <p>{message}</p>
        </div>
      </div>
      {isUser && avatarComponent}
    </div>
  );
};
