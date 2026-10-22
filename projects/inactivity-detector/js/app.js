const EVENTOS_DE_ATIVIDADE = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'];

function detectorInatividade() {
  return {
    segundos: 0,
    limiteInatividade: 10,
    duracaoMensagemSaida: 5000,
    estado: 'ativo', // ativo | inativo | encerrado
    intervalo: null,
    timeoutSaida: null,
    aoAtividade: null,

    get tempoFormatado() {
      const minutos = Math.floor(this.segundos / 60);
      const restoSegundos = this.segundos % 60;
      return `${String(minutos).padStart(2, '0')}:${String(restoSegundos).padStart(2, '0')}`;
    },

    // chamado automaticamente pelo Alpine
    init() {
      this.aoAtividade = () => this.registrarAtividade();
      EVENTOS_DE_ATIVIDADE.forEach((evento) => {
        window.addEventListener(evento, this.aoAtividade, { passive: true });
      });
      this.iniciarContagem();
    },

    destroy() {
      this.pararContagem();
      clearTimeout(this.timeoutSaida);
      EVENTOS_DE_ATIVIDADE.forEach((evento) => window.removeEventListener(evento, this.aoAtividade));
    },

    iniciarContagem() {
      this.pararContagem();
      this.intervalo = setInterval(() => this.avancarSegundo(), 1000);
    },

    pararContagem() {
      clearInterval(this.intervalo);
      this.intervalo = null;
    },

    avancarSegundo() {
      this.segundos++;
      if (this.segundos >= this.limiteInatividade) {
        this.estado = 'inativo';
        this.pararContagem();
      }
    },

    // so zera o contador enquanto ativo; com o aviso aberto ou a sessao
    // encerrada, a decisao fica com os botoes/timeout
    registrarAtividade() {
      if (this.estado !== 'ativo') return;
      this.segundos = 0;
    },

    continuar() {
      this.estado = 'ativo';
      this.segundos = 0;
      this.iniciarContagem();
    },

    encerrarSessao() {
      this.pararContagem();
      this.segundos = 0;
      this.estado = 'encerrado';
      clearTimeout(this.timeoutSaida);
      this.timeoutSaida = setTimeout(() => this.continuar(), this.duracaoMensagemSaida);
    },
  };
}
