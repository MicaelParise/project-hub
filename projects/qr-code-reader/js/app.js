function leitorQr() {
  return {
    imagemUrl: null,
    resultado: null,
    erro: null,
    carregando: false,
    arrastando: false,
    copiado: false,

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
      this.erro = null;
      this.resultado = null;
      this.copiado = false;
      this.imagemUrl = URL.createObjectURL(arquivo);
      this.carregando = true;

      const dadosEnvio = new FormData();
      dadosEnvio.append('file', arquivo);

      try {
        const resposta = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
          method: 'POST',
          body: dadosEnvio,
        });
        const dados = await resposta.json();
        const textoLido = dados?.[0]?.symbol?.[0]?.data;

        if (!textoLido) {
          this.erro = 'Não foi possível ler o QR Code nessa imagem';
        } else {
          this.resultado = textoLido;
        }
      } catch {
        this.erro = 'Falha ao conectar com o serviço de leitura';
      } finally {
        this.carregando = false;
      }
    },

    copiar() {
      if (!this.resultado) return;
      navigator.clipboard.writeText(this.resultado);
      this.copiado = true;
      setTimeout(() => (this.copiado = false), 2000);
    },

    limpar() {
      this.imagemUrl = null;
      this.resultado = null;
      this.erro = null;
      this.copiado = false;
    },
  };
}
