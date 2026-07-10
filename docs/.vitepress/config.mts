import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/Rep_Piaget/', 

  ignoreDeadLinks: true,
  title: "REP - Piaget",
  description: "Documentação do Projeto Integrador",
  themeConfig: {
    // Navbar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Repositório', link: 'https://github.com/RafaelRebelo99/Rep_Piaget' }
    ],

    // Sidebar
    sidebar: [
      {
        text: 'Guia do Projeto',
        items: [
          { text: 'Página Inicial', link: '/' },
          { text: 'Etapas de Desenvolvimento', link: '/etapas_desenvolvimento' },
          { text: 'Requisitos do Sistema', link: '/requisitos' },
          { text: 'Setup e Instalação', link: '/setup' },
        ]
      },
      {
        text: 'Arquitetura Técnica',
        items: [
          { text: 'Base de Dados', link: '/base_dados' },
          { text: 'Autenticação', link: '/autenticacao' },
          { text: 'Integração de Email', link: '/resend' },
          { text: 'Sistema de Votação', link: '/votacao' },
          { text: 'Chatbot REP AI', link: '/chatbot' },
          { text: 'Quiz de Materiais', link: '/quizzes' },
        ]
      },
      {
        text: 'Painel de Administração',
        items: [
          { text: 'Visão Geral', link: '/painel_admin' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/RafaelRebelo99/Rep_Piaget' }
    ]
  }
})