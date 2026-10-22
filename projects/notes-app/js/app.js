const CHAVE_NOTAS = 'notas';

document.addEventListener('alpine:init', () => {
  Alpine.data('notasApp', () => ({
    notas: carregarNotas(),
    modalAberto: false,
    notaEmEdicaoId: null,
    confirmExcluirId: null,
    form: { titulo: '', descricao: '' },

    // ids sao Date.now(), entao ordenar por id = mais recentes primeiro
    get notasOrdenadas() {
      return [...this.notas].sort((a, b) => b.id - a.id);
    },

    abrirNovo() {
      this.notaEmEdicaoId = null;
      this.form = { titulo: '', descricao: '' };
      this.modalAberto = true;
      this.focarTitulo();
    },

    abrirEdicao(nota) {
      this.notaEmEdicaoId = nota.id;
      this.form = { titulo: nota.titulo, descricao: nota.descricao };
      this.modalAberto = true;
      this.focarTitulo();
    },

    focarTitulo() {
      // evita abrir o teclado virtual sozinho em telas pequenas
      this.$nextTick(() => {
        if (window.innerWidth > 640) this.$refs.campoTitulo.focus();
      });
    },

    fecharModal() {
      this.modalAberto = false;
    },

    salvar() {
      const titulo = this.form.titulo.trim();
      const descricao = this.form.descricao.trim();
      if (!titulo && !descricao) return;

      if (this.notaEmEdicaoId === null) {
        this.notas.push({ id: Date.now(), titulo, descricao, data: formatarData(new Date()) });
      } else {
        const nota = this.notas.find((n) => n.id === this.notaEmEdicaoId);
        if (nota) {
          nota.titulo = titulo;
          nota.descricao = descricao;
          nota.data = formatarData(new Date());
        }
      }

      this.persistir();
      this.fecharModal();
    },

    pedirExclusao(id) {
      this.confirmExcluirId = id;
    },

    cancelarExclusao() {
      this.confirmExcluirId = null;
    },

    confirmarExclusao() {
      this.notas = this.notas.filter((n) => n.id !== this.confirmExcluirId);
      this.persistir();
      this.confirmExcluirId = null;
    },

    persistir() {
      try {
        localStorage.setItem(CHAVE_NOTAS, JSON.stringify(this.notas));
      } catch {
        // armazenamento cheio ou bloqueado: as notas ficam so nesta sessao
      }
    },
  }));
});

function carregarNotas() {
  try {
    const notas = JSON.parse(localStorage.getItem(CHAVE_NOTAS));
    return Array.isArray(notas) ? notas : [];
  } catch {
    return [];
  }
}

function formatarData(data) {
  return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}
