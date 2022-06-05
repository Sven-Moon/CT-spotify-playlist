import { Spotify } from '../api/spotify_api.js'
const spotify = new Spotify()

class Song {
  constructor(song) {
    this.album = song.album
    this.artists = song.artists
    this.disc_number = song.disc_number
    this.duration_ms = song.duration_ms
    this.id = song.id
    this.name = song.name
    this.audio = new Audio(song.preview_url)
    this.track_number = song.track_number
    this.type = song.type
    this.href = song.href
  }
  getAlbumArtwork(song) {
    spotify.getAlbum(song.album.id)
  }
  play() {
    this.audio.play()
  }
  pause() {
    this.audio.pause()
  }

}

class Playlist {
  constructor(name) {
    self.name = name
    self.list = []
    this.spotify = new Spotify()
  }

  addSong(song) {
    self.list.push()
  }
  removeSong(song_index) {
    self.list.splice(song_index, 1)
  }
  playSong(song_index) {
  }
}

export class Player {
  constructor(id) {
    this.togglePlaySearch = this.togglePlaySearch.bind(this)
    this.findSong = this.findSong.bind(this)
    const node = document.getElementById(id)
    this.createPlayer(node)
    this.attachListeners()
    this.selectedSong
    this.selectedPlaylist
    this.playLists = []
  }
  playSong(playlist, song_index) { }
  createPlaylist(name) {
    this.playlists.push(new Playlist(name))
  }
  selectPlaylist() {
    console.log('happy');
  }
  async findSong(e) {
    e.preventDefault()
    let artist = document.querySelector(".artist_input").value
    let song = document.querySelector(".song-title_input").value
    let data = await spotify.getSong(artist, song)
    console.log('returned data:', data);
    this.playlist.push(Song(data));
    console.log(this.playlist);
  }
  validateSearchInputs() {
    let artist = document.querySelector(".artist_input").value
    let song = document.querySelector(".song-title_input").value
    if (!song || !artist)
      document.querySelector('.search_btn').disabled = true
    else
      document.querySelector('.search_btn').disabled = false
  }
  togglePlaySearch() {
    document.querySelector(".song-finder").classList.toggle("hidden")
    document.querySelector(".song-player").classList.toggle("hidden")
  }
  createPlayer(node) {
    let playerNode = document.createElement("div")
    playerNode.className = "player_container"
    playerNode.innerHTML = `
    <div class="container song-player">
      <div class="row">
        <div class="playlist-name">Playlist Name</div>
        <button class="add-song highlight">+ Song</button>
      </div>
      <div class="row">
        <div class="play_btn highlight"><object data="../assets/images/play-button-green.svg" height="32" width="32"></object></div>
        <div class="playing">Artist/Title</div>
      </div>
    </div>
    <!-- add song -->
    <form class="container song-finder hidden">
      <div class="row">
        <input tabindex="10" type="text" class="artist_input text_input" placeholder="artist">
        <button tabindex="14" class="to-player highlight">Back to Player</button>
      </div>
      <div class="row">
        <input tabindex="11" class="song-title_input text_input" placeholder="song title">
        <button tabindex="12" class="search_btn highlight" >
        </button>
      </div>
      <div class="row search_results">
        <ul>
          <li>
            <button tabindex="13" class="add-song">Add to Playlist</button>
            <div class="song">
              <div class="song-name">Sample Song Name</div>
              <div class="song-artist">Some Artist</div>
            </div>
          </li>
        </ul>
      </div>
    </form> 
    <!-- end song-finder -->
    <div class="playlist">
      <div class="playlist_header"></div>
      <ul class="playlist-songs">
        <li class="playlist-item">
          <div class="play_btn highlight"><object data="../assets/images/play-button-green.svg" height="32" width="32"></object></div>
          <div class="song">
            <div class="song-name">Sample Song Name</div>
            <div class="song-artist">Some Artist - Some Album</div>
            <button class="remove-song"><object class="highlight round" data="../assets/images/remove.svg" height="20"
                width="20"></object></button>
          </div>
        </li>
      </ul>
    </div>`
    node.appendChild(playerNode)
  }
  attachListeners() {
    document.querySelector('.add-song').addEventListener("click", this.togglePlaySearch)
    document.querySelector('.to-player').addEventListener("click", this.togglePlaySearch)
    document.querySelector(".search_btn").addEventListener("click", this.findSong)
    document.querySelector(".artist_input").addEventListener("change", this.validateSearchInputs)
    document.querySelector(".song-title_input").addEventListener("change", this.validateSearchInputs)
  }

}