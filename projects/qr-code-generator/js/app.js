// Libera as transições/animações somente depois que tudo terminou de carregar,
// para nao "piscar" enquanto o Tailwind ainda esta injetando os estilos
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("preload");
  });
});

document.addEventListener("alpine:init", () => {
  Alpine.data("qrApp", () => ({
    texto: "",
    tamanho: 200,
    corFundo: "#ffffff",
    corFrente: "#377dff",
    gerado: false,
    linkDownload: "",
    nomeArquivo: "qrcode.png",

    get podeGerar() {
      return this.texto.trim().length > 0;
    },

    gerar() {
      if (!this.podeGerar) return;

      const container = this.$refs.qrContainer;
      container.innerHTML = "";
      new QRCode(container, {
        text: this.texto,
        width: this.tamanho,
        height: this.tamanho,
        colorDark: this.corFrente,
        colorLight: this.corFundo,
      });

      const canvas = container.querySelector("canvas");
      this.linkDownload = canvas.toDataURL("image/png");
      this.nomeArquivo = this.gerarNomeArquivo(this.texto);
      this.gerado = true;
    },

    gerarNomeArquivo(valor) {
      try {
        return `${new URL(valor).hostname}-qrcode.png`;
      } catch {
        const nomeLimpo = valor.replace(/[^a-zA-Z0-9]+/g, "");
        return `${nomeLimpo || "qrcode"}.png`;
      }
    },

    limparResultado() {
      this.gerado = false;
      this.linkDownload = "";
    },
  }));
});
