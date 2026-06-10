'use client'

import { useState } from 'react'
import { X, RotateCcw, Trophy, AlertCircle, Loader2, FileText, Presentation, FileSpreadsheet, FileCode, File } from 'lucide-react'
import type { QuizQuestion } from '@/app/api/quiz/route'
import type { ExtendedMaterial } from '@/utils/useMaterials'

interface QuizModalProps {
  disciplineName: string
  materials: ExtendedMaterial[]
  onClose: () => void
}

type ScreenState = 'select' | 'loading' | 'error' | 'quiz' | 'score'

const fileIcon: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  doc: FileText,
  pptx: Presentation,
  xlsx: FileSpreadsheet,
  md: FileCode,
  txt: FileText,
}

export default function QuizModal({ disciplineName, materials, onClose }: QuizModalProps) {
  const [screen, setScreen] = useState<ScreenState>('select')
  const visibleMaterials = materials.filter(m => m.status !== 'HIDDEN')
  const [selected, setSelected] = useState<Set<string>>(new Set(visibleMaterials.map(m => m.material_id)))
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  function toggleMaterial(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(prev => prev.size === visibleMaterials.length ? new Set() : new Set(visibleMaterials.map(m => m.material_id)))
  }

  async function generateQuiz(ids: string[]) {
    setScreen('loading')
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialIds: ids, disciplineName }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Erro ao gerar o quiz.')
        setScreen('error')
        return
      }
      setQuestions(data.questions)
      setCurrent(0)
      setAnswer(null)
      setScore(0)
      setScreen('quiz')
    } catch {
      setErrorMsg('Não foi possível conectar ao servidor.')
      setScreen('error')
    }
  }

  function handleAnswer(index: number) {
    if (answer !== null) return
    setAnswer(index)
    if (index === questions[current].answer) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setScreen('score')
    } else {
      setCurrent(c => c + 1)
      setAnswer(null)
    }
  }

  const question = questions[current]
  const progress = questions.length > 0 ? ((current + (answer !== null ? 1 : 0)) / questions.length) * 100 : 0
  const allSelected = selected.size === visibleMaterials.length

  function optionStyle(index: number) {
    if (answer === null) return 'border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
    if (index === question.answer) return 'border-green-400 bg-green-50 text-green-800'
    if (index === answer) return 'border-primary/40 bg-primary/5 text-primary'
    return 'border-gray-100 bg-gray-50 text-gray-400'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Quiz</p>
            <h2 className="text-sm font-bold text-gray-800 truncate max-w-70">{disciplineName}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Select screen */}
        {screen === 'select' && (
          <div className="flex flex-col overflow-hidden">
            <div className="px-6 pt-5 pb-3 shrink-0">
              <p className="text-xs font-bold text-gray-700 mb-1">Seleciona os materiais</p>
              <p className="text-[11px] text-gray-400">O quiz será gerado com base nos ficheiros que escolheres.</p>
            </div>

            <div className="flex items-center justify-between px-6 pb-2 shrink-0">
              <span className="text-[11px] text-gray-400 font-medium">{selected.size} {selected.size !== 1 ? 'materiais selecionados' : 'material selecionado'}</span>
              <button onClick={toggleAll} className="text-[11px] font-bold text-primary hover:text-primary-dark transition-colors">
                {allSelected ? 'Desselecionar todos' : 'Selecionar todos'}
              </button>
            </div>

            <div className="overflow-y-auto px-6 pb-3 flex flex-col gap-1.5">
              {visibleMaterials.map(mat => {
                const Icon = fileIcon[mat.file_type?.toLowerCase()] ?? File
                const isSelected = selected.has(mat.material_id)
                return (
                  <button
                    key={mat.material_id}
                    onClick={() => toggleMaterial(mat.material_id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-gray-100 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-xs font-medium text-gray-700 truncate">{mat.title}</span>
                    <span className="ml-auto text-[10px] font-bold text-gray-400 uppercase shrink-0">{mat.file_type}</span>
                  </button>
                )
              })}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => generateQuiz(Array.from(selected))}
                disabled={selected.size === 0}
                className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Gerar Quiz com {selected.size} {selected.size !== 1 ? 'materiais' : 'material'}
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {screen === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 px-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-gray-500 font-medium">A gerar perguntas com base nos materiais...</p>
          </div>
        )}

        {/* Error */}
        {screen === 'error' && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <AlertCircle className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">Não foi possível gerar o quiz</p>
              <p className="text-xs text-gray-400">{errorMsg}</p>
            </div>
            <button
              onClick={() => setScreen('select')}
              className="mt-2 px-5 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voltar
            </button>
          </div>
        )}

        {/* Quiz */}
        {screen === 'quiz' && question && (
          <>
            <div className="h-1 bg-gray-100 shrink-0">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Pergunta {current + 1} de {questions.length}
                </span>
                <span className="text-[11px] font-bold text-primary">
                  {score} correta{score !== 1 ? 's' : ''}
                </span>
              </div>

              <p className="text-sm font-bold text-gray-900 leading-relaxed">{question.question}</p>

              <div className="flex flex-col gap-2.5">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${optionStyle(i)}`}
                  >
                    <span className="font-bold text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {answer !== null && (
                <div className={`text-xs p-3 rounded-xl border ${answer === question.answer ? 'bg-green-50 border-green-200 text-green-800' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                  <span className="font-bold">{answer === question.answer ? '✓ Correto! ' : '✗ Errado. '}</span>
                  {question.explanation}
                </div>
              )}

              {answer !== null && (
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm active:scale-95"
                >
                  {current + 1 >= questions.length ? 'Ver Resultado' : 'Próxima Pergunta →'}
                </button>
              )}
            </div>
          </>
        )}

        {/* Score */}
        {screen === 'score' && (
          <div className="flex flex-col items-center gap-5 py-12 px-6 text-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{score}<span className="text-xl text-gray-400">/{questions.length}</span></p>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {score === questions.length && 'Perfeito! Excelente trabalho.'}
                {score >= questions.length * 0.6 && score < questions.length && 'Bom resultado! Continua a estudar.'}
                {score < questions.length * 0.6 && 'Revê os materiais e tenta novamente.'}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => generateQuiz(Array.from(selected))}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Tentar Novamente
              </button>
              <button
                onClick={() => setScreen('select')}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Mudar Materiais
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
