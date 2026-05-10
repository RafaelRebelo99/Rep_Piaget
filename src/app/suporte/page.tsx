"use client";

import { useState } from "react";

type Feedback = {
  tipo: "sucesso" | "erro" | "validacao";
  mensagem: string;
} | null;

export default function Suporte() {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [campoErro, setCampoErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setCampoErro(null);

    if (!nome.trim()) {
      setCampoErro("nome");
      setFeedback({ tipo: "validacao", mensagem: "O nome completo é obrigatório e não pode conter apenas espaços." });
      return;
    }
    if (!assunto.trim()) {
      setCampoErro("assunto");
      setFeedback({ tipo: "validacao", mensagem: "O assunto é obrigatório e não pode conter apenas espaços." });
      return;
    }
    if (!descricao.trim()) {
      setCampoErro("descricao");
      setFeedback({ tipo: "validacao", mensagem: "A descrição do problema é obrigatória e não pode conter apenas espaços." });
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

      setFeedback({
        tipo: "sucesso",
        mensagem: "O seu pedido foi enviado com sucesso! Entraremos em contacto brevemente.",
      });
      setNome("");
      setEmail("");
      setAssunto("");
      setDescricao("");
      setCampoErro(null);
    } catch {
      setFeedback({
        tipo: "erro",
        mensagem: "Ocorreu um erro ao enviar o pedido. Verifique a sua ligação à internet e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (campo: string) =>
    `w-full mt-2 bg-gray-100 rounded-md px-4 py-3 text-sm outline-none border-2 transition-colors ${
      campoErro === campo ? "border-primary bg-primary" : "border-transparent"
    }`;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">Suporte</h1>
        <p className="text-gray-500 text-sm">
          Relate problemas ou bugs encontrados na plataforma.
        </p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-sm p-8">

        {/* Caixa de feedback */}
        {feedback && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm flex items-start gap-3 border ${
              feedback.tipo === "sucesso"
                ? "bg-green-50 border-green-300 text-green-800"
                : feedback.tipo === "validacao"
                ? "bg-primary border-primary text-primary"
                : "bg-primary border-primary text-primary"
            }`}
          >
            <span className="text-lg leading-none">
              {feedback.tipo === "sucesso" ? "✅" : feedback.tipo === "validacao" ? "⚠️" : "❌"}
            </span>
            <div>
              <p className="font-semibold mb-0.5">
                {feedback.tipo === "sucesso"
                  ? "Pedido enviado"
                  : feedback.tipo === "validacao"
                  ? "Campo inválido"
                  : "Erro ao enviar"}
              </p>
              <p>{feedback.mensagem}</p>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="ml-auto text-lg leading-none opacity-50 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs tracking-widest text-primary font-semibold uppercase">
              Nome Completo <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Introduza o seu nome"
              required
              value={nome}
              onChange={(e) => { setNome(e.target.value); setCampoErro(null); }}
              className={inputClass("nome")}
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-primary font-semibold uppercase">
              E-mail de Contacto <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              placeholder="exemplo@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass("email")}
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-primary font-semibold uppercase">
              Assunto <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Sobre o que deseja falar?"
              required
              value={assunto}
              onChange={(e) => { setAssunto(e.target.value); setCampoErro(null); }}
              className={inputClass("assunto")}
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-primary font-semibold uppercase">
              Descrição do Problema <span className="text-primary">*</span>
            </label>
            <textarea
              placeholder="Descreva o ocorrido..."
              required
              value={descricao}
              onChange={(e) => { setDescricao(e.target.value); setCampoErro(null); }}
              className={`${inputClass("descricao")} h-28 resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-primary text-white py-3 rounded-md text-sm font-semibold
                       hover:bg-primary transition-colors disabled:opacity-70
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