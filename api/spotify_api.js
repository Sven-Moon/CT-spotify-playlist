export class Spotify {
  constructor(client_id = '', client_secret = '') {
    this.authToken = ''
    this.client_id = client_id
    this.client_secret = client_secret
  }
  getAuth = async () => {
    var client_id = 'a1a633263cbb4481bb1ae465e85bdfad';
    var client_secret = 'bd7c1f3e82314640976140fedbf6209a';
    const encodedString = btoa(client_id + ':' + client_secret)
    const url = 'https://accounts.spotify.com/api/token'
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    }

    const response = await fetch(url, options)

    let token = await response.json();
    return token.access_token
  }
  loadToken = async () => {
    if (!this.authToken) {
      return await this.getAuth()
    }

  }
  getSong = async (artist, track) => {
    const token = await this.loadToken()
    await fetch(`https://api.spotify.com/v1/search?type=track&q=track:${track}+artist:${artist}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(data => {
        data = data.json()
        return data
      })
      .then((data) => {
        return data
        data = data.tracks.items[0]
        console.log('returning', data);
        return data
      }, err => { console.log(err) })
    // .catch(err => console.log(err))

    // console.log(data);
    // let aObj = new Audio(data.tracks.items[0].preview_url)
    // aObj.play()
  }
  getAlbum = async (album_id) => {
    const token = await this.loadToken()
    let data = await fetch(`https://api.spotify.com/v1/albums/${album_id
      }`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        response = response.json()
        return response
        // return data.tracks.items[0]
      })
      .then(data => {
        console.log(data);
        return {
          images: data.images,
          id: data.id,
          name: data.name
        }
      })
      .catch(err => console.log(err))
  }
  getArtist = async (artist) => {
    artist = this.strConvert(artist)
    const token = await this.loadToken()
    let data = await fetch(`https://api.spotify.com/v1/search?q=artist:${artist}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        response = response.json()
        console.log(response);
        return response
        // return data.tracks.items[0]
      })
      .then(data => { console.log(data); })
      .catch(err => console.log(err))
  }
  strConvert(str) {
    return str.replace(/\w/, '%20')
  }

}

const spot = new Spotify()



// document.getElementById('authbtn').addEventListener('click', spot.getSong('bush', 'comedown'))
// document.getElementById('authbtn').addEventListener('click', spot.getAlbum('5IJm0boSQuEBLiYNZJKV2Y'))