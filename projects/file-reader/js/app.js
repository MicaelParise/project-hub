// extensoes aceitas mesmo quando o navegador nao informa um MIME text/*
// (ex.: .md costuma vir com type vazio no Windows)
const EXTENSOES_TEXTO = ['txt', 'md', 'html', 'css', 'js'];

function eArquivoDeTexto(arquivo) {
  const extensao = arquivo.name.split('.').pop().toLowerCase();
  return arquivo.type.startsWith('text/') || EXTENSOES_TEXTO.includes(extensao);
}

function leitorArquivos() {
  return {
    nomeArquivo: '',
    conteudo: '',
    arquivoSelecionado: false,
    arrastando: false,
    erro: '',

    selecionarArquivo(evento) {
      this.processarArquivo(evento.target.files[0]);
    },

    soltarArquivo(evento) {
      this.arrastando = false;
      this.processarArquivo(evento.dataTransfer.files[0]);
    },

    processarArquivo(arquivo) {
      this.erro = '';
      if (!arquivo) return;

      if (!eArquivoDeTexto(arquivo)) {
        this.erro = `"${arquivo.name}" não é um arquivo de texto válido.`;
        return;
      }

      const leitor = new FileReader();
      leitor.onload = (evento) => {
        this.nomeArquivo = arquivo.name;
        this.conteudo = evento.target.result;
        this.arquivoSelecionado = true;
      };
      leitor.onerror = () => {
        this.erro = `Não foi possível ler "${arquivo.name}".`;
      };
      leitor.readAsText(arquivo);
    },

    limpar() {
      this.nomeArquivo = '';
      this.conteudo = '';
      this.arquivoSelecionado = false;
      this.erro = '';
      this.$refs.entrada.value = '';
    },
  };
}
