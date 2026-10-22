// Periodos do dia: [inicio, fim) em horas. O icone e escolhido no HTML pelo campo "icone".
const PERIODOS_DO_DIA = [
  { inicio: 0, fim: 6, nome: 'Noite', saudacao: 'Boa noite', icone: 'noite' },
  { inicio: 6, fim: 12, nome: 'Manhã', saudacao: 'Bom dia', icone: 'manha' },
  { inicio: 12, fim: 16, nome: 'Tarde', saudacao: 'Boa tarde', icone: 'tarde' },
  { inicio: 16, fim: 19, nome: 'Entardecer', saudacao: 'Boa tarde', icone: 'entardecer' },
  { inicio: 19, fim: 24, nome: 'Noite', saudacao: 'Boa noite', icone: 'noite' },
];

const doisDigitos = (valor) => String(valor).padStart(2, '0');

function relogio() {
  return {
    horas: '00',
    minutos: '00',
    segundos: '00',
    periodo: PERIODOS_DO_DIA[0],
    intervalo: null,

    // chamado automaticamente pelo Alpine
    init() {
      this.atualizar();
      this.intervalo = setInterval(() => this.atualizar(), 1000);
    },

    destroy() {
      clearInterval(this.intervalo);
    },

    atualizar() {
      const agora = new Date();
      const hora = agora.getHours();

      this.horas = doisDigitos(hora);
      this.minutos = doisDigitos(agora.getMinutes());
      this.segundos = doisDigitos(agora.getSeconds());
      this.periodo = PERIODOS_DO_DIA.find((periodo) => hora >= periodo.inicio && hora < periodo.fim);
    },
  };
}
