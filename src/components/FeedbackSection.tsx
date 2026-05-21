import { MessageSquare, Star, User} from 'lucide-react'

// Interface de Tipagem
interface Feedback {
  id: string;
  rating: number;
  comment: string;
  profiles: { 
    full_name: string; 
    role: string 
  };
}

export default function FeedbackSection({ feedbacks }: { feedbacks: Feedback[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-8">
      
      {/* Cabeçalho da Secção */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">Feedback</h2>
        <button className="text-primary hover:text-primary-dark text-xs font-bold flex items-center gap-1.5 transition-colors group">
          <MessageSquare className="w-3 h-3 transition-transform group-hover:scale-110" /> Dar Feedback
        </button>
      </div>

      {/* Lista de Comentários (Limitada a 3 itens para não quebrar o layout) */}
      <div className="space-y-6">
        {feedbacks.length > 0 ? (
          feedbacks.slice(0, 3).map((fb) => (
            <div key={fb.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
              
              {/* Informações e Avatar do Utilizador */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-maroon-50 text-primary rounded-full flex items-center justify-center font-bold text-xs border border-maroon-100">
                  {fb.profiles?.full_name?.substring(0, 2).toUpperCase() || <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800 leading-none mb-1">
                    {fb.profiles?.full_name}
                  </div>
                  
                  {/* Sistema de Classificação por Estrelas */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-2.5 h-2.5 ${i < fb.rating ? 'fill-current' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Texto do Comentário */}
              <p className="text-xs text-gray-600 leading-relaxed italic">
                &quot;{fb.comment}&quot;
              </p>

            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-xs text-gray-400 italic">Ainda não existem comentários para esta disciplina.</p>
          </div>
        )}
      </div>

      {/* Botão de Ação Inferior (Apenas se houverem comentários) */}
      {feedbacks.length > 0 && (
        <button className="w-full mt-8 py-3 bg-gray-100 text-primary rounded-xl text-xs font-bold hover:bg-gray-100 hover:text-gray-700 transition-all border border-transparent hover:border-gray-200">
          Ver todos os comentários
        </button>
      )}

    </div>
  )
}