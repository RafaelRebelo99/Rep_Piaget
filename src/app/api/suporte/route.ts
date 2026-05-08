import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { nome, email, assunto, descricao } = await req.json();

  try {
    await resend.emails.send({
      from: "Suporte <onboarding@resend.dev>",
      to: "rep_suporte@outlook.pt", // 
      subject: `[Suporte] ${assunto}`,
      html: `
        <h2>Novo pedido de suporte</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${assunto}</p>
        <p><strong>Descrição:</strong></p>
        <p>${descricao}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 });
  }
}