'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { X, AlertCircle } from 'lucide-react'

interface ErrorContextType {
  showError: (message: string, title?: string) => void
  hideError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('Ocorreu um erro')

  const showError = (msg: string, customTitle?: string) => {
    setMessage(msg)
    if (customTitle) setTitle(customTitle)
    setIsOpen(true)
  }

  const hideError = () => {
    setIsOpen(false)
  }

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) hideError() }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 w-full max-w-sm p-6 flex flex-col items-center text-center gap-4 animate-scaleUp">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-950">{title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed break-words whitespace-pre-wrap px-2">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={hideError}
              className="w-full mt-2 py-2.5 bg-gray-900 text-white hover:bg-gray-800 text-xs font-bold rounded-xl transition-all shadow-xs active:scale-[0.98]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  )
}

export function useGlobalError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useGlobalError deve ser usado dentro de um ErrorProvider')
  }
  return context
}