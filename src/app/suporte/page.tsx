export default function Suporte() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-red-900 mb-2">Suporte</h1>
        <p className="text-gray-500 text-sm">
          Relate problemas ou bugs encontrados na plataforma.
        </p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-sm p-8">
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-xs tracking-widest text-red-900 font-semibold uppercase">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Introduza o seu nome"
              required
              className="w-full mt-2 bg-gray-100 rounded-md px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-red-900 font-semibold uppercase">
              E-mail de Contacto <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="exemplo@gmail.com"
              required
              className="w-full mt-2 bg-gray-100 rounded-md px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-red-900 font-semibold uppercase">
              Assunto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Sobre o que deseja falar?"
              required
              className="w-full mt-2 bg-gray-100 rounded-md px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-red-900 font-semibold uppercase">
              Descrição do Problema <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Descreva o ocorrido..."
              required
              className="w-full mt-2 bg-gray-100 rounded-md px-4 py-3 text-sm outline-none h-28 resize-none"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-red-900 text-white py-3 rounded-md text-sm font-semibold hover:bg-red-800 transition-colors"
          >
            ▷ Enviar Pedido
          </button>
        </form>
      </div>
    </main>
  );
}