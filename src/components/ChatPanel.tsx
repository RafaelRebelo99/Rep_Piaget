'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ArrowUp } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  disciplineId: string
  disciplineName: string
}

export default function ChatPanel({ disciplineId, disciplineName }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Sou o assistente académico do REP. Analisei os materiais de ${disciplineName} e estou pronto para ajudar. Como posso ajudar o teu estudo hoje?`,
    },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const updated: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated,
          disciplineName,
          disciplineId,
        }),
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.message ?? data.error ?? 'Erro ao obter resposta.' },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Erro de ligação. Tenta novamente.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Botão flutuante para abrir */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#7B1D1D] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#6a1818] transition-colors text-sm font-semibold"
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          REP AI
        </button>
      )}

      {/* Painel lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#7B1D1D] rounded-lg flex items-center justify-center text-white text-xs font-bold">
              REP
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">REP AI</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-[#7B1D1D] rounded-lg flex items-center justify-center text-white text-[10px] font-bold mr-2 mt-1 shrink-0">
                  REP
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#7B1D1D] text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-7 h-7 bg-[#7B1D1D] rounded-lg flex items-center justify-center text-white text-[10px] font-bold mr-2 shrink-0">
                REP
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-4 py-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Pergunta-me qualquer coisa sobre ${disciplineName}...`}
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 bg-[#7B1D1D] text-white rounded-full flex items-center justify-center hover:bg-[#6a1818] transition-colors disabled:opacity-40 shrink-0"
            >
              <ArrowUp size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            O REP AI utiliza o repositório da UC para responder.
          </p>
        </div>
      </div>

      {/* Overlay escuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
