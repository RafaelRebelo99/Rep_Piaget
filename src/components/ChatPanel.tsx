'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ArrowUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  disciplineId: string
  disciplineName: string
}

const MIN_WIDTH = 320
const MAX_WIDTH_RATIO = 0.5

export default function ChatPanel({ disciplineId, disciplineName }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [panelWidth, setPanelWidth] = useState(600)
  const [online, setOnline] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Sou o assistente académico do REP. Analisei os materiais de ${disciplineName} e estou pronto para ajudar. Como posso ajudar o teu estudo hoje?`,
    },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  useEffect(() => {
    if (window.innerWidth >= 640) {
      setPanelWidth(Math.round(window.innerWidth * 0.5))
    }
    fetch('/api/chat/status')
      .then(res => res.json())
      .then(data => setOnline(data.online))
      .catch(() => setOnline(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onDrag = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return
    const delta = startX.current - e.clientX
    const maxWidth = Math.round(window.innerWidth * MAX_WIDTH_RATIO)
    setPanelWidth(Math.min(Math.max(MIN_WIDTH, startWidth.current + delta), maxWidth))
  }, [])

  const onDragEnd = useCallback(() => {
    isDragging.current = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onDragEnd)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [onDrag])

  function onDragStart(e: React.MouseEvent) {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = panelWidth
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onDragEnd)
  }

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

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
      e.currentTarget.style.height = 'auto'
    }
  }

  return (
    <>
      {/* Botão flutuante para abrir */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 z-40 flex items-center gap-2 bg-[#7B1D1D] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#6a1818] transition-colors text-sm font-semibold"
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          REP AI
        </button>
      )}

      {/* Painel lateral */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out w-full sm:w-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: typeof window !== 'undefined' && window.innerWidth >= 640 ? panelWidth : undefined }}
      >
        {/* Handle de redimensionamento */}
        <div
          onMouseDown={onDragStart}
          className="absolute left-0 top-0 h-full w-1.5 cursor-ew-resize hover:bg-gray-200 transition-colors hidden sm:block"
        />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#7B1D1D] rounded-lg flex items-center justify-center text-white text-xs font-bold">
              REP
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">REP AI</p>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-400' : 'bg-gray-300'}`} />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{online ? 'Online' : 'Offline'}</span>
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
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words overflow-hidden ${
                  msg.role === 'user'
                    ? 'bg-[#7B1D1D] text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-gray-900">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
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
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Pergunta-me qualquer coisa sobre ${disciplineName}...`}
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none max-h-40 overflow-y-auto"
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

      {/* Overlay escuro mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
