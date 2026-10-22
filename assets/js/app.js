// Comportamento compartilhado por todas as paginas (hub + projetos):
//   - botao flutuante de tema (claro/escuro), persistido em localStorage['tema'];
//   - botao flutuante "voltar ao hub" (em todas as paginas, menos no hub);
//   - libera as transicoes CSS depois do carregamento (ver assets/js/tema.js).
// O markup dos botoes e injetado aqui para existir uma unica fonte de verdade,
// em vez de uma copia (e um bug diferente) por pagina. Nao depende do Alpine.
// Carregar com defer: <script src="../../assets/js/app.js" defer></script>
(function () {
  // resolvido a partir da URL deste arquivo, funciona em qualquer profundidade
  var URL_HUB = new URL('../../index.html', document.currentScript.src).href;

  // Heroicons 24/outline (https://heroicons.com) — mesmo padrao de todo o projeto
  function heroicon(d) {
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="' + d + '"/></svg>';
  }
  var ICONE_SOL = 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z';
  var ICONE_LUA = 'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z';
  var ICONE_CASA = 'm2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25';

  var raiz = document.documentElement;

  function aplicarTema(escuro) {
    raiz.classList.toggle('dark', escuro);
    var botao = document.querySelector('.theme-toggle');
    if (botao) botao.setAttribute('aria-pressed', String(escuro));
  }

  function alternarTema() {
    var escuro = !raiz.classList.contains('dark');
    aplicarTema(escuro);
    try {
      localStorage.setItem('tema', escuro ? 'dark' : 'light');
    } catch (e) {
      // sem armazenamento: o tema vale so para esta visita
    }
  }

  function criarControles() {
    var eHub = document.body.hasAttribute('data-hub');
    var controles = document.createElement('div');
    controles.className = 'controles-flutuantes';
    controles.innerHTML =
      (eHub ? '' : '<a class="fab" href="' + URL_HUB + '" aria-label="Voltar para o hub de projetos" title="Voltar ao hub">' + heroicon(ICONE_CASA) + '</a>') +
      '<button type="button" class="fab fab-destaque theme-toggle" aria-label="Alternar entre tema claro e escuro" title="Alternar tema">' +
        '<span class="icon-sun">' + heroicon(ICONE_SOL) + '</span>' +
        '<span class="icon-moon">' + heroicon(ICONE_LUA) + '</span>' +
      '</button>';
    document.body.appendChild(controles);
    controles.querySelector('.theme-toggle').addEventListener('click', alternarTema);
    aplicarTema(raiz.classList.contains('dark'));
  }

  // mantem abas abertas do hub/projetos sincronizadas quando o tema muda em outra aba
  window.addEventListener('storage', function (evento) {
    if (evento.key === 'tema' && evento.newValue) aplicarTema(evento.newValue === 'dark');
  });

  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      raiz.classList.remove('preload');
    });
  });

  criarControles();
})();
