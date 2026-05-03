export default function Home() {
  return (
    <main className="suporte-page">
      <section className="suporte-header">
        <h1>Suporte</h1>
        <p>Relate problemas ou bugs encontrados na plataforma.</p>
      </section>

      <section className="form-card">
        <form>
          <label>Nome Completo</label>
          <input type="text" placeholder="Como devemos lhe chamar?" />

          <label>E-mail Académico</label>
          <input type="email" placeholder="seu.nome@instituicao.edu" />

          <label>Assunto</label>
          <input type="text" placeholder="Sobre o que deseja falar?" />

          <label>Descrição do Problema</label>
          <textarea placeholder="Descreva o ocorrido..." />

          <button type="submit">▷ Enviar Relatório</button>
        </form>
      </section>
    </main>
  );
}
