const doisDigitos = (valor) => String(valor).padStart(2, '0');

function cronometro() {
  return {
    rodando: false,
    marcaInicio: 0,
    decorridoAcumulado: 0,
    quadro: null,
    horas: '00',
    minutos: '00',
    segundos: '00',
    centesimos: '00',

    iniciar() {
      if (this.rodando) return;
      this.rodando = true;
      this.marcaInicio = performance.now();
      this.agendarQuadro();
    },

    pausar() {
      if (!this.rodando) return;
      this.decorridoAcumulado += performance.now() - this.marcaInicio;
      this.rodando = false;
      cancelAnimationFrame(this.quadro);
      this.atualizarMostrador();
    },

    reiniciar() {
      cancelAnimationFrame(this.quadro);
      this.rodando = false;
      this.decorridoAcumulado = 0;
      this.atualizarMostrador();
    },

    // requestAnimationFrame acompanha a taxa de atualizacao da tela
    // e pausa sozinho com a aba em segundo plano (o tempo e recalculado ao voltar)
    agendarQuadro() {
      this.quadro = requestAnimationFrame(() => {
        this.atualizarMostrador();
        if (this.rodando) this.agendarQuadro();
      });
    },

    // destroy() e chamado pelo Alpine se o componente for removido
    destroy() {
      cancelAnimationFrame(this.quadro);
    },

    atualizarMostrador() {
      const totalMs = this.decorridoAcumulado + (this.rodando ? performance.now() - this.marcaInicio : 0);

      this.centesimos = doisDigitos(Math.floor((totalMs % 1000) / 10));
      this.segundos = doisDigitos(Math.floor(totalMs / 1000) % 60);
      this.minutos = doisDigitos(Math.floor(totalMs / 60000) % 60);
      this.horas = doisDigitos(Math.floor(totalMs / 3600000));
    },
  };
}
