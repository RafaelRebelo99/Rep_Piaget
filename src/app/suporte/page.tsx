"use client";

import { useState } from "react";

export default function Suporte() {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert("Por favor, introduza o seu nome completo.");
      return;
    }
    if (!assunto.trim()) {
      alert("Por favor, introduza um assunto.");
      return;
    }
    if (!descricao.trim()) {
      alert("Por favor, descreva o problema.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/suporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email,
          assunto: assunto.trim(),
          descricao: descricao.trim(),
        }),
      });

      if (!res.ok) throw new Error("Erro ao enviar");

      alert("Pedido enviado com sucesso!");
      setNome("");
      setEmail("");
      setAssunto("");
      setDescricao("");
    } catch {
      alert("Ocorreu um erro. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-red-900 mb-2">Suporte</h1>
        <p className="text-gray-500 text-sm">
          Relate problemas ou bugs encontrados na plataforma.
        </p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-sm p-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs tracking-widest text-red-900 font-semibold uppercase">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Introduza o seu nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
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
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full mt-2 bg-gray-100 rounded-md px-4 py-3 text-sm outline-none h-28 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-red-900 text-white py-3 rounded-md text-sm font-semibold
                       hover:bg-red-800 transition-colors disabled:opacity-70
                       disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                A enviar...
              </>
            ) : (
              "▷ Enviar Pedido"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}