function textToBinary(text) {
  return text
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

function binaryToText(binary) {
  return binary
    .trim()
    .split(/\s+/)
    .filter((chunk) => /^[01]+$/.test(chunk))
    .map((chunk) => String.fromCharCode(parseInt(chunk, 2)))
    .join('');
}

function converterApp() {
  return {
    mode: 'textToBinary',
    input: '',
    output: '',
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
      this.output = this.mode === 'textToBinary' ? textToBinary(this.input) : binaryToText(this.input);
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
    },

    copyOutput() {
      if (!this.output) return;
      navigator.clipboard.writeText(this.output);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    },
  };
}
