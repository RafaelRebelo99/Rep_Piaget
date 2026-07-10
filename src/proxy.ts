import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware a todas as rotas do site, EXCETO:
     * - _next/static (ficheiros estáticos internos do Next.js)
     * - _next/image (imagens otimizadas do Next.js)
     * - favicon.ico e ficheiros de media na pasta public (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
