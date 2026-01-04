import React from 'react'
import { cn } from '@/lib/utils'
import { ChatBubble } from '../chat-bubble'

interface AvatarStageProps {
  imageSrc: string;
  alt?: string;
  side?: 'left' | 'right';
  className?: string;
  message?: string;
}

export function AvatarStage({
  imageSrc,
  alt = 'Character Avatar',
  side = 'left',
  className,
  message
}: AvatarStageProps) {
  const flipClass = side === 'right' ? 'scale-x-[-1]' : '';

  return (
    <div className={cn(
      "flex flex-col items-center justify-center relative",
      className
    )}>
      {message && (
        <div className={cn(
          "absolute -top-12 z-10 w-max max-w-[200px]",
          side === 'left' ? 'left-1/2 -translate-x-1/4' : 'right-1/2 translate-x-1/4'
        )}>
          <ChatBubble message={message} side={side} />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-56 h-56 object-contain",
          flipClass
        )}
        style={{
          imageRendering: 'crisp-edges',
          WebkitTransform: side === 'right' ? 'scaleX(-1)' : undefined,
          transform: side === 'right' ? 'scaleX(-1)' : undefined
        }}
      />
    </div>
  );
}
