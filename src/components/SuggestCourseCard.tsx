'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import SuggestModalCourse from './SuggestModalCourse'

export default function SuggestCourseCard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email ?? '')
        setUserName(data.user.user_metadata?.full_name ?? data.user.email ?? '')
      }
    })
  }, [])

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center p-6 h-full
        hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 text-2xl
        group-hover:border-primary group-hover:text-primary transition-all duration-200">
          +
        </div>
        <p className="text-gray-600 font-semibold mt-3">Sugerir um curso</p>
        <p className="text-gray-400 text-sm text-center mt-1">Diz-nos o que gostarias de adicionar</p>
      </div>

      {modalOpen && (
        <SuggestModalCourse
          userName={userName}
          userEmail={userEmail}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
