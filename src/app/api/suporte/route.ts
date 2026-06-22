import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { nome, email, assunto, descricao } = await req.json();

  try {
    await resend.emails.send({
      from: "Suporte <onboarding@resend.dev>",
      to: "rep_suporte@outlook.pt",
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

    // Regista log apenas após envio bem-sucedido
    try {
      const supabase = await createClient();
      await supabase.from("audit_logs").insert({
        admin_id: null,
        action: `SUPORTE: Pedido enviado por ${nome} (${email}) — Assunto: "${assunto}"`,
      });
    } catch (logError) {
      // Não bloqueia a resposta se o log falhar
      console.error("Erro ao registar log de suporte:", logError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 });
  }
}