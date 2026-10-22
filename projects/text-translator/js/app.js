const URL_API = "https://api.mymemory.translated.net/get";

function tradutor() {
  return {
    idiomas,
    textoOrigem: "",
    textoDestino: "",
    idiomaOrigem: "pt-BR",
    idiomaDestino: "en-US",
    traduzindo: false,
    erro: "",
    copiadoOrigem: false,
    copiadoDestino: false,

    // ordenado pelo nome exibido (o objeto esta em ordem de codigo)
    get listaIdiomas() {
      return Object.entries(this.idiomas).sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
    },

    // chamado automaticamente pelo Alpine
    init() {
      this.$watch("textoOrigem", (valor) => {
        if (!valor.trim()) {
          this.textoDestino = "";
          this.erro = "";
        }
      });
    },

    async traduzir() {
      const texto = this.textoOrigem.trim();
      if (!texto || this.traduzindo) return;

      this.traduzindo = true;
      this.erro = "";
      const parametros = new URLSearchParams({ q: texto, langpair: `${this.idiomaOrigem}|${this.idiomaDestino}` });

      try {
        const resposta = await fetch(`${URL_API}?${parametros}`);
        const dados = await resposta.json();
        // a API responde HTTP 200 mesmo em erros (limite diario, par invalido...)
        if (Number(dados.responseStatus) !== 200) throw new Error(dados.responseDetails);

        const melhorCorrespondencia = dados.matches?.find((item) => item.id === 0);
        this.textoDestino = melhorCorrespondencia ? melhorCorrespondencia.translation : dados.responseData.translatedText;
      } catch {
        this.textoDestino = "";
        this.erro = "Não foi possível traduzir agora. Tente novamente em instantes.";
      } finally {
        this.traduzindo = false;
      }
    },

    trocarIdiomas() {
      [this.idiomaOrigem, this.idiomaDestino] = [this.idiomaDestino, this.idiomaOrigem];
      [this.textoOrigem, this.textoDestino] = [this.textoDestino, this.textoOrigem];
    },

    async copiar(campo) {
      const texto = campo === "origem" ? this.textoOrigem : this.textoDestino;
      if (!texto) return;

      try {
        await navigator.clipboard.writeText(texto);
      } catch {
        return; // clipboard indisponivel (ex.: pagina fora de https)
      }
      const flag = campo === "origem" ? "copiadoOrigem" : "copiadoDestino";
      this[flag] = true;
      setTimeout(() => (this[flag] = false), 1500);
    },

    falar(campo) {
      const texto = campo === "origem" ? this.textoOrigem : this.textoDestino;
      if (!texto || !("speechSynthesis" in window)) return;

      // interrompe a fala anterior em vez de enfileirar
      speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = campo === "origem" ? this.idiomaOrigem : this.idiomaDestino;
      speechSynthesis.speak(fala);
    },
  };
}
