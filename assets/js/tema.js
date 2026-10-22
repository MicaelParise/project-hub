// Resolve o tema (claro/escuro) antes da primeira pintura, evitando flash (FOUC).
// Precisa ser carregado de forma SINCRONA no <head> (sem defer/async), antes do CSS.
// Preferencia salva em localStorage['tema'] ('dark' | 'light'), compartilhada
// entre o hub e todos os projetos; sem preferencia salva, segue o sistema.
(function () {
  var raiz = document.documentElement;
  var salvo = null;
  try {
    salvo = localStorage.getItem('tema');
  } catch (e) {
    // modo privado/armazenamento bloqueado: cai no tema do sistema
  }
  var escuro = salvo ? salvo === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  raiz.classList.toggle('dark', escuro);

  // O Tailwind via CDN injeta o CSS depois do primeiro paint; sem isso, as
  // classes transition-* animariam a troca das cores "cruas" para as do tema.
  // A classe e removida em assets/js/app.js quando a pagina termina de carregar.
  raiz.classList.add('preload');
})();
