// Texto <-> binario usando bytes UTF-8, para que acentos e emojis
// sobrevivam a ida e volta (cada byte vira um grupo de 8 bits).
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function textToBinary(text) {
  return Array.from(encoder.encode(text), (byte) => byte.toString(2).padStart(8, '0')).join(' ');
}

// Retorna o texto decodificado e se algum bloco invalido foi descartado.
function binaryToText(binary) {
  const chunks = binary.trim().split(/\s+/).filter(Boolean);
  const valid = chunks.filter((chunk) => /^[01]{1,8}$/.test(chunk));
  const bytes = Uint8Array.from(valid, (chunk) => parseInt(chunk, 2));
  return { text: decoder.decode(bytes), invalid: valid.length !== chunks.length };
}

function converterApp() {
  return {
    mode: 'textToBinary',
    input: '',
    output: '',
    invalid: false,
    copied: false,

    get inputLabel() {
      return this.mode === 'textToBinary' ? 'Texto' : 'Binário';
    },
    get outputLabel() {
      return this.mode === 'textToBinary' ? 'Binário' : 'Texto';
    },
    get inputPlaceholder() {
      return this.mode === 'textToBinary' ? 'Digite um texto... ex: cat' : 'Digite um binário... ex: 01100011';
    },
    get outputPlaceholder() {
      return this.mode === 'textToBinary' ? 'O binário aparece aqui' : 'O texto aparece aqui';
    },

    convert() {
      if (this.mode === 'textToBinary') {
        this.output = textToBinary(this.input);
        this.invalid = false;
      } else {
        const result = binaryToText(this.input);
        this.output = result.text;
        this.invalid = result.invalid;
      }
    },

    setMode(mode) {
      if (this.mode === mode) return;
      this.mode = mode;
      this.clear();
    },

    swap() {
      this.mode = this.mode === 'textToBinary' ? 'binaryToText' : 'textToBinary';
      this.input = this.output;
      this.convert();
    },

    clear() {
      this.input = '';
      this.output = '';
      this.invalid = false;
    },

    async copyOutput() {
      if (!this.output) return;
      try {
        await navigator.clipboard.writeText(this.output);
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      } catch {
        // clipboard indisponivel (ex.: pagina fora de https)
      }
    },
  };
}
