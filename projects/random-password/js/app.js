function appSenha() {
  const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const tamanho = 16;

  const criarSenha = () => {
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return resultado;
  };

  return {
    senha: criarSenha(),
    copiado: false,

    gerar() {
      this.senha = criarSenha();
      this.copiado = false;
    },

    async copiar() {
      await navigator.clipboard.writeText(this.senha);
      this.copiado = true;
      setTimeout(() => (this.copiado = false), 2000);
    }
  };
}
