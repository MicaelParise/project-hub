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

			if (arquivo.type && !arquivo.type.startsWith('text/')) {
				this.erro = `"${arquivo.name}" não é um arquivo de texto válido.`;
				return;
			}

			const leitor = new FileReader();
			leitor.onload = (evento) => {
				this.nomeArquivo = arquivo.name;
				this.conteudo = evento.target.result;
				this.arquivoSelecionado = true;
			};
			leitor.readAsText(arquivo);
		},

		limpar() {
			this.nomeArquivo = '';
			this.conteudo = '';
			this.arquivoSelecionado = false;
			this.erro = '';
			this.$refs.entrada.value = '';
		}
	};
}

// A transição de cores só é ligada depois que a página termina de carregar.
// Isso evita que o Tailwind (carregado via CDN) anime a troca da cor "crua" do
// navegador para a cor final assim que seu CSS é gerado, o que aparecia como
// um flash nos cards, textos e bordas ao recarregar a tela.
window.addEventListener('load', () => {
	requestAnimationFrame(() => {
		document.querySelectorAll('.js-transicao').forEach((elemento) => {
			elemento.classList.add('transition-colors');
		});
	});
});
