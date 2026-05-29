export default {
  home: {
    pageMetadata: {
      title: 'Início',
      description: 'Marco - Portfólio de Desenvolvedor de Software. Orientando a arquitetura de equipes, escalando sistemas e elevando o design geral de projetos.',
      srOnlyTitle: "Portfólio do Marco - Desenvolvedor de Software",
    },
    hero: {
      tabHome: 'Início',
      tabWriting: 'Artigos',
      description: 'Um desenvolvedor tradicional buscando novos desafios ao redor do mundo...',
      descriptionLine1: 'Um desenvolvedor tradicional buscando novos desafios',
      descriptionLine2: 'ao redor do mundo...',
      downloadCV: 'Baixar CV',
      contactMe: 'Fale comigo',
    },
    aboutMe: {
      prompt: 'marco@portfolio:~$ whoami',
      hello: 'Olá!',
      title: "Olá, eu sou o Marco!",
      paragraph1: "Um <strong>desenvolvedor de software</strong> profundamente focado na interseção entre produto e negócios. Minha filosofia principal é que a <strong> qualidade de código </strong> orientada aos negócios é o verdadeiro catalisador para o <strong>crescimento</strong> e <strong>sucesso</strong> de qualquer empresa.",
      paragraph2: "Sou especialista em orientar a <strong>arquitetura de equipes</strong>, escalar sistemas e elevar o <strong>design</strong> geral dos projetos. Embora eu esteja atualmente desenvolvendo um sistema de logística, estou sempre aberto a me conectar e discutir soluções inovadoras que exijam uma perspectiva <strong>estratégica</strong> e voltada para o produto.",
    },
    stacks: {
      tabText: 'STACKS.md',
      explorerTitle: 'Explorer',
      footerLF: 'LF',
      footerMarkdown: 'Markdown',
      footerLnCol: 'Ln 12, Col 1',
      footerUTF8: 'UTF-8',
      ideText: {
        row1: '## Ah, você encontrou minhas <strong>stacks</strong>!',
        row4: "Bom, sou um desenvolvedor com um profundo entendimento do ecossistema <strong>TypeScript</strong>. Com <strong>3 anos de experiência</strong>",
        row5: "usando as principais ferramentas do mercado, adquiri o conhecimento necessario para construir um produto de ponta a ponta, indo do",
        row6: 'design no <strong>Figma</strong> até o deploy de um container em uma <strong>VPS</strong>!',
        row8: "Durante esse tempo, dei vida a várias interfaces, transformando designs do Figma em aplicações totalmente funcionais",
        row9: "usando React e Vue. Quanto às APIs back-end, fui responsável por fazer as <strong>escolhas técnicas</strong> para",
        row10: 'suportar alto tráfego, utilizando Fastify, PostgreSQL, RabbitMQ e outras ferramentas de primeira linha.',
      },
    },
    educationAndExperience: {
      prompt: 'marco@portfolio:~$ git log -experience -education',
      mode: '[NORMAL]',
      branch: 'git:main',
    },
    projects: {
      promptPrefix: 'marco@portfolio:~$ ',
      promptCmd: 'render -projects',
      title: 'Projetos',
      footer: 'Renderização bem-sucedida | Arquivos: 4 | Espaço disponível: 2',
      list: {
        vhs: {
          projectName: 'Projeto VHS',
          description: 'Descrição do projeto aqui.',
          stacks: 'React, TypeScript, Node.js',
        },
        diskette: {
          projectName: 'Projeto Disquete',
          description: 'Descrição do projeto aqui.',
          stacks: 'Astro, Tailwind, GSAP',
        },
        cartridge: {
          projectName: 'Projeto Cartucho',
          description: 'Descrição do projeto aqui.',
          stacks: 'Next.js, Prisma, PostgreSQL',
        },
        moDisc: {
          projectName: 'Projeto MO Disc',
          description: 'Descrição do projeto aqui.',
          stacks: 'Vue, Vite, Supabase',
        },
      },
    },
    footer: {
      heading: 'Me faça melhor com novos desafios',
      contactMe: 'Fale comigo',
      thanks: 'Obrigado por ver até o final.',
      copyright: '© 2026 MARCOAROUND - Todos os direitos reservados',
    },
    loadingScreen: {
      fallback: 'Carregando'
    },
  },
  blog: {},
} as const