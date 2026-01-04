import { WordSearch } from '@/components/playground/board/word-search'
import { WordListPanel, GameActionsPanel } from '@/components/layouts/playground-layout'
import { GameHeader } from '@/components/playground/game-header'
import { ChatPanel, type Message } from '@/components/playground/chat'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import jackAvatar from '@/assets/avatars/jack-avatar.png'
import marieAvatar from '@/assets/avatars/marie-avatar.png'

export const Route = createFileRoute('/arena/playground/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [messages, setMessages] = useState<Message[]>([])

  const words = ['CAT', 'DOG', 'BIRD', 'FISH', 'LION', 'BEAR', 'WOLF', 'DEER']

  const player1 = {
    name: 'You',
    avatar: jackAvatar,
    score: foundWords.size,
    isCurrentTurn: true,
  }

  const player2 = {
    name: 'Opponent',
    avatar: marieAvatar,
    score: 3,
    isCurrentTurn: false,
  }

  const handleWordFound = (word: string) => {
    setFoundWords(prev => new Set([...prev, word]))
  }

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      message,
      sender: {
        name: player1.name,
        avatar: player1.avatar,
      },
      isOwn: true,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])

    // Simulate opponent response (remove in real implementation)
    setTimeout(() => {
      const responses = [
        "Good luck! 🍀",
        "Nice find!",
        "I'm catching up!",
        "Great game so far!",
        "You're fast! 😄"
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const opponentMessage: Message = {
        id: crypto.randomUUID(),
        message: randomResponse,
        sender: {
          name: player2.name,
          avatar: player2.avatar,
        },
        isOwn: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, opponentMessage])
    }, 1000 + Math.random() * 2000)
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="flex justify-center items-start w-full min-h-screen py-6 px-4">
        <div className="flex gap-6 max-w-7xl w-full">
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="w-full max-w-175">
              <GameHeader
                player1={player1}
                player2={player2}
                timerDuration={300}
              />
            </div>

            <div className="shrink-0">
              <WordSearch
                onWordFound={(word, remaining) => handleWordFound(word)}
              />
            </div>
          </div>

          <div className="hidden lg:flex w-full  flex-col gap-3">
            <WordListPanel words={words} foundWords={foundWords} />
            <ChatPanel
              messages={messages}
              currentUser={{
                name: player1.name,
                avatar: player1.avatar,
              }}
              opponent={{
                name: player2.name,
                avatar: player2.avatar,
                isOnline: true,
              }}
              onSendMessage={handleSendMessage}
            />
            <GameActionsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
