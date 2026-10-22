document.addEventListener("alpine:init", () => {
  Alpine.data("qrApp", () => ({
    texto: "",
    tamanho: 200,
    corFundo: "#ffffff",
    corFrente: "#0a0e0a",
    gerado: false,
    erro: "",
    linkDownload: "",
    nomeArquivo: "qrcode.png",

    get podeGerar() {
      return this.texto.trim().length > 0;
    },

    gerar() {
      if (!this.podeGerar) return;
      this.erro = "";

      const container = this.$refs.qrContainer;
      container.innerHTML = "";
      try {
        new QRCode(container, {
          text: this.texto,
          width: this.tamanho,
          height: this.tamanho,
          colorDark: this.corFrente,
          colorLight: this.corFundo,
          correctLevel: QRCode.CorrectLevel.M,
        });
      } catch {
        // a lib lanca "code length overflow" quando o texto nao cabe no QR Code
        container.innerHTML = "";
        this.limparResultado();
        this.erro = "Texto longo demais para um QR Code. Tente encurtá-lo.";
        return;
      }

      const canvas = container.querySelector("canvas");
      this.linkDownload = canvas.toDataURL("image/png");
      this.nomeArquivo = this.gerarNomeArquivo(this.texto);
      this.gerado = true;
    },

    gerarNomeArquivo(valor) {
      try {
        return `${new URL(valor).hostname}-qrcode.png`;
      } catch {
        const nomeLimpo = valor.replace(/[^a-zA-Z0-9]+/g, "").slice(0, 40);
        return `${nomeLimpo || "qrcode"}.png`;
      }
    },

    limparResultado() {
      this.gerado = false;
      this.linkDownload = "";
      this.erro = "";
    },
  }));
});
