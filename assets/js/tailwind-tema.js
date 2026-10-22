// Configuracao do Tailwind (Play CDN) compartilhada por todas as paginas.
// Carregar logo DEPOIS de <script src="https://cdn.tailwindcss.com/3.4.16">.
// As cores apontam para as variaveis CSS definidas em assets/css/style.css,
// entao trocar o tema e so trocar a classe .dark no <html>.

// Cor como funcao para que modificadores de opacidade (bg-term-bg/80,
// bg-term-accent/10...) funcionem: com 'var(--x)' puro o Tailwind v3 descarta
// essas classes em silencio. color-mix aplica a opacidade sobre a variavel.
function corDoTema(variavel) {
  return function ({ opacityValue }) {
    if (opacityValue === undefined) return 'var(' + variavel + ')';
    return 'color-mix(in srgb, var(' + variavel + ') calc(' + opacityValue + ' * 100%), transparent)';
  };
}

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        term: {
          bg: corDoTema('--term-bg'),
          alt: corDoTema('--term-bg-alt'),
          fg: corDoTema('--term-fg'),
          dim: corDoTema('--term-fg-dim'),
          accent: corDoTema('--term-accent'),
          border: corDoTema('--term-border'),
          soft: corDoTema('--term-fg-soft'),
          toggle: corDoTema('--term-toggle-bg'),
          danger: corDoTema('--term-danger'),
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
};
