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
    console.log(song);
    this.album = new Album(song.album.id)
    this.artists = song.artists.map(artist => artist.name).join(", ")
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
  play = () => {
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
    this.songs.push(song)
  }
  removeSong = (e) => {
    let song_index = parseInt(e.target.dataset.index)
    console.log(this.songs);
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
    this.updateSelectedPlaylist = this.updateSelectedPlaylist.bind(this)
    const node = document.getElementById(id)
    this.createPlayer(node)
    this.selectedSong
    this.foundSong
    this.selectedPlaylist
    this.playlists = sample_data
    this.populatePlaylistDropdown()
    this.attachListeners()
    if (!this.selectedPlaylist) document.querySelector("to-search").disabled = true
  }
  // PLAYLIST
  createPlaylist() {
    console.log('createPlaylist');
    let name = document.querySelector(".playlist-name_input>input")

    if (this.playlists?.map(playlist => playlist.name).includes(name.value)) {
      alert('You already have a playlist with that name. Try another.')
    } else {
      let new_playlist = new Playlist(name.value)
      this.playlists.push(new_playlist)
      this.selectedPlaylist = this.playlists[this.playlists.length - 1]
      // update field
      document.querySelector('.playlist-name>div').innerHTML = this.selectedPlaylist.name
    }
    this.populatePlaylistDropdown()
    this.populatePlaylistSongs()
    this.showPlaylistName()
    document.getElementsByClassName("to-search")[0].disabled = false
    name.value = ''
  }
  addSongToPlaylist = () => {
    console.log('addSongToPlaylist');
    const song = this.foundSong
    console.log(this.selectedPlaylist.songs)
    this.selectedPlaylist.addSong(song)
    this.populatePlaylistSongs()
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
    console.log('before loop:', this.selectedPlaylist.songs)
    this.selectedPlaylist?.songs?.forEach((song, i) => {
      let node = document.createElement("li")
      node.className = "playlist-item"
      let playButton = document.createElement("div")
      playButton.classList = "play_btn highlight"
      playButton.setAttribute('data-index', i)
      playButton.onclick = this.selectedPlaylist.songs[i].play
      // playButton.onclick = this.updateSelectedPlaylists
      // playButton.innerHTML = `<object data="../assets/images/play-button-green.svg" height="32" width="32">`
      node.appendChild(playButton)
      let song_el = document.createElement("div")
      song_el.className = "song"
      song_el.innerHTML = `
        <div class="song-info">
          <div class="song-name">${song.name}</div>
          <div class="song-meta">${song.artists} - ${song.album.name}</div>
        </div>
        <img src="${song.album.artwork_url}" alt="" class="album-art">
        <button class="remove-song"></button>`
      let removeButton = document.createElement("button")
      removeButton.className = "remove-song"
      removeButton.setAttribute("data-index", i)
      removeButton.onclick = (e) => {
        this.selectedPlaylist.removeSong(e)
        this.populatePlaylistSongs()
      }
      song_el.appendChild(removeButton)
      node.appendChild(song_el)
      playlistList.appendChild(node)
    })
    console.log(this.selectedPlaylist.songs)
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
      let node = document.createElement("li")
      node.innerHTML = `<li class="playlist-item" data-index=${i}>${playlist.name}</li>`
      node.className = "playlist-item"
      node.onclick = this.updateSelectedPlaylist
      list.appendChild(node)
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
    let index = parseInt(e.target.dataset.index)
    this.selectedPlaylist = this.playlists[index]
    let playlistName = document.querySelector('.playlist-name>div')
    playlistName.innerHTML = this.selectedPlaylist.name
    this.populatePlaylistSongs()
    console.log(this.selectedPlaylist);
  }
  showAddPlaylist() {
    console.log('showAddPlaylist');
    let pl_name = document.querySelector(".playlist-name")
    let pl_name_input = document.querySelector(".playlist-name_input")
    pl_name.classList.add("hidden")
    pl_name_input.classList.remove("hidden")
    document.querySelector
  }
  renamePlaylist() {
    // TODO 
  }
  removePlaylist() {
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
    node.innerHTML = `
        <button type="button" tabindex="13" class="add-song">Add to Playlist</button>
        <div class="song">
          <div class="song-info">
            <div class="song-name">${this.foundSong.name}</div>
            <div class="song-meta">${this.foundSong.artists} - ${this.foundSong.album.name}</div>
          </div>
          <img src="${this.foundSong.album.artwork_url}" alt="" class="album-art">
        </div>`
    document.querySelector(".add-song").onclick = this.addSongToPlaylist
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
          <input placeholder='Playlist Name' tabindex="1">
          <div class="playlist-add_btn highlight" tabindex="2"></div>          
          <button class="close-playlist-input highlight" tabindex="3"></button>
        </div>
        <button class="to-search highlight" tabindex="4">+ Song</button>        
      </div>
      <div class="row">
        <div class="play_btn highlight">
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
      <div class="playlist_header">${this.selectedPlaylist?.name || ''}</div>
      <ul class="playlist-songs">
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
    document.querySelector(".close-playlist-input").addEventListener("click", this.showPlaylistName)
    document.querySelector(".playlist-add_btn").addEventListener("click", this.createPlaylist)
  }
}

var sample_data = [{
  "name": "Walks on the Beach",
  "songs": [
    {
      "album": {
        "id": "5IJm0boSQuEBLiYNZJKV2Y",
        "name": "Sixteen Stone (Remastered)",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b273b915466e715e0bf6c3da35a1"
      },
      "artists": "Bush",
      "disc_number": 1,
      "duration_ms": 326666,
      "id": "2ox1STg6AbcEHoHWlFtFwr",
      "name": "Comedown",
      "audio": {},
      "track_number": 5,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/2ox1STg6AbcEHoHWlFtFwr"
    },
    {
      "album": {
        "id": "5nLESM0i6o7nWCyu7FAeb9",
        "name": "Razorblade Suitcase (In Addition)",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b273b96dce8b683b8be8126a2f5d"
      },
      "artists": "Bush",
      "disc_number": 1,
      "duration_ms": 291053,
      "id": "5eilSVtn5pkequUpyV6w9d",
      "name": "Swallowed",
      "audio": {},
      "track_number": 3,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/5eilSVtn5pkequUpyV6w9d"
    }
  ]
},
{
  "name": "Runs in the Woods",
  "songs": [
    {
      "album": {
        "id": "1SmsWlQZojAXz5H0i26bRl",
        "name": "Portrait Of An American Family",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b2736f83d341ac84cf0b995b554e"
      },
      "artists": "Marilyn Manson",
      "disc_number": 1,
      "duration_ms": 272800,
      "id": "1EYTOP6cIzADbgxCFG87ML",
      "name": "Lunchbox",
      "audio": {},
      "track_number": 3,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/1EYTOP6cIzADbgxCFG87ML"
    },
    {
      "album": {
        "id": "5dN7F9DV0Qg1XRdIgW8rke",
        "name": "American Idiot",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b27308a1b1e0674086d3f1995e1b"
      },
      "artists": "Green Day",
      "disc_number": 1,
      "duration_ms": 176346,
      "id": "6nTiIhLmQ3FWhvrGafw2zj",
      "name": "American Idiot",
      "audio": {},
      "track_number": 1,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/6nTiIhLmQ3FWhvrGafw2zj"
    },
    {
      "album": {
        "id": "3htGAnJ90pQHse0tRzxC56",
        "name": "Hang-Ups",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b2735e25d83362d98523fb82fc0d"
      },
      "artists": "Goldfinger",
      "disc_number": 1,
      "duration_ms": 185026,
      "id": "4X3qGigyU6ARi3HP4lWD95",
      "name": "Superman",
      "audio": {},
      "track_number": 1,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/4X3qGigyU6ARi3HP4lWD95"
    }
  ]
},
{
  "name": "Hikes in the Mountains",
  "songs": [
    {
      "album": {
        "id": "3gBVdu4a1MMJVMy6vwPEb8",
        "name": "Pablo Honey",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b273df55e326ed144ab4f5cecf95"
      },
      "artists": "Radiohead",
      "disc_number": 1,
      "duration_ms": 208666,
      "id": "5KZ0qobWEFl892YjIC02SE",
      "name": "You",
      "audio": {},
      "track_number": 1,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/5KZ0qobWEFl892YjIC02SE"
    },
    {
      "album": {
        "id": "0hHopYqXhuvYSHtVyrcb1g",
        "name": "Infinity On High",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b273ff59837e170f95a373afc0ec"
      },
      "artists": "Fall Out Boy",
      "disc_number": 1,
      "duration_ms": 230506,
      "id": "028njLMKzGg4gAVSgMeOhm",
      "name": "Hum Hallelujah",
      "audio": {},
      "track_number": 5,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/028njLMKzGg4gAVSgMeOhm"
    },
    {
      "album": {
        "id": "5dN7F9DV0Qg1XRdIgW8rke",
        "name": "American Idiot",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b27308a1b1e0674086d3f1995e1b"
      },
      "artists": "Green Day",
      "disc_number": 1,
      "duration_ms": 176346,
      "id": "6nTiIhLmQ3FWhvrGafw2zj",
      "name": "American Idiot",
      "audio": {},
      "track_number": 1,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/6nTiIhLmQ3FWhvrGafw2zj"
    }
  ]
}, {
  "name": "Rounding Up the Locals for Incineration",
  "songs": [
    {
      "album": {
        "id": "78bpIziExqiI9qztvNFlQu",
        "name": "AM",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163"
      },
      "artists": "Arctic Monkeys",
      "disc_number": 1,
      "duration_ms": 181049,
      "id": "4atMrAadB7dS8xn9vfk9PQ",
      "name": "Fireside",
      "audio": {},
      "track_number": 8,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/4atMrAadB7dS8xn9vfk9PQ"
    },
    {
      "album": {
        "id": "4FtOLTQqwnxpaABrJWYdBy",
        "name": "Rockin' The Suburbs",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b273d25c579ea362aeee960d0d6b"
      },
      "artists": "Ben Folds",
      "disc_number": 1,
      "duration_ms": 229506,
      "id": "7ny1jOJSZAF6VBb7x9DRO2",
      "name": "Fired",
      "audio": {},
      "track_number": 11,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/7ny1jOJSZAF6VBb7x9DRO2"
    },
    {
      "album": {
        "id": "36WLicHKpbEZ4CDR1KxZEW",
        "name": "Hungry Ghosts",
        "artwork_url": "https://i.scdn.co/image/ab67616d0000b273ebe2db76f82a04fb72aff6d5"
      },
      "artists": "OK Go",
      "disc_number": 1,
      "duration_ms": 256623,
      "id": "5ToLAwgBzQvfKyWcaqb2GI",
      "name": "The Great Fire",
      "audio": {},
      "track_number": 11,
      "type": "track",
      "href": "https://api.spotify.com/v1/tracks/5ToLAwgBzQvfKyWcaqb2GI"
    }
  ]
}]