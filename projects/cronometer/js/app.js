function cronometro() {
  return {
    rodando: false,
    marcaInicio: 0,
    decorridoAcumulado: 0,
    intervalo: null,
    horas: '00',
    minutos: '00',
    segundos: '00',
    centesimos: '00',

    iniciar() {
      if (this.rodando) return;
      this.rodando = true;
      this.marcaInicio = Date.now();
      this.intervalo = setInterval(() => this.atualizarMostrador(), 10);
    },

    pausar() {
      if (!this.rodando) return;
      this.rodando = false;
      clearInterval(this.intervalo);
      this.decorridoAcumulado += Date.now() - this.marcaInicio;
    },

    reiniciar() {
      clearInterval(this.intervalo);
      this.rodando = false;
      this.decorridoAcumulado = 0;
      this.atualizarMostrador();
    },

    atualizarMostrador() {
      const totalMs = this.decorridoAcumulado + (this.rodando ? Date.now() - this.marcaInicio : 0);

      this.centesimos = String(Math.floor((totalMs % 1000) / 10)).padStart(2, '0');
      this.segundos = String(Math.floor(totalMs / 1000) % 60).padStart(2, '0');
      this.minutos = String(Math.floor(totalMs / 60000) % 60).padStart(2, '0');
      this.horas = String(Math.floor(totalMs / 3600000)).padStart(2, '0');
    },
  };
}
