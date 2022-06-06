import { Spotify } from '../api/spotify_api.js'
const spotify = new Spotify()

class Album {
  constructor(id) {
    this.id = id
    this.name = ''
    this.artwork_url = ''
  }
}

class Song {
  constructor(song) {
    this.album = new Album(song.album.id)
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
  async getAlbumInfo(id) {
    const album = await spotify.getAlbum(id)
    this.album.artwork_url = album.images[0].url
    this.album.name = album.name
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
    this.name = name
    this.songs = []
    // this.spotify = new Spotify()
  }
  addSong(song) {
    console.log('before');
    this.songs.push(song)
    console.log('after');
  }
  removeSong(song_index) {
    this.songs.splice(song_index, 1)
  }
  playSong(song_index) {
  }
}

export class Player {
  constructor(id) {
    this.togglePlaySearch = this.togglePlaySearch.bind(this)
    this.createPlaylist = this.createPlaylist.bind(this)
    this.findSong = this.findSong.bind(this)
    this.showAddPlaylist = this.showAddPlaylist.bind(this)
    const node = document.getElementById(id)
    this.createPlayer(node)
    this.selectedSong
    this.foundSong
    this.selectedPlaylist
    this.playlists = []
    this.populatePlaylistDropdown()
    this.attachListeners()
  }
  playSong(playlist, song_index) { }
  async findSong(e) {
    console.log('findSong');
    e.preventDefault()
    let artist = document.querySelector(".artist_input").value
    let song = document.querySelector(".song-title_input").value
    let data = await spotify.getSong(artist, song)
    this.foundSong = new Song(data)
    await this.foundSong.getAlbumInfo(this.foundSong.album.id)
    this.renderFoundSong()
  }
  renderFoundSong() {
    console.log('renderFoundSong');
    let node = document.querySelector(".search_result")
    let artists = this.foundSong.artists.map(artist => artist.name).join(", ")
    node.innerHTML = `
        <button type="button" tabindex="13" class="add-song">Add to Playlist</button>
        <div class="song">
          <div class="song-info">
            <div class="song-name">${this.foundSong.name}</div>
            <div class="song-meta">${artists} - ${this.foundSong.album.name}</div>
          </div>
          <img src="${this.foundSong.album.artwork_url}" alt="" class="album-art">
          <button class="remove-song"></button>
        </div>`
    document.querySelector(".add-song").onclick = this.addSongToPlaylist
    console.log('found song after render: ', this.foundSong);
  }
  // PLAYLIST
  createPlaylist() {
    console.log('createPlaylist');
    let name = document.querySelector(".playlist-name_input>input").value
    if (this.playlists?.map(playlist => playlist.name).includes(name)) {
      alert('You already have a playlist with that name. Try another.')
    } else {
      let new_playlist = new Playlist(name)
      this.playlists.push(new_playlist)
      this.selectedPlaylist = this.playlists[this.playlists.length - 1]
      // update field
      document.querySelector('.playlist-name>div').innerHTML = this.selectedPlaylist.name
    }
    this.populatePlaylistDropdown()
    this.populatePlaylistSongs()
    this.showPlaylistName()
  }
  addSongToPlaylist = () => {
    const song = this.foundSong
    console.log('addSongToPlaylist');
    console.log(song);
    this.selectedPlaylist.addSong(song)
    console.log('before call add to');
  }
  showPlaylistName() {
    console.log('showPlaylistName');
    let pl_name = document.querySelector(".playlist-name")
    let pl_name_input = document.querySelector(".playlist-name_input")
    pl_name_input.classList.add("hidden")
    pl_name.classList.remove("hidden")
  }
  populatePlaylistSongs() {
    console.log('populatePlaylistSongs');
    let playlistList = document.querySelector(".playlist-songs")
    playlistList.innerHTML = ""
    console.log(this.selectedPlaylist);
    this.selectedPlaylist?.songs?.forEach(song => {
      playlistList.insertAdjacentHTML("beforeend", `<li class="playlist-item">
          <div class="play_btn highlight">
            <object data="../assets/images/play-button-green.svg" height="32" width="32"></object></div>
            <div class="song">
              <div class="song-info">
                <div class="song-name">${song.name}</div>
                <div class="song-meta">${song.artist} - ${song.album.name}</div>
              </div>
            <img src="${song.album.artwork_url}" alt="" class="album-art>
            <button class="remove-song"></button>
          </div>
        </li>`)
    })
  }
  // PLAYLIST - dropdown
  togglePlaylistDropdown() {
    console.log('togglePlaylistDropdown');
    const dropdown = document.querySelector(".playlistDropdown").classList
    dropdown.toggle("show")
  }
  populatePlaylistDropdown() {
    console.log('populatePlaylistDropdown');
    const list = document.querySelector(".playlistDropdown .playlist_list")
    list.innerHTML = ""
    this.playlists.forEach((playlist, i) => {
      console.log('playlist name: ', playlist.name);
      list.insertAdjacentHTML("afterbegin", `
      <li class="playlist-item" data-index=${i}>${playlist.name}</li>`)
    })
    let rename_node = document.createElement("li")
    rename_node.className = "rename-playlist"
    rename_node.innerHTML = "Rename Playlist"
    let add_node = document.createElement("li")
    add_node.className = "add-playlist"
    add_node.innerHTML = "+ Playlist"
    add_node.onclick = this.showAddPlaylist
    list.appendChild(rename_node)
    list.appendChild(add_node)
  }
  updateSelectedPlaylist(e) {
    console.log('updateSelectedPlaylist');
    let index = e.target.dataset.index
    this.selectedPlaylist = this.playlists[index]
    let playlistName = document.querySelector('.playlist-name')
    playlistName.innerHTML = playlist.name
  }
  showAddPlaylist() {
    console.log('showAddPlaylist');
    let pl_name = document.querySelector(".playlist-name")
    let pl_name_input = document.querySelector(".playlist-name_input")
    pl_name.classList.add("hidden")
    pl_name_input.classList.remove("hidden")
  }
  renamePlaylist() {
    // TODO 
  }
  // SONG SEARCH
  validateSearchInputs() {
    console.log('val inputs');
    let artist = document.querySelector(".artist_input").value
    let song = document.querySelector(".song-title_input").value
    if (!song || !artist)
      document.querySelector('.search_btn').disabled = true
    else
      document.querySelector('.search_btn').disabled = false
  }
  togglePlaySearch(e) {
    console.log('toggle PlaySearch');
    e.preventDefault()
    document.querySelector(".song-finder").classList.toggle("hidden")
    document.querySelector(".song-player").classList.toggle("hidden")
  }
  // PLAYER BUILD
  createPlayer(node) {
    console.log('create player');
    let playerNode = document.createElement("div")
    playerNode.className = "player_container"
    playerNode.innerHTML = `
    <div class="container song-player">
      <div class="row">
        <div class="playlist-name">
          <div>${this.selectedPlaylist?.name || "Make your first playlist!"}</div>
          <div class="playlist-menu_btn">            
          </div>
          <div class="playlistDropdown">
            <ul class="playlist_list">
            </ul>
          </div>
        </div>
        <div class="playlist-name_input hidden">
          <input placeholder='Playlist Name'>
          <div class="playlist-add_btn"></div>          
          <button class="close-playlist-input"></button>
        </div>
        <button class="to-search highlight">+ Song</button>        
      </div>
      <div class="row">
        <div class="play_btn highlight">
          <object data="../assets/images/play-button-green.svg" height="32" width="32"></object>
        </div>
        <div class="playing">${this.selectedSong || "--- / ---"}</div>
      </div>
    </div>
    <!-- add song -->
    <form class="container song-finder hidden">
      <div class="row">
        <input tabindex="10" type="text" class="artist_input text_input" placeholder="artist" value="bush">
        <button tabindex="14" class="to-player highlight">Back to Player</button>
      </div>
      <div class="row">
        <input tabindex="11" class="song-title_input text_input" placeholder="song title" value="comedown">
        <button tabindex="12" class="search_btn highlight" >
        </button>
      </div>
      <div class="row search_result"></div>
    </form>
    <!-- end song-finder -->
    <div class="playlist">
      <div class="playlist_header">Playlist Name</div>
      <ul class="playlist-songs">
        <li class="playlist-item">
          <div class="play_btn highlight"><object data="../assets/images/play-button-green.svg" height="32" width="32"></object></div>
          <div class="song">
            <div class="song-info">
              <div class="song-name">Song Name</div>
              <div class="song-meta">Some Artist - Some Album</div>
            </div>
            <img src="#" alt="" class="album-art>
            <button class="remove-song"></button>
          </div>
        </li>
        <li class="add-playlist"></li>
      </ul>
    </div>`
    node.appendChild(playerNode)
  }
  attachListeners() {
    document.querySelector('.to-search').addEventListener("click", this.togglePlaySearch)
    document.querySelector('.to-player').addEventListener("click", this.togglePlaySearch)
    document.querySelector(".search_btn").addEventListener("click", this.findSong)
    // Validate Search Inputs
    document.querySelector(".artist_input").addEventListener("change", this.validateSearchInputs)
    document.querySelector(".artist_input").addEventListener("keyup", this.validateSearchInputs)
    document.querySelector(".song-title_input").addEventListener("change", this.validateSearchInputs)
    document.querySelector(".song-title_input").addEventListener("keyup", this.validateSearchInputs)
    // Playlist Dropdown
    document.querySelector(".playlist-menu_btn").addEventListener("click", this.togglePlaylistDropdown)
    document.querySelector(".playlistDropdown").addEventListener("click", this.togglePlaylistDropdown)
    // document.querySelector(".add-playlist").addEventListener("click", this.showAddPlaylist)
    document.querySelector(".close-playlist-input").addEventListener("click", this.showPlaylistName)
    document.querySelector(".playlist-item").addEventListener("click", this.updateSelectedPlaylist)
    document.querySelector(".playlist-add_btn").addEventListener("click", this.createPlaylist)
    // Song Finder
    // document.querySelector(".add-song").addEventListener("click", this.addSongToPlaylist)
  }
}