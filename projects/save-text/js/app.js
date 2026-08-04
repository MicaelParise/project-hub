function salvarTexto() {
  return {
    conteudo:
      "Este é um texto de exemplo. Edite-o livremente, escolha um nome de arquivo e um formato de exportação, depois clique em salvar para baixá-lo.",
    nomeArquivo: "",
    formato: "text/plain",
    mostrarAviso: false,
    formatos: [
      { mime: "text/plain", rotulo: "Texto (.txt)", extensao: "txt" },
      { mime: "text/javascript", rotulo: "JavaScript (.js)", extensao: "js" },
      { mime: "text/html", rotulo: "HTML (.html)", extensao: "html" },
      { mime: "image/svg+xml", rotulo: "SVG (.svg)", extensao: "svg" },
      { mime: "application/msword", rotulo: "Word (.doc)", extensao: "doc" },
      { mime: "application/vnd.ms-powerpoint", rotulo: "PowerPoint (.ppt)", extensao: "ppt" },
    ],

    get formatoAtual() {
      return this.formatos.find((item) => item.mime === this.formato);
    },

    get podeSalvar() {
      return this.conteudo.trim().length > 0;
    },

    salvar() {
      if (!this.podeSalvar) return;

      const extensao = this.formatoAtual.extensao;
      const nomeBase = this.nomeArquivo.trim() || "documento";
      const nomeFinal = nomeBase.endsWith(`.${extensao}`) ? nomeBase : `${nomeBase}.${extensao}`;

      const blob = new Blob([this.conteudo], { type: this.formato });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = nomeFinal;
      link.click();

      URL.revokeObjectURL(url);

      this.mostrarAviso = true;
      setTimeout(() => (this.mostrarAviso = false), 2500);
    },
  };
}
