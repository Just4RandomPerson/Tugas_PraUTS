// document.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const artistName = urlParams.get('artist_name');
//     const albumName = urlParams.get('album_name');

//     let apiUrl = '/find/api';
//     if (artistName || albumName) {
//         apiUrl += `?artist_name=${artistName || ''}&album_name=${albumName || ''}`;
//     }

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(users => {
//             const userList = document.getElementById('user-list');
//             users.forEach(user => {
//                 const li = document.createElement('li');
//                 li.textContent = `${user.nama_artist} (${user.id_artist})`;
//                 userList.appendChild(li);
//             });
//         })
//         .catch(err => console.error('Error fetching users:', err));
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const artistName = urlParams.get('artist_name');
//     const albumName = urlParams.get('album_name');

//     if (artistName || albumName) {
//         const apiUrl = `/find/api?artist_name=${artistName}&album_name=${albumName}`;

//         fetch(apiUrl)
//             .then(response => response.json())
//             .then(data => {
//                 const userList = document.getElementById('user-list');
//                 userList.innerHTML = ''; // Clear existing content

//                 data.forEach(user => {
//                     const li = document.createElement('li');
//                     li.textContent = `Artist: ${user.nama_artist}, Album: ${user.album_name}`;
//                     userList.appendChild(li);
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }
// });
// document.addEventListener("DOMContentLoaded", () => {
//     const pathParts = window.location.pathname.split('/');
//     const artistName = pathParts[pathParts.length - 1];
//     const check = pathParts[pathParts.length - 3];
//     console.log(check)


//     if (artistName) {
//         // const apiUrl = `/find/api/${artistName}`;
//         const apiUrl = check ? `/find/api/${artistName}` : '/find/api';



//         fetch(apiUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('API Response:', data); // Log the API response
//                 let userList = document.getElementById('user-list');
//                 userList.innerHTML = ''; // Clear existing content

//                 if (data.length === 0) {
//                     userList.textContent = 'No results found';
//                 } else {
//                     data.forEach(user => {
//                         console.log('User:', user); // Log each user
//                         let li = document.createElement('li');
//                         console.log(li)
//                         li.textContent = `Artist: ${user.nama_artist} , ID : ${user.id_artist}`;
//                         userList.appendChild(li);
//                     });
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }
// });
async function addSong(id){
    async function addData(json) {
        let data_song = JSON.parse(json);
        return data_song
    }

    async function getData() {
        let link = `https://www.theaudiodb.com/api/v1/json/2/mvid.php?i=${id}`;
            try {
                let response = await fetch(link);
                if (response.ok) {
                    let jsonData = await response.text();
                    return await addData(jsonData);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                return null;
            }
    }
    return await getData();
}


// document.addEventListener("DOMContentLoaded", () => {
//     const searchBtn = document.getElementById('search-btn');
//     const searchArtist = document.getElementById('search_artist');
//     const searchSong = document.getElementById('search_song');
//     const userList = document.getElementById('user-list');

//     searchBtn.addEventListener('click', (event) => {
//         event.preventDefault();
//         const artistName = searchArtist.value.trim();
//         const songName = searchSong.value.trim();
//         if (!artistName && !songName) {
//             userList.textContent = 'Please insert song name or artist name';
//             throw new Error('Please insert song name or artist name');
//         }
//         let url = '/find';
//         if (artistName || songName) {
//             url += `?artist_name=${encodeURIComponent(artistName)}&song_name=${encodeURIComponent(songName)}`;
//         }
//         window.location.href = url;
//     });

//     const urlParams = new URLSearchParams(window.location.search);
//     const artistName = urlParams.get('artist_name');
//     const songName = urlParams.get('song_name');

//     function searchWords(wordList, searchTerm, existingSongs) {
//         const lowerSearchTerm = searchTerm.toLowerCase();
//         return wordList
//         .filter(item => item.strTrack.toLowerCase().startsWith(lowerSearchTerm))
//         .map(item => item.strTrack)
//         .filter(song => !existingSongs.includes(song));

//     }

//     const apiUrl = artistName || songName ? `/find/api?artist_name=${artistName}&song_name=${songName}` : '/find/api';

//     fetch(apiUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(async data => {
//             let userList = document.getElementById('user-list');
//             userList.innerHTML = ''; 

//             if (data.length === 0) {
//                 userList.textContent = 'No results found';
//             } else {
//                 let existingSongs = []
//                 for (const user of data) {
//                     const data_song = await addSong(user.id_artist);
//                     let data_song_filtered;
//                     if (songName !== null) {
//                         data_song_filtered = searchWords(data_song.mvids, songName, existingSongs);
//                     } else{
//                         data_song_filtered = data_song.mvids;
//                     }
//                     if (data_song && data_song.mvids) {
//                         data_song_filtered.forEach(element => {
//                             let li = document.createElement('li');
//                             li.textContent = `Artist: ${user.nama_artist}, ID: ${user.id_artist}, Song: ${typeof element !== 'object' ? element : element.strTrack}`;
//                             userList.appendChild(li);
//                         });
//                     } else {
//                         let li = document.createElement('li');
//                         li.textContent = `Artist: ${user.nama_artist}, ID: ${user.id_artist}, Song: No song data`;
//                         userList.appendChild(li);
//                     }
                    
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
// });

document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById('search-btn');
    const searchArtist = document.getElementById('search_artist');
    const searchSong = document.getElementById('search_song');
    const userList = document.getElementById('user-list');

    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const artistName = searchArtist.value.trim();
        const songName = searchSong.value.trim();
        if (!artistName && !songName) {
            userList.textContent = 'Please insert song name or artist name';
            throw new Error('Please insert song name or artist name');
        }
        let url = '/find';
        if (artistName || songName) {
            url += `?artist_name=${encodeURIComponent(artistName)}&song_name=${encodeURIComponent(songName)}`;
        }
        window.location.href = url;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const artistName = urlParams.get('artist_name');
    const songName = urlParams.get('song_name');

    function searchWords(wordList, searchTerm, existingSongs) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return wordList
            .filter(item => item.strTrack.toLowerCase().startsWith(lowerSearchTerm))
            .map(item => item.strTrack)
    }

    const apiUrl = artistName || songName ? `/find/api?artist_name=${artistName}&song_name=${songName}` : '/find/api';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            let userList = document.getElementById('user-list');
            userList.innerHTML = ''; 

            if (data.length === 0) {
                userList.textContent = 'No results found';
            } else {
                let existingSongs = [];
                for (const user of data) {
                    const data_song = await addSong(user.id_artist);
                    let data_song_filtered;
                    if (songName !== null) {
                        data_song_filtered = searchWords(data_song.mvids, songName);
                    } else {
                        data_song_filtered = data_song.mvids.map(item => item.strTrack).filter(song => !existingSongs.includes(song));
                    }
                    if (data_song && data_song.mvids) {
                        data_song_filtered.forEach(element => {
                            if (!existingSongs.includes(element)) {
                                let li = document.createElement('li');
                                li.textContent = `Artist: ${user.nama_artist}, ID: ${user.id_artist}, Song: ${typeof element !== 'object' ? element : element.strTrack}`;
                                userList.appendChild(li);
                                existingSongs.push(element);
                            }
                        });
                if (data_song_filtered.length === 0) {
                        let li = document.createElement('li');
                        li.textContent = `Artist: ${user.nama_artist}, ID: ${user.id_artist}, Song: No song data`;
                        userList.appendChild(li);
                }
                }
            }
        }})
        .catch(error => {
            console.error('Error fetching data:', error);
            userList.textContent = 'Error fetching data. Please try again later.';
        });
});