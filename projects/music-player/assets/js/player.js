// imagem usada quando a musica nao tem foto propria ou a foto falha ao carregar
const DEFAULT_IMG = "assets/images/disc.jpg";

// formata segundos para "m:ss"
function formatTime(totalSeconds) {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// componente Alpine que controla todo o player (dados em assets/js/songs.js)
function musicPlayer() {
  return {
    songs: allMusic,
    index: Math.floor(Math.random() * allMusic.length),
    playing: false,
    currentTime: 0,
    duration: 0,
    repeatMode: "playlist", // "playlist" | "one" | "shuffle"
    showList: false,
    showInfo: false,
    durations: {},

    // chamado automaticamente pelo Alpine
    init() {
      this.probeDurations();
      this.loadSong(false);
    },

    get current() {
      return this.songs[this.index];
    },

    get imgSrc() {
      return this.current.img ? `assets/images/${this.current.img}.jpg` : DEFAULT_IMG;
    },

    get progressPercent() {
      return this.duration ? (this.currentTime / this.duration) * 100 : 0;
    },

    get repeatTitle() {
      if (this.repeatMode === "playlist") return "Playlist em loop";
      if (this.repeatMode === "one") return "Música em loop";
      return "Ordem aleatória";
    },

    formatTime,

    // audio.play() devolve uma promise que rejeita se o navegador bloquear
    // a reproducao (ex.: sem interacao do usuario); ignoramos sem quebrar a UI
    play() {
      const promise = this.$refs.audio.play();
      if (promise) promise.catch(() => (this.playing = false));
    },

    // carrega a faixa atual no elemento <audio>; toca em seguida se autoplay for true
    loadSong(autoplay) {
      const audio = this.$refs.audio;
      audio.src = `assets/music/${this.current.src}.mp3`;
      this.currentTime = 0;
      this.duration = 0;
      if (autoplay) this.play();
    },

    togglePlay() {
      this.playing ? this.$refs.audio.pause() : this.play();
    },

    prev() {
      this.index = this.index <= 0 ? this.songs.length - 1 : this.index - 1;
      this.loadSong(true);
    },

    next() {
      this.index = this.index >= this.songs.length - 1 ? 0 : this.index + 1;
      this.loadSong(true);
    },

    selectSong(i) {
      this.index = i;
      this.loadSong(true);
    },

    cycleRepeat() {
      this.repeatMode =
        this.repeatMode === "playlist" ? "one" :
        this.repeatMode === "one" ? "shuffle" : "playlist";
    },

    // clique na barra de progresso: pula para o ponto clicado
    seek(event) {
      if (!this.duration) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      this.$refs.audio.currentTime = ratio * this.duration;
      this.play();
    },

    // setas do teclado na barra de progresso
    skipBy(seconds) {
      if (!this.duration) return;
      const audio = this.$refs.audio;
      audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), this.duration);
    },

    onEnded() {
      if (this.repeatMode === "playlist") {
        this.next();
      } else if (this.repeatMode === "one") {
        this.$refs.audio.currentTime = 0;
        this.play();
      } else {
        let randIndex = this.index;
        if (this.songs.length > 1) {
          while (randIndex === this.index) {
            randIndex = Math.floor(Math.random() * this.songs.length);
          }
        }
        this.index = randIndex;
        this.loadSong(true);
      }
    },

    // se a imagem da musica nao existir/falhar ao carregar, usa a imagem padrao
    onImgError(event) {
      if (!event.target.src.includes(DEFAULT_IMG)) {
        event.target.src = DEFAULT_IMG;
      }
    },

    // busca a duracao de cada faixa (fora do DOM) para exibir na lista de musicas
    probeDurations() {
      this.songs.forEach((song, i) => {
        const probe = new Audio();
        probe.preload = "metadata";
        probe.addEventListener("loadedmetadata", () => {
          this.durations[i] = formatTime(probe.duration);
          probe.removeAttribute("src");
        }, { once: true });
        probe.src = `assets/music/${song.src}.mp3`;
      });
    },
  };
}
