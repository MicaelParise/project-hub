const CARACTERES = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
const TAMANHO_SENHA = 16;

// Indice aleatorio uniforme em [0, limite) usando o gerador criptografico.
// Descarta valores acima do maior multiplo de "limite" para evitar vies de modulo.
function indiceAleatorio(limite) {
  const maximoAceito = Math.floor(0x100000000 / limite) * limite;
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= maximoAceito);
  return buffer[0] % limite;
}

function criarSenha(tamanho) {
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += CARACTERES[indiceAleatorio(CARACTERES.length)];
  }
  return resultado;
}

function appSenha() {
  return {
    tamanho: TAMANHO_SENHA,
    senha: criarSenha(TAMANHO_SENHA),
    copiado: false,

    gerar() {
      this.senha = criarSenha(this.tamanho);
      this.copiado = false;
    },

    async copiar() {
      try {
        await navigator.clipboard.writeText(this.senha);
        this.copiado = true;
        setTimeout(() => (this.copiado = false), 2000);
      } catch {
        // clipboard indisponivel (ex.: pagina fora de https)
      }
    },
  };
}
