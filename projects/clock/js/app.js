const elementoHoras = document.getElementById('valor-horas');
const elementoMinutos = document.getElementById('valor-minutos');
const elementoSegundos = document.getElementById('valor-segundos');
const elementoRotuloPeriodo = document.getElementById('rotulo-periodo');
const elementoSaudacao = document.getElementById('saudacao');
const elementoIconePeriodo = document.getElementById('icone-periodo');

const PERIODOS_DO_DIA = [
  {
    inicio: 6,
    fim: 12,
    nome: 'Manhã',
    saudacao: 'Bom dia',
    icone: '<path d="M12 3v4"/><path d="M5.6 8.6 8 11"/><path d="M18.4 8.6 16 11"/><path d="M3 15h18"/><path d="M6 15a6 6 0 0 1 12 0"/><path d="M2 19h20"/>',
  },
  {
    inicio: 12,
    fim: 16,
    nome: 'Tarde',
    saudacao: 'Boa tarde',
    icone: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>',
  },
  {
    inicio: 16,
    fim: 19,
    nome: 'Entardecer',
    saudacao: 'Boa tarde',
    icone: '<path d="M12 17V9"/><path d="M8 11l4-4 4 4"/><path d="M2 17h20"/><path d="M5 21h14"/>',
  },
  {
    inicio: 19,
    fim: 24,
    nome: 'Noite',
    saudacao: 'Boa noite',
    icone: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/><path d="M17 3l.4 1.2L18.6 4.6l-1.2.4L17 6.2l-.4-1.2-1.2-.4 1.2-.4Z"/>',
  },
  {
    inicio: 0,
    fim: 6,
    nome: 'Noite',
    saudacao: 'Boa noite',
    icone: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/><path d="M17 3l.4 1.2L18.6 4.6l-1.2.4L17 6.2l-.4-1.2-1.2-.4 1.2-.4Z"/>',
  },
];

let periodoAtivo = null;

function encontrarPeriodo(hora) {
  return PERIODOS_DO_DIA.find((periodo) => hora >= periodo.inicio && hora < periodo.fim);
}

function aplicarPeriodo(periodo) {
  elementoRotuloPeriodo.textContent = periodo.nome;
  elementoSaudacao.textContent = periodo.saudacao;
  elementoIconePeriodo.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-full w-full">${periodo.icone}</svg>`;
}

function atualizarRelogio() {
  const agora = new Date();
  const hora = agora.getHours();

  elementoHoras.textContent = String(hora).padStart(2, '0');
  elementoMinutos.textContent = String(agora.getMinutes()).padStart(2, '0');
  elementoSegundos.textContent = String(agora.getSeconds()).padStart(2, '0');

  const periodo = encontrarPeriodo(hora);
  if (periodo !== periodoAtivo) {
    aplicarPeriodo(periodo);
    periodoAtivo = periodo;
  }
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);
