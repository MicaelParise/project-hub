// Imagens grandes sao reduzidas antes da leitura: o jsQR fica bem mais rapido
// e a precisao continua boa para QR Codes legiveis.
const LADO_MAXIMO_LEITURA = 1200;

// Le a imagem e devolve os pixels (ImageData) prontos para o jsQR.
function carregarPixels(arquivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const imagem = new Image();
    imagem.onload = () => {
      const escala = Math.min(1, LADO_MAXIMO_LEITURA / Math.max(imagem.naturalWidth, imagem.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(imagem.naturalWidth * escala);
      canvas.height = Math.round(imagem.naturalHeight * escala);
      const contexto = canvas.getContext('2d', { willReadFrequently: true });
      contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(contexto.getImageData(0, 0, canvas.width, canvas.height));
    };
    imagem.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('imagem invalida'));
    };
    imagem.src = url;
  });
}

function leitorQr() {
  return {
    imagemUrl: null,
    resultado: null,
    erro: null,
    carregando: false,
    arrastando: false,
    copiado: false,

    get eLink() {
      return /^https?:\/\//i.test(this.resultado || '');
    },

    selecionarArquivo(evento) {
      const arquivo = evento.target.files[0];
      if (arquivo) this.lerQrCode(arquivo);
    },

    soltarArquivo(evento) {
      this.arrastando = false;
      const arquivo = evento.dataTransfer.files[0];
      if (arquivo) this.lerQrCode(arquivo);
    },

    async lerQrCode(arquivo) {
      this.limpar();
      if (!arquivo.type.startsWith('image/')) {
        this.erro = 'Envie um arquivo de imagem (PNG, JPG ou WEBP)';
        return;
      }

      this.imagemUrl = URL.createObjectURL(arquivo);
      this.carregando = true;

      try {
        const pixels = await carregarPixels(arquivo);
        const codigo = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' });

        if (codigo && codigo.data) {
          this.resultado = codigo.data;
        } else {
          this.erro = 'Não foi possível ler o QR Code nessa imagem';
        }
      } catch {
        this.erro = 'Não foi possível abrir essa imagem';
      } finally {
        this.carregando = false;
      }
    },

    async copiar() {
      if (!this.resultado) return;
      try {
        await navigator.clipboard.writeText(this.resultado);
        this.copiado = true;
        setTimeout(() => (this.copiado = false), 2000);
      } catch {
        // clipboard indisponivel (ex.: pagina fora de https)
      }
    },

    limpar() {
      if (this.imagemUrl) URL.revokeObjectURL(this.imagemUrl);
      this.imagemUrl = null;
      this.resultado = null;
      this.erro = null;
      this.copiado = false;
      // permite escolher o mesmo arquivo de novo (senao o 'change' nao dispara)
      if (this.$refs.arquivo) this.$refs.arquivo.value = '';
    },
  };
}
