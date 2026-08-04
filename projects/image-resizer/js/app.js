document.addEventListener('alpine:init', () => {
  Alpine.data('redimensionador', () => ({
    imagemCarregada: false,
    isDragging: false,
    nomeArquivo: '',
    urlPreview: '',
    imagemOriginal: null,
    largura: 0,
    altura: 0,
    proporcaoOriginal: 1,
    manterProporcao: true,
    reduzirQualidade: false,

    abrirSeletorArquivo() {
      this.$refs.inputArquivo.click();
    },

    selecionarArquivo(evento) {
      this.carregarArquivo(evento.target.files[0]);
    },

    soltarArquivo(evento) {
      this.isDragging = false;
      this.carregarArquivo(evento.dataTransfer.files[0]);
    },

    carregarArquivo(arquivo) {
      if (!arquivo || !arquivo.type.startsWith('image/')) return;

      const url = URL.createObjectURL(arquivo);
      const imagem = new Image();

      imagem.onload = () => {
        this.imagemOriginal = imagem;
        this.nomeArquivo = arquivo.name;
        this.largura = imagem.naturalWidth;
        this.altura = imagem.naturalHeight;
        this.proporcaoOriginal = imagem.naturalWidth / imagem.naturalHeight;
        this.urlPreview = url;
        this.imagemCarregada = true;
      };

      imagem.src = url;
    },

    ajustarAltura() {
      if (!this.manterProporcao || !this.largura) return;
      this.altura = Math.max(1, Math.floor(this.largura / this.proporcaoOriginal));
    },

    ajustarLargura() {
      if (!this.manterProporcao || !this.altura) return;
      this.largura = Math.max(1, Math.floor(this.altura * this.proporcaoOriginal));
    },

    trocarImagem() {
      if (this.urlPreview) URL.revokeObjectURL(this.urlPreview);
      this.imagemCarregada = false;
      this.imagemOriginal = null;
      this.urlPreview = '';
      this.$refs.inputArquivo.value = '';
    },

    baixarImagem() {
      const canvas = document.createElement('canvas');
      canvas.width = this.largura;
      canvas.height = this.altura;
      canvas.getContext('2d').drawImage(this.imagemOriginal, 0, 0, this.largura, this.altura);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', this.reduzirQualidade ? 0.5 : 1);
      link.download = `imagem-redimensionada-${Date.now()}.jpg`;
      link.click();
    },
  }));
});
