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
        ]
      },
      {
        text: 'Arquitetura Técnica',
        items: [
          { text: 'Base de Dados', link: '/base_dados' },
          { text: 'Integração de Email', link: '/resend' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/RafaelRebelo99/Rep_Piaget' }
    ]
  }
})