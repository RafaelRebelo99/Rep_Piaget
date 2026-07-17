import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Caminhos que qualquer pessoa pode acessar sem estar logado
const publicRoutes = [
  '/',             // Home
  '/login',        // Login
  '/register',     // Registo
  '/suporte',      // Suporte
  '/reset-password', // Resetar password
  '/update-password', // Atualizar password
];

export const updateSession = async (request: NextRequest) => {
  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith('/api')) {
    return NextResponse.next();
  }

  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublicRoute = publicRoutes.includes(currentPath);

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('message', 'Inicia sessão para aceder a esta página.');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};