// imagem usada quando a musica nao tem foto propria ou a foto falha ao carregar
const DEFAULT_IMG = "assets/images/disc.jpg";

// formata segundos para "m:ss"
function formatTime(totalSeconds) {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  if (seconds < 10) seconds = `0${seconds}`;
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
    repeatMode: "repeat", // "repeat" | "repeat_one" | "shuffle"
    showList: false,
    showInfo: false,
    durations: {},

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
      if (this.repeatMode === "repeat") return "Playlist em loop";
      if (this.repeatMode === "repeat_one") return "Música em loop";
      return "Ordem aleatória";
    },

    formatTime,

    // carrega a faixa atual no elemento <audio>; toca em seguida se autoplay for true
    loadSong(autoplay) {
      const audio = this.$refs.audio;
      audio.src = `assets/music/${this.current.src}.mp3`;
      this.currentTime = 0;
      this.duration = 0;
      if (autoplay) audio.play();
    },

    togglePlay() {
      const audio = this.$refs.audio;
      this.playing ? audio.pause() : audio.play();
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
        this.repeatMode === "repeat" ? "repeat_one" :
        this.repeatMode === "repeat_one" ? "shuffle" : "repeat";
    },

    // clique na barra de progresso: pula para o ponto clicado
    seek(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const audio = this.$refs.audio;
      audio.currentTime = ratio * (this.duration || 0);
      audio.play();
    },

    onEnded() {
      const audio = this.$refs.audio;
      if (this.repeatMode === "repeat") {
        this.next();
      } else if (this.repeatMode === "repeat_one") {
        audio.currentTime = 0;
        audio.play();
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
        const probe = new Audio(`assets/music/${song.src}.mp3`);
        probe.addEventListener("loadedmetadata", () => {
          this.durations[i] = formatTime(probe.duration);
        });
      });
    },
  };
}
