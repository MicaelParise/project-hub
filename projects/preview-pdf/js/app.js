document.addEventListener('alpine:init', () => {
    Alpine.data('visualizadorPdf', () => ({
        arquivo: null,
        urlArquivo: null,
        arrastando: false,

        selecionar(evento) {
            const arquivo = evento.target.files[0];
            if (arquivo) this.definirArquivo(arquivo);
        },

        soltar(evento) {
            this.arrastando = false;
            const arquivo = evento.dataTransfer.files[0];
            if (arquivo && arquivo.type === 'application/pdf') this.definirArquivo(arquivo);
        },

        definirArquivo(arquivo) {
            this.revogarUrl();
            this.arquivo = arquivo;
            this.urlArquivo = URL.createObjectURL(arquivo);
        },

        remover() {
            this.revogarUrl();
            this.arquivo = null;
            this.$refs.entradaArquivo.value = '';
        },

        revogarUrl() {
            if (this.urlArquivo) URL.revokeObjectURL(this.urlArquivo);
            this.urlArquivo = null;
        },

        tamanho() {
            const kb = this.arquivo.size / 1024;
            return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
        },
    }));
});
