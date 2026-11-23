const audio = document.getElementById('audio');
const tracks = [...document.querySelectorAll('.track')];
const playBtn = document.getElementById('playBtn');
const titleEl = document.getElementById('playerTitle');
const artistEl = document.getElementById('playerArtist');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const recentList = document.getElementById('recentList');
let currentIndex = -1;
const recent = [];

function timeLabel(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function loadTrack(index, autoplay = true) {
  if (!tracks.length) return;
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];
  audio.src = track.dataset.audio;
  titleEl.textContent = track.dataset.title;
  artistEl.textContent = track.dataset.artist;
  document.getElementById('playerCover').textContent = track.querySelector('.cover').textContent;
  tracks.forEach((item, i) => item.classList.toggle('selected', i === currentIndex));
  recent.unshift(`${track.dataset.title} — ${track.dataset.artist}`);
  if (recent.length > 4) recent.pop();
  recentList.textContent = recent.join('  •  ');
  if (autoplay) audio.play().catch(() => {
    playBtn.textContent = '▶';
    recentList.textContent = 'Audio could not start automatically. Press Play to try again.';
  });
}
function togglePlay() {
  if (currentIndex === -1) loadTrack(0, false);
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}
tracks.forEach((track, index) => track.addEventListener('click', () => loadTrack(index)));
playBtn.addEventListener('click', togglePlay);
document.getElementById('nextBtn').addEventListener('click', () => loadTrack(currentIndex + 1));
document.getElementById('prevBtn').addEventListener('click', () => loadTrack(currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1));
audio.addEventListener('play', () => playBtn.textContent = 'Ⅱ');
audio.addEventListener('pause', () => playBtn.textContent = '▶');
audio.addEventListener('timeupdate', () => {
  currentTimeEl.textContent = timeLabel(audio.currentTime);
  totalTimeEl.textContent = timeLabel(audio.duration);
  progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
});
audio.addEventListener('ended', () => loadTrack(currentIndex + 1));
progress.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});
document.getElementById('volume').addEventListener('input', e => audio.volume = Number(e.target.value));
audio.volume = 0.7;
document.getElementById('searchInput').addEventListener('input', e => {
  const query = e.target.value.toLowerCase().trim();
  tracks.forEach(track => {
    const match = `${track.dataset.title} ${track.dataset.artist} ${track.dataset.album || ''}`.toLowerCase().includes(query);
    track.style.display = match ? 'grid' : 'none';
  });
});
