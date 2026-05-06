interface Props {
    name: string;
    type: string;
    totalDisciplines: number 
}

export default function CourseCard({ name, type, totalDisciplines }: Props) {
    return (
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[#8B1A1A] mb-3">
        📚     
     </div>
    <span className="text-xs font-semibold text-[#8B1A1A] bg-red-50 px-2 py-1 rounded-full">{type}</span>
   <h3 className="font-bold text-gray-800 mt-2 mb-1">{name}</h3>
  <p className="text-sm text-gray-400">{totalDisciplines} Cadeiras</p>
 </div>
    )
}
