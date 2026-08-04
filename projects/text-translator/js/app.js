function tradutor() {
  return {
    idiomas,
    textoOrigem: "",
    textoDestino: "",
    idiomaOrigem: "pt-PT",
    idiomaDestino: "en-GB",
    traduzindo: false,
    copiadoOrigem: false,
    copiadoDestino: false,

    async traduzir() {
      const texto = this.textoOrigem.trim();
      if (!texto) return;

      this.traduzindo = true;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${this.idiomaOrigem}|${this.idiomaDestino}`;

      try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const melhorCorrespondencia = dados.matches?.find((item) => item.id === 0);
        this.textoDestino = melhorCorrespondencia ? melhorCorrespondencia.translation : dados.responseData.translatedText;
      } catch (erro) {
        this.textoDestino = "Não foi possível traduzir agora. Tente novamente.";
      } finally {
        this.traduzindo = false;
      }
    },

    trocarIdiomas() {
      [this.idiomaOrigem, this.idiomaDestino] = [this.idiomaDestino, this.idiomaOrigem];
      [this.textoOrigem, this.textoDestino] = [this.textoDestino, this.textoOrigem];
    },

    limparDestinoSeVazio() {
      if (!this.textoOrigem) this.textoDestino = "";
    },

    async copiar(campo) {
      const texto = campo === "origem" ? this.textoOrigem : this.textoDestino;
      if (!texto) return;

      await navigator.clipboard.writeText(texto);
      const flag = campo === "origem" ? "copiadoOrigem" : "copiadoDestino";
      this[flag] = true;
      setTimeout(() => (this[flag] = false), 1500);
    },

    falar(campo) {
      const texto = campo === "origem" ? this.textoOrigem : this.textoDestino;
      if (!texto) return;

      const idioma = campo === "origem" ? this.idiomaOrigem : this.idiomaDestino;
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = idioma;
      speechSynthesis.speak(fala);
    },
  };
}
