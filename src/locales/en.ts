export default {
  home: {
    pageMetadata: {
      title: 'Home',
      description: 'Marco - Software Developer Portfolio. Guiding team architecture, scaling systems, and elevating overall project design.',
      srOnlyTitle: "Marco's Portfolio - Software Developer",
    },
    hero: {
      tabHome: 'Home',
      tabWriting: 'Writing',
      description: 'A traditional developer seeking new challenges around the world...',
      descriptionLine1: 'A traditional developer seeking new challenges',
      descriptionLine2: 'around the world...',
      downloadCV: 'Download CV',
      contactMe: 'Contact me',
    },
    aboutMe: {
      prompt: 'marco@portfolio:~$ whoami',
      hello: 'Hello!',
      title: "Hello, I'm Marco!",
      paragraph1: "A <strong>software developer</strong> deeply focused on the intersection of product and business. My core philosophy is that business-oriented <strong> code quality </strong> is the true catalyst for any company's <strong>growth</strong> and <strong>success</strong>.",
      paragraph2: "I specialize in guiding <strong>team architecture</strong>, scaling systems, and elevating overall project <strong>design</strong>. While I am currently developing a logistics system, I am always open to connecting and discussing innovative solutions that require a <strong>strategic</strong>, product-driven perspective.",
    },
    stacks: {
      tabText: 'STACKS.md',
      explorerTitle: 'Explorer',
      footerLF: 'LF',
      footerMarkdown: 'Markdown',
      footerLnCol: 'Ln 12, Col 1',
      footerUTF8: 'UTF-8',
      ideText: {
        row1: '## Oh, you found my <strong>stacks</strong>!',
        row4: "Well, I'm a developer with a deep understanding of the <strong>TypeScript</strong> ecosystem. With <strong>3 years of experience</strong>",
        row5: "using industry-standard tools, I've gained the know-how to build a product from end to end, going from",
        row6: 'designing in <strong>Figma</strong> right through to deploying a container on a <strong>VPS</strong>!',
        row8: "Over this time, I've brought various interfaces to life, turning Figma designs into fully functional apps",
        row9: "using React and Vue. As for back-end APIs, I've been responsible for making the <strong>technical choices</strong> to",
        row10: 'support high traffic, using Fastify, PostgreSQL, RabbitMQ, and other top-tier tools.',
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
      title: 'Projects',
      footer: 'Render successful | Files: 4 | Available space: 2',
      list: {
        vhs: {
          projectName: 'VHS Project',
          description: 'Project description here.',
          stacks: 'React, TypeScript, Node.js',
        },
        diskette: {
          projectName: 'Diskette Project',
          description: 'Project description here.',
          stacks: 'Astro, Tailwind, GSAP',
        },
        cartridge: {
          projectName: 'Cartridge Project',
          description: 'Project description here.',
          stacks: 'Next.js, Prisma, PostgreSQL',
        },
        moDisc: {
          projectName: 'MO Disc Project',
          description: 'Project description here.',
          stacks: 'Vue, Vite, Supabase',
        },
      },
    },
    footer: {
      heading: 'Make me better with new challenges',
      contactMe: 'Contact me',
      thanks: 'Thank you for watching until the end.',
      copyright: '© 2026 MARCOAROUND - All rights reserved',
    },
    loadingScreen: {
      fallback: 'Loading'
    },
  },
  blog: {},
} as const