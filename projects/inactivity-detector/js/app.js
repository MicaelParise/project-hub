function detectorInatividade() {
  return {
    segundos: 0,
    limiteInatividade: 10,
    duracaoMensagemSaida: 5000,
    estado: "ativo", // ativo | inativo | encerrado
    intervalo: null,
    timeoutSaida: null,

    get tempoFormatado() {
      const minutos = Math.floor(this.segundos / 60);
      const restoSegundos = this.segundos % 60;
      return `${String(minutos).padStart(2, "0")}:${String(restoSegundos).padStart(2, "0")}`;
    },

    iniciarContagem() {
      this.pararContagem();
      this.intervalo = setInterval(() => this.avancarSegundo(), 1000);
    },

    pararContagem() {
      if (this.intervalo !== null) {
        clearInterval(this.intervalo);
        this.intervalo = null;
      }
    },

    avancarSegundo() {
      this.segundos++;
      if (this.segundos >= this.limiteInatividade) {
        this.estado = "inativo";
        this.pararContagem();
      }
    },

    registrarAtividade() {
      if (this.estado === "inativo" || this.estado === "encerrado") return;
      this.segundos = 0;
      this.estado = "ativo";
      this.iniciarContagem();
    },

    continuar() {
      this.estado = "ativo";
      this.segundos = 0;
      this.iniciarContagem();
    },

    encerrarSessao() {
      this.pararContagem();
      this.segundos = 0;
      this.estado = "encerrado";
      clearTimeout(this.timeoutSaida);
      this.timeoutSaida = setTimeout(() => {
        this.estado = "ativo";
        this.iniciarContagem();
      }, this.duracaoMensagemSaida);
    },

    init() {
      this.iniciarContagem();
      const eventos = ["mousemove", "mousedown", "keydown", "touchstart"];
      eventos.forEach((evento) => {
        window.addEventListener(evento, () => this.registrarAtividade());
      });
    },
  };
}
