document.addEventListener('alpine:init', () => {
  Alpine.data('redimensionador', () => ({
    // canvas muito grandes estouram a memoria em navegadores moveis
    LIMITE_LADO: 8000,

    imagemCarregada: false,
    isDragging: false,
    baixando: false,
    nomeArquivo: '',
    urlPreview: '',
    imagemOriginal: null,
    largura: 0,
    altura: 0,
    proporcaoOriginal: 1,
    manterProporcao: true,
    reduzirQualidade: false,

    get dimensoesValidas() {
      const valido = (valor) => Number.isInteger(valor) && valor >= 1 && valor <= this.LIMITE_LADO;
      return valido(this.largura) && valido(this.altura);
    },

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
        if (this.urlPreview) URL.revokeObjectURL(this.urlPreview);
        this.imagemOriginal = imagem;
        this.nomeArquivo = arquivo.name;
        this.largura = imagem.naturalWidth;
        this.altura = imagem.naturalHeight;
        this.proporcaoOriginal = imagem.naturalWidth / imagem.naturalHeight;
        this.urlPreview = url;
        this.imagemCarregada = true;
      };
      imagem.onerror = () => URL.revokeObjectURL(url);

      imagem.src = url;
    },

    ajustarAltura() {
      if (!this.manterProporcao || !this.largura) return;
      this.altura = Math.max(1, Math.round(this.largura / this.proporcaoOriginal));
    },

    ajustarLargura() {
      if (!this.manterProporcao || !this.altura) return;
      this.largura = Math.max(1, Math.round(this.altura * this.proporcaoOriginal));
    },

    trocarImagem() {
      if (this.urlPreview) URL.revokeObjectURL(this.urlPreview);
      this.imagemCarregada = false;
      this.imagemOriginal = null;
      this.urlPreview = '';
      this.$refs.inputArquivo.value = '';
    },

    baixarImagem() {
      if (!this.dimensoesValidas || !this.imagemOriginal) return;
      this.baixando = true;

      const canvas = document.createElement('canvas');
      canvas.width = this.largura;
      canvas.height = this.altura;
      const contexto = canvas.getContext('2d');
      // JPEG nao tem transparencia: sem fundo, areas transparentes do PNG viram preto
      contexto.fillStyle = '#ffffff';
      contexto.fillRect(0, 0, canvas.width, canvas.height);
      contexto.drawImage(this.imagemOriginal, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          this.baixando = false;
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `imagem-redimensionada-${Date.now()}.jpg`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        },
        'image/jpeg',
        this.reduzirQualidade ? 0.5 : 0.92,
      );
    },
  }));
});
