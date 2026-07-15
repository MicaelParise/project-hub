// Estado do Alpine para o toggle de tema. O tema inicial ja foi aplicado
// de forma sincrona no <head> (ver index.html) para evitar flash;
// aqui o Alpine so passa a reagir a cliques do usuario.
// Registrado via 'alpine:init' (e nao como funcao global) para nao depender
// da ordem de carregamento entre este arquivo e o script do Alpine.
document.addEventListener('alpine:init', () => {
  Alpine.data('themeToggle', () => ({
    toggle() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('tema', isDark ? 'dark' : 'light');
    },
  }));
});
