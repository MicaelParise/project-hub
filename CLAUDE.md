# CLAUDE.md — project-hub

Guia para agentes que criam ou alteram projetos neste repositório. Leia inteiro antes de mexer.

## O que é este repositório

Um **hub de ferramentas web** de MicaelParise, publicado no **GitHub Pages**. A raiz (`index.html`) é um catálogo em cards; cada ferramenta vive em `projects/<nome>/` e é uma página estática independente.

Restrições que valem para tudo:

- **Só HTML, CSS e JS estáticos.** Sem build, sem `npm`, sem bundler, sem framework de SPA, sem backend. Tem que funcionar só com `git push` e o GitHub Pages servindo os arquivos.
- **Alpine.js é o motor** de toda interatividade. Tailwind (Play CDN) para estilo. Bibliotecas extras só via CDN, e só quando forem realmente necessárias.
- **Tudo roda no navegador do usuário.** Arquivos, imagens e textos são processados localmente. Use API externa só quando não existir alternativa local (ex.: tradução) e deixe isso explícito na interface.
- **Caminhos sempre relativos** (`../../assets/...`, `js/app.js`). O site é servido em um subcaminho (`usuario.github.io/project-hub/`), então caminhos absolutos começando com `/` quebram.
- **Interface em português do Brasil, com acentuação correta.**

## Estrutura

```
index.html                  hub: hero + grade de cards (body com data-hub)
assets/
  css/style.css             tokens de cor dos temas + efeitos (scanlines, glow, cursor, card-frame, botões flutuantes)
  js/tema.js                aplica o tema salvo ANTES da primeira pintura (síncrono, no <head>)
  js/tailwind-tema.js       tailwind.config compartilhado (cores term-*, fontes)
  js/app.js                 injeta os botões flutuantes "voltar ao hub" + "alternar tema"
projects/<nome>/
  index.html
  js/app.js                 componente Alpine do projeto
  css/styles.css            opcional — só para o que o Tailwind não cobre
  README.md
```

Nomes de pasta em kebab-case, em inglês (`qr-code-reader`). Variáveis, funções e comentários em português (`carregarArquivo`, `modalAberto`) — siga o idioma que o arquivo já usa.

## Criando um projeto novo — checklist

1. Crie `projects/<nome>/` com `index.html`, `js/app.js` e `README.md` (e `css/styles.css` só se precisar).
2. Use o **template de página** abaixo sem alterar o `<head>` (exceto título, descrição e libs extras).
3. Escreva o componente Alpine em `js/app.js` seguindo as **regras do Alpine**.
4. Monte a tela com os **componentes visuais** deste guia.
5. Adicione o **card no hub** (`index.html` da raiz), em ordem alfabética.
6. **Verifique** (seção final): console limpo, tema claro e escuro, largura de 390px.

### Template de página (`projects/<nome>/index.html`)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome Do Projeto :: MicaelParise</title>
  <meta name="description" content="Uma frase dizendo o que a ferramenta faz.">

  <!-- tema salvo aplicado antes da primeira pintura (sincrono, evita flash) -->
  <script src="../../assets/js/tema.js"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">

  <script src="https://cdn.tailwindcss.com/3.4.16"></script>
  <script src="../../assets/js/tailwind-tema.js"></script>

  <link rel="stylesheet" href="../../assets/css/style.css">
  <!-- <link rel="stylesheet" href="css/styles.css"> só se existir -->

  <!-- scripts com defer executam em ordem: compartilhado, projeto e por ultimo o Alpine -->
  <script src="../../assets/js/app.js" defer></script>
  <script src="js/app.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js" defer></script>
</head>
<body class="min-h-screen bg-term-bg text-term-fg font-mono antialiased">
  <div class="scanlines" aria-hidden="true"></div>

  <main x-data="meuApp()" class="flex min-h-screen flex-col items-center justify-center gap-8 px-4 pb-24 pt-10 sm:py-16">
    <header class="text-center">
      <p class="text-sm text-term-dim">visitante@micaelparise:~$ comando --do-projeto</p>
      <h1 class="mt-2 font-display text-3xl text-term-accent text-glow sm:text-4xl">
        Nome Do Projeto<span class="cursor-blink" aria-hidden="true">&nbsp;</span>
      </h1>
      <p class="mt-4 text-sm text-term-dim">Uma linha explicando a ferramenta.</p>
    </header>

    <section class="card-frame w-full max-w-md rounded-xl border border-term-border bg-term-alt p-6 sm:p-8">
      <!-- conteúdo -->
    </section>
  </main>
</body>
</html>
```

Regras do `<head>`:

- A ordem importa: `tema.js` (síncrono) → fontes → Tailwind → `tailwind-tema.js` → CSS → scripts com `defer` terminando no Alpine.
- **Versões fixas** em todo CDN (`tailwindcss.com/3.4.16`, `alpinejs@3.14.9`). Nunca `@3.x.x` nem URL sem versão.
- Libs extras: `cdn.jsdelivr.net/npm/<pacote>@<versão exata>/...`, com `defer`, **antes** de `js/app.js`.
- **Não** coloque `[x-cloak]`, `tailwind.config`, script de tema nem botão de tema inline: tudo isso já vem de `assets/`.
- **Não** escreva o botão de tema nem o de voltar ao hub. `assets/js/app.js` injeta os dois em toda página (o hub omite o de voltar porque tem `<body data-hub>`).

### Card no hub (`index.html` da raiz)

Cole dentro da grade, em ordem alfabética, sem acentos faltando:

```html
<a href="projects/<nome>/"
   aria-label="Abrir projeto Nome Do Projeto"
   class="card-frame group flex flex-col border border-term-border bg-term-alt rounded-xl p-5">
  <div class="flex items-center justify-between">
    <svg class="w-6 h-6 text-term-accent" aria-hidden="true"><use href="#icon-terminal"/></svg>
    <svg class="w-4 h-4 text-term-dim group-hover:text-term-accent" aria-hidden="true"><use href="#icon-external"/></svg>
  </div>
  <h2 class="font-display text-2xl mt-4 text-term-accent">Nome Do Projeto</h2>
  <p class="mt-2 text-sm text-term-soft flex-1">Descrição honesta em uma ou duas frases.</p>
  <div class="mt-4 flex flex-wrap gap-2 text-xs text-term-dim">
    <span class="border border-term-border rounded px-2 py-0.5">[Tailwind]</span>
    <span class="border border-term-border rounded px-2 py-0.5">[Alpine.js]</span>
    <span class="border border-term-border rounded px-2 py-0.5">[JS]</span>
  </div>
</a>
```

A descrição do card e do README tem que bater com o que o código faz de verdade (ex.: não diga "direto no navegador" se a ferramenta chama uma API).

### README do projeto

```markdown
# Nome Do Projeto

O que faz, em uma ou duas frases.

## Tecnologias

- Tailwind CSS
- Alpine.js
- <lib extra, se houver>
- JavaScript

## Acesso

Faz parte do [project-hub](../../) — acesse este projeto diretamente pela pasta `projects/<nome>/`.
```

## Padrão visual — "terminal de fósforo verde"

O visual atual é o padrão. Todo projeto novo ou alterado deve parecer parte da mesma família. A identidade é um **terminal CRT retrô**: fonte monoespaçada em tudo, verde como única cor de destaque, linhas de varredura, brilho (glow) nos títulos, prompts de shell como texto decorativo, cantos arredondados suaves e bordas finas e translúcidas.

### Temas e cores

Existem dois temas, controlados pela classe `.dark` no `<html>`. **Nunca use cores fixas** (`text-green-500`, `#00ff41`, `bg-white`...) nem variantes `dark:` para cor: use sempre os tokens `term-*`, que já trocam sozinhos com o tema.

| Token Tailwind | Variável CSS | Claro | Escuro | Uso |
|---|---|---|---|---|
| `term-bg` | `--term-bg` | `#eae7df` papel/bege | `#0a0e0a` preto esverdeado | fundo da página, fundo de inputs |
| `term-alt` | `--term-bg-alt` | `#dcd8cd` | `#10160f` | cards, painéis, sidebars |
| `term-fg` | `--term-fg` | `#1b1f1c` | `#d6ffe0` | texto principal |
| `term-soft` | `--term-fg-soft` | `#3a4038` | `#a9c9ae` | texto de apoio em destaque (descrições dos cards, labels) |
| `term-dim` | `--term-fg-dim` | `#55605a` | `#6f8f76` | texto secundário, prompts, placeholders, ícones inativos |
| `term-accent` | `--term-accent` | `#006b27` verde escuro | `#00ff41` verde fósforo | títulos, botão primário, ícones ativos, foco, hover |
| `term-border` | `--term-border` | accent a 30% | accent a 20% | todas as bordas |
| `term-toggle` | `--term-toggle-bg` | bg a 80% | bg a 80% | fundo dos botões flutuantes |
| `term-danger` | `--term-danger` | `#b42318` | `#ff5f56` | erros e ações destrutivas (excluir, remover) |

- Modificadores de opacidade funcionam (`bg-term-accent/10`, `bg-term-bg/80`, `border-term-danger/40`) porque `tailwind-tema.js` gera as cores com `color-mix`. Não troque as cores por `'var(--x)'` puro: o Tailwind v3 descartaria essas classes sem avisar.
- Texto sobre fundo `bg-term-accent` é sempre `text-term-bg`.
- Para adicionar um token novo: defina a variável nos dois temas em `assets/css/style.css` (`:root` e `html.dark`) e registre em `assets/js/tailwind-tema.js` com `corDoTema(...)`.
- Cores definidas pelo usuário (ex.: cores do QR Code) são conteúdo, não tema — podem ser livres.

### Tipografia

- `font-mono` (JetBrains Mono) é a fonte de **tudo** — já está no `<body>`.
- `font-display` (Share Tech Mono) só para títulos `h1`/`h2` de destaque e números grandes (relógio, cronômetro).
- Título da página: `font-display text-3xl sm:text-4xl text-term-accent text-glow` (variações de tamanho entre `text-xl` em headers compactos e `text-6xl` no hero do hub).
- Prompt decorativo acima do título: `<p class="text-sm text-term-dim">visitante@micaelparise:~$ comando</p>`.
- `cursor-blink` depois do título em telas "hero" (opcional).
- Rótulos pequenos: `text-xs font-medium uppercase tracking-wide text-term-dim`.
- Números que mudam: `tabular-nums`.

### Efeitos (definidos em `assets/css/style.css`)

- `.scanlines` — `<div class="scanlines" aria-hidden="true"></div>` logo no início do `<body>`, **obrigatório** em toda página.
- `.text-glow` — brilho em títulos e números de destaque em `text-term-accent`. Não use em texto corrido.
- `.card-frame` — em todo card/painel/botão-cartão: no hover/foco a borda vira accent, ganha glow e sobe 2px.
- `.cursor-blink` — bloco piscante de cursor de terminal.
- Foco de teclado é um contorno tracejado accent (global) — não remova `outline`.

### Componentes

Copie as classes; não invente variações novas sem necessidade.

- **Card/painel:** `card-frame rounded-xl border border-term-border bg-term-alt p-5 sm:p-6` (painel principal pode usar `rounded-2xl` e `p-8`).
- **Botão primário:** `rounded-xl bg-term-accent px-5 py-3 font-medium text-term-bg shadow-md transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50`.
- **Botão secundário:** `rounded-xl border border-term-border px-4 py-2.5 font-medium text-term-dim transition-colors hover:border-term-accent hover:text-term-accent`.
- **Botão destrutivo:** `rounded-xl border border-term-danger/40 px-4 py-2.5 font-medium text-term-danger transition hover:bg-term-danger/10`.
- **Botão de ícone:** `flex h-8 w-8 items-center justify-center rounded-lg text-term-dim transition-colors hover:bg-term-bg hover:text-term-accent` + `aria-label`.
- **Input / textarea / select:** `w-full rounded-xl border border-term-border bg-term-bg px-3.5 py-2.5 text-sm text-term-fg outline-none transition-colors placeholder:text-term-dim focus:border-term-accent`, sempre com `<label for>`.
- **Seletor segmentado (abas):** contêiner `rounded-full border border-term-border bg-term-bg p-1`; opção ativa `bg-term-accent text-term-bg`, inativa `text-term-dim` (ver binary-translator).
- **Switch:** checkbox `peer sr-only` + trilho `bg-term-border peer-checked:bg-term-accent` (ver image-resizer).
- **Área de upload (dropzone):** `card-frame rounded-xl border border-dashed bg-term-alt p-10 text-center`, borda `border-term-accent` enquanto arrasta, ícone `arrow-up-tray`/`cloud-arrow-up` em accent, `role="button" tabindex="0"` e Enter/Espaço abrindo o seletor.
- **Selo de ícone:** `flex h-11 w-11 items-center justify-center rounded-xl bg-term-accent text-term-bg` (sólido) ou `rounded-2xl bg-term-accent/10 text-term-accent` (suave).
- **Tag/badge:** `rounded border border-term-border px-2 py-0.5 text-xs text-term-dim` ou pílula `rounded-full border border-term-border bg-term-alt px-3 py-1 text-xs`.
- **Modal:** overlay `fixed inset-0 z-50 flex items-center justify-center p-4` com fundo `absolute inset-0 bg-term-bg/60 backdrop-blur-sm` (clique fecha); caixa `card-frame relative w-full max-w-md rounded-xl border border-term-border bg-term-alt shadow-xl`; transição de opacidade + `scale-95`; `role="dialog" aria-modal="true"`; Esc fecha (ver notes-app).
- **Mensagem de erro:** `text-sm text-term-danger` com `role="alert"`; caixa de erro `rounded-xl border border-term-danger/50 bg-term-alt p-4`.
- **Feedback de sucesso:** texto curto em `text-term-accent` ("Copiado!") que some depois de 1,5–2,5 s.
- **Carregando:** ícone `arrow-path` com `animate-spin` em accent sobre `bg-term-bg/70 backdrop-blur-sm`.

### Layout

- Mobile-first. Teste em 390px de largura: sem rolagem horizontal.
- Conteúdo centralizado com largura máxima (`max-w-md` ferramentas simples, `max-w-3xl`/`max-w-5xl` com duas colunas, `max-w-6xl` no hub).
- Duas colunas a partir de `md:`/`lg:` (formulário + resultado), empilhadas no mobile.
- **Deixe `pb-24` no fim da página** (ou no `main`) para os botões flutuantes do canto inferior direito não cobrirem conteúdo. Não posicione nada fixo em `bottom-6 right-6`.
- Espaçamentos generosos: `gap-5`/`gap-6` entre cards, `p-5`–`p-8` dentro.

## Ícones — sempre Heroicons

- Use **somente [Heroicons v2](https://heroicons.com)**, variante **24 outline** (`fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"`). Variante **24 solid** (`fill="currentColor"`) só para controles de mídia preenchidos (play/pause/avançar/voltar) e ícones que precisam de peso visual.
- **Copie o `path` exato** do ícone oficial (site heroicons.com ou o pacote `heroicons` no npm, pasta `24/outline/`). Nunca desenhe ícone à mão nem aproxime coordenadas — ícones "parecidos" feitos à mão foram a origem dos bugs de ícones incompletos neste repositório.
- Não use Material Icons, Font Awesome, Lucide, emojis como ícone nem fontes de ícone.
- Exceção: logos de marca (GitHub, LinkedIn, Instagram) no sprite do hub, que o Heroicons não tem.
- Cor via `currentColor` (classes `text-term-*`), tamanho via `h-4 w-4` / `h-5 w-5` / `h-6 w-6`.
- Ícone decorativo leva `aria-hidden="true"`; botão só com ícone leva `aria-label`.
- Deixe um comentário com o nome do ícone acima do `<svg>`: `<!-- heroicons: arrow-down-tray -->`.

```html
<!-- heroicons: arrow-down-tray -->
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
```

## Tema claro/escuro — como funciona

- Preferência em `localStorage['tema']` (`'dark'` | `'light'`), compartilhada pelo hub e todos os projetos. Sem preferência salva, segue o sistema.
- `assets/js/tema.js` aplica a classe `.dark` antes de qualquer pintura (por isso é síncrono e vem primeiro). Também adiciona `.preload`, que desliga transições até a página carregar, evitando que o Tailwind via CDN anime as cores na entrada.
- `assets/js/app.js` injeta os botões flutuantes (`.fab`), alterna e salva o tema, e sincroniza abas abertas.
- O botão mostra a **lua** no tema claro e o **sol** no escuro (ícones Heroicons `moon`/`sun`).
- Nada disso deve ser reimplementado por projeto. Se precisar mudar o comportamento, mude em `assets/` — vale para todas as páginas de uma vez.

## Regras do Alpine.js

- Componente como função global em `js/app.js` (`function meuApp() { return {...} }` + `x-data="meuApp()"`) ou registrado com `document.addEventListener('alpine:init', () => Alpine.data('meuApp', () => ({...})))` + `x-data="meuApp"`. Os dois padrões existem no repo; mantenha o que o projeto já usa.
- **`init()` é chamado automaticamente pelo Alpine.** Nunca escreva `x-init="init()"` — isso executa duas vezes (listeners e timers duplicados).
- Limpe o que criar: `destroy()` com `clearInterval`, `cancelAnimationFrame`, `removeEventListener`.
- `x-cloak` em tudo que só deve aparecer depois do Alpine (estados vazios alternativos, modais, mensagens).
- **Não coloque `x-ref` dentro de `<template x-if>`** se ele for usado depois que o `x-if` some (ex.: `<input type="file">`). Deixe o input fora e use `x-show` para alternar a área.
- Depois de processar um `<input type="file">`, limpe `input.value = ''` ao resetar, senão escolher o mesmo arquivo de novo não dispara `change`.
- `<select x-model>` com opções geradas por `x-for`: adicione `:selected="valor === modelo"` na `<option>` para o valor inicial aparecer.
- Campos de texto somente leitura: use `:value`, não `x-text`.
- Botões sempre com `type="button"` (ou `type="submit"` dentro de `<form @submit.prevent>`).

## Boas práticas de JS

- `navigator.clipboard.writeText` dentro de `try/catch` (falha fora de HTTPS ou sem permissão).
- `localStorage` dentro de `try/catch` (modo privado pode bloquear).
- `URL.createObjectURL` sempre com `URL.revokeObjectURL` — com um pequeno `setTimeout` quando for um download.
- Aleatoriedade com fins de segurança (senhas, tokens): `crypto.getRandomValues`, nunca `Math.random`.
- `audio.play()` retorna promise: trate a rejeição.
- Chamadas a APIs: trate erro de rede **e** respostas de erro com status 200; mostre mensagem amigável em `text-term-danger`.
- Texto em bytes: `TextEncoder`/`TextDecoder` (UTF-8), não `charCodeAt`.
- Sem dependências desnecessárias: se dá para fazer com poucas linhas de JS, não adicione lib.

## Acessibilidade (mínimo)

- `lang="pt-BR"`, `<title>` no formato `Nome :: MicaelParise` e `<meta name="description">`.
- Todo campo com `<label for>` ou `aria-label`; todo botão de ícone com `aria-label`.
- Elementos clicáveis que não são `<button>`/`<a>`: `role="button" tabindex="0"` + `@keydown.enter`/`@keydown.space`.
- Mensagens dinâmicas com `role="status"`/`role="alert"` ou `aria-live="polite"`.
- Não remova o contorno de foco.

## Verificação antes de concluir

1. Sirva localmente da raiz do repo: `python -m http.server 8000` e abra `http://localhost:8000/` (abrir o arquivo direto em `file://` não reproduz o GitHub Pages).
2. Console sem erros (o aviso do Tailwind CDN sobre produção é esperado).
3. Teste nos **dois temas** com o botão flutuante e recarregue a página: o tema deve persistir sem piscar.
4. Teste em 390px de largura: sem rolagem horizontal, nada coberto pelos botões flutuantes.
5. Navegue pelo hub até o projeto e volte pelo botão de casa.
6. Teste o fluxo principal da ferramenta, incluindo estado vazio e erro.

## Commits

Mensagens em inglês, no imperativo, curtas (ex.: `Add Text Translator project, restyled to hub theme`).
