function ePdf(arquivo) {
  return arquivo.type === 'application/pdf' || arquivo.name.toLowerCase().endsWith('.pdf');
}

document.addEventListener('alpine:init', () => {
  Alpine.data('visualizadorPdf', () => ({
    arquivo: null,
    urlArquivo: null,
    arrastando: false,
    erro: '',

    get tamanho() {
      if (!this.arquivo) return '';
      const kb = this.arquivo.size / 1024;
      return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
    },

    selecionar(evento) {
      this.carregar(evento.target.files[0]);
    },

    soltar(evento) {
      this.arrastando = false;
      this.carregar(evento.dataTransfer.files[0]);
    },

    carregar(arquivo) {
      this.erro = '';
      if (!arquivo) return;
      if (!ePdf(arquivo)) {
        this.erro = `"${arquivo.name}" não é um arquivo PDF.`;
        return;
      }
      this.revogarUrl();
      this.arquivo = arquivo;
      this.urlArquivo = URL.createObjectURL(arquivo);
    },

    remover() {
      this.revogarUrl();
      this.arquivo = null;
      this.erro = '';
      // limpa o input para que selecionar o mesmo arquivo dispare 'change' de novo
      this.$refs.entradaArquivo.value = '';
    },

    revogarUrl() {
      if (this.urlArquivo) URL.revokeObjectURL(this.urlArquivo);
      this.urlArquivo = null;
    },
  }));
});
