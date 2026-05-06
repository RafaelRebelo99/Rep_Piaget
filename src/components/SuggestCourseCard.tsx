export default function SuggestCourseCard() {
    return (
        <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center p-6 h-full 
        hover:border-[#8B1A1A] hover:shadow-md transition-all duration-200 cursor-pointer group">
       <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 text-2xl
       group-hover:border-[#8B1A1A] group-hover:text-[#8B1A1A] transition-all duration-200">
        +
     </div>
    <p className="text-gray-600 font-semibold mt-3">Sugerir um curso</p>
   <p className="text-gray-400 text-sm text-center mt-1">Diz-nos o que gostarias de adicionar</p>
</div>

    )

}