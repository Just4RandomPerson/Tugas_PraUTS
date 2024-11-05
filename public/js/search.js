feather.replace()

const icons = document.querySelectorAll('.icons'); 
const modal_artist = document.querySelector('#modal-artist');
const closeBtn = document.getElementById('close-btn');
const closBtnModal = document.querySelectorAll('.close-btn-modal');
const navBar = document.getElementById('nav-bar');
const rightMenu = document.getElementById('right-menu');
const search = document.getElementById('search-btn');
const awal = document.getElementById('awal')
const akhir = document.getElementById('akhir')
const searchArtist = document.getElementById('search_artist');
const searchSong = document.getElementById('search_song');
const userList = document.getElementById('user-list');

// ketika nama artist ditekan
// namaArtist.forEach((artist) => {
//     artist.addEventListener('click', ()=> {
//         modal_artist.style.display='block'
//     })
// })


closBtnModal.forEach(btn => {
    btn.addEventListener('click', () => {
        modal_artist.style.display = 'none'
    })
})

window.addEventListener('click', (event) => {
    if (event.target === modal_artist){
        modal_artist.style.display = 'none'
    }
})

// untuk bagian right-menu 
navBar.addEventListener('click', () => {
    rightMenu.style.display = 'block'
    navBar.style.display = 'none'
})

closeBtn.addEventListener('click', () =>{
    rightMenu.style.display = 'none'
    navBar.style.display = 'block'
})

window.addEventListener('click', (event) => {
    if (event.target === rightMenu){
        rightMenu.style.display = 'none'
        navBar.style.display = 'block'
    }
})

async function addSong(id){
    async function addDataSong(json) {
        let data_song = JSON.parse(json);
        return data_song
    }

    async function getDataSong() {
        let link = `https://www.theaudiodb.com/api/v1/json/2/mvid.php?i=${id}`;
            try {
                let response = await fetch(link);
                if (response.ok) {
                    let jsonData = await response.text();
                    return await addDataSong(jsonData);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                return null;
            }
    }
    return await getDataSong();
}

async function addArtist(id){
    async function addDataArtist(json) {
        let data_artist = JSON.parse(json);
        return data_artist
    }

    async function getDataArtist() {
        let link = `https://www.theaudiodb.com/api/v1/json/2/artist.php?i=${id}`;
            try {
                let response = await fetch(link);
                if (response.ok) {
                    let jsonData = await response.text();
                    return await addDataArtist(jsonData);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                return null;
            }
    }
    return await getDataArtist();
}

function addArtistNameEventListeners(data, artist=null) {
    if (artist){
        const songName = null;
        fetch(`/find/api?artist_name=${artist}&song_name=${songName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(async data => {
                    if (data.length === 0) {
                        userList.textContent = 'No results found';
                    } else {
                        let existingSongs = [];
                        let histori = [];
                        let groupedResults = {};
                        let data_artist = {}

                        for (const user of data) { // Iterate over each user object in the data array
                            const data_song = await addSong(user.id_artist);
                            if (!data_artist[user.nama_artist]) {
                                data_artist[user.nama_artist] = [];
                            }
                            data_artist[user.nama_artist].push(await addArtist(user.id_artist));
                            let data_song_filtered;
                            if (songName !== null) {
                                data_song_filtered = searchWords(data_song.mvids, songName, existingSongs);
                            } else {
                                data_song_filtered = data_song.mvids.filter(song => !existingSongs.includes(song.strTrack));
                            }
                            if (data_song && data_song.mvids) {
                                if (!groupedResults[user.nama_artist]) {
                                    groupedResults[user.nama_artist] = [];
                                }
                                data_song_filtered.forEach(element => {
                                    if (!existingSongs.includes(element.strTrack)) {
                                        groupedResults[user.nama_artist].push(element);
                                        existingSongs.push(element.strTrack);
                                        // console.log(existingSongs)
                                        histori.push(element.strTrack);
                                    }
                                });
                            }
                        }
                        groupedResults[artist].forEach(el => {
                            const list_lagu = document.getElementById('list-lagu');
                            const a = document.createElement('a');
                            a.href = el.strMusicVid;
                            a.target = '_blank';
                            a.textContent = el.strTrack;
                            a.className = 'lagu';

                            list_lagu.appendChild(a);
                    })}})

        modal_artist.style.display = 'block';

        // Populate modal with artist information
        document.getElementById('nama-modal').textContent = data[artist][0]['artists'][0].strArtist;
        document.getElementById('gambar-modal').src = data[artist][0]['artists'][0].strArtistThumb;
        document.getElementById('gambar-modal').alt = data[artist][0]['artists'][0].strArtist;
        const selectElement = document.getElementById('bahasa');
        const descriptionText = document.getElementById('description-text');
        selectElement.value = 'EN';
        descriptionText.textContent = data[artist][0]['artists'][0].strBiographyEN;
        selectElement.addEventListener('change', () => {
        const selectedLanguage = selectElement.value;
            // Update the description text based on the selected language
            descriptionText.textContent =  data[artist][0]['artists'][0][`strBiography${selectedLanguage}`] || 'No description available';
        });
        document.getElementById('tanggal_lahir').textContent = data[artist][0]['artists'][0].intFormedYear;

        let chrome = document.getElementById('chrome');
        if (chrome) {
            chrome.onclick = (event) => {
            event.preventDefault(); // Prevent default action

            // Ensure the data object is populated and has the correct structure
            if (data[artist] && data[artist][0] && data[artist][0]['artists'][0].strWebsite) {
                let websiteUrl = data[artist][0]['artists'][0].strWebsite;
                if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
                    websiteUrl = 'http://' + websiteUrl; // Add protocol if missing
                }
                chrome.href = websiteUrl;
                window.open(chrome.href, '_blank'); // Open the URL in a new tab
            } else {
                alert('Website URL not found for this artist');
                }
            };
        } else {
            console.error('Element with ID "chrome" not found');
        }
            
        let fb = document.getElementById('facebook');
        if (fb) {
            fb.onclick = (event) => {
                event.preventDefault(); // Prevent default action
                // Ensure the data object is populated and has the correct structure
                if (data[artist] && data[artist][0] && data[artist][0]['artists'][0].strFacebook) {
                    let websiteUrl = data[artist][0]['artists'][0].strFacebook;
                    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
                        websiteUrl = 'http://' + websiteUrl; // Add protocol if missing
                    }
                    chrome.href = websiteUrl;
                    window.open(chrome.href, '_blank'); // Open the URL in a new tab
                } else {
                    alert('Facebook URL not found for this artist');
                }
            };
        } else {
            console.error('Element with ID "facebook" not found');
        }


    }else{
        const namaArtist = document.querySelectorAll('.artist-name');
        namaArtist.forEach((artist) => {
        artist.addEventListener('click', () => {
            window.location.href = `http://localhost:8000/find?artist=${encodeURIComponent(artist.textContent)}`;
        });
    });

    }
    
}

// function Addresult() {
//         awal.style.display = 'none'
//         akhir.style.display = 'block'

//         let result = document.getElementById('result');
//         let h1 = document.createElement('h1');
//         h1.textContent = 'Result';
//         result.appendChild(h1);
//         akhir.appendChild(result);

// }
    


document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const artist = urlParams.get('artist');

    if (artist) {
        fetch(`http://localhost:8000/find/api?artist_name=${encodeURIComponent(artist)}&song_name=`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            if (data.length === 0) {
                userList.textContent = 'No results found';
            } else {
            let data_artist = {}

            for (const user of data) {
                if (!data_artist[user.nama_artist]) {
                    data_artist[user.nama_artist] = [];
                }
                data_artist[user.nama_artist].push(await addArtist(user.id_artist));
            }
            addArtistNameEventListeners(data_artist, artist);
            }})
    }

    search.addEventListener('click', (event) => {
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

    const artistName = urlParams.get('artist_name');
    const songName = urlParams.get('song_name');

    function searchWords(wordList, searchTerm, existingSongs) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return wordList
            .filter(item => item.strTrack.toLowerCase().startsWith(lowerSearchTerm))
            // .map(item => item.strTrack)
    }

    if( artistName || songName){
        apiUrl =  `/find/api?artist_name=${artistName}&song_name=${songName}`
    } else {
            fetch(`http://localhost:8000/find/api?artist_name=&song_name=`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(async data => {
                    userList.innerHTML = '';
                    if (data.length === 0) {
                        userList.textContent = 'No results found';
                    } else {
                    let data_artist = {}

                    for (const user of data) {
                        if (!data_artist[user.nama_artist]) {
                            data_artist[user.nama_artist] = [];
                        }
                        data_artist[user.nama_artist].push(await addArtist(user.id_artist));

                        const sectionAwal = document.getElementById('awal');

                        // Create the artist div
                        const artistDiv = document.createElement('div');
                        artistDiv.className = 'artist';

                        // Create the perkenalan div
                        const perkenalanDiv = document.createElement('div');
                        perkenalanDiv.className = 'perkenalan';

                        // Create the artist image
                        const artistImg = document.createElement('img');
                        artistImg.src = data_artist[user.nama_artist][0]['artists'][0]['strArtistThumb'];
                        artistImg.alt = user.nama_artist;
                        artistImg.className = 'gambar-artist';

                        // Create the artist name heading
                        const artistName = document.createElement('h2');
                        artistName.className = 'artist-name';
                        artistName.textContent = user.nama_artist;

                        // Append the image and heading to the perkenalan div
                        perkenalanDiv.appendChild(artistImg);
                        perkenalanDiv.appendChild(artistName);

                        let followButton = document.createElement('img');
                        followButton.className = 'followBtn-artist'
                        const isFollowed = localStorage.getItem(`follow_${user.nama_artist}`) === 'true';
                        followButton.src = isFollowed ? '/assets/user-minus.svg' : '/assets/user-plus.svg';
                        followButton.onclick = () => {
                            const currentStatus = localStorage.getItem(`follow_${user.nama_artist}`) === 'true';
                            localStorage.setItem(`follow_${user.nama_artist}`, !currentStatus);
                            followButton.src = !currentStatus ? '/assets/user-minus.svg' : '/assets/user-plus.svg';
                        };
                        perkenalanDiv.appendChild(followButton);
                

                        // // Create the container div
                        // const containerDiv = document.createElement('div');
                        // containerDiv.className = 'container';

                        // // Create the item div
                        // const itemDiv = document.createElement('div');
                        // itemDiv.className = 'item';

                        // // Create the song image
                        // const songImg = document.createElement('img');
                        // songImg.src = '/';
                        // songImg.alt = '';
                        // songImg.className = 'gambar-lagu';

                        // // Create the song name paragraph
                        // const songName = document.createElement('p');
                        // songName.className = 'nama-lagu';
                        // songName.textContent = 'Nama Lagu';

                        // // Create the listen button
                        // const listenButton = document.createElement('button');
                        // listenButton.type = 'submit';
                        // listenButton.className = 'listen';
                        // listenButton.textContent = 'Listen';

                        // // Append the song image, name, and button to the item div
                        // itemDiv.appendChild(songImg);
                        // itemDiv.appendChild(songName);
                        // itemDiv.appendChild(listenButton);

                        // // Append the item div to the container div
                        // containerDiv.appendChild(itemDiv);

                        // Append the perkenalan div and container div to the artist div
                        artistDiv.appendChild(perkenalanDiv);
                        // artistDiv.appendChild(containerDiv);

                        // Append the artist div to the section element
                        sectionAwal.appendChild(artistDiv);
                        addArtistNameEventListeners(data_artist)
                    
                    }
                }})






                        // let artistContainer = document.createElement('div');
                        // artistContainer.className = 'artist-container';
                
                        // let artistImage = document.createElement('img');
                        // artistImage.src = data_artist[user.nama_artist][0]['artists'][0]['strArtistThumb'];
                        // artistImage.width = "300";
                        // artistImage.alt = user.nama_artist;
                        // artistContainer.appendChild(artistImage);
                
                        // let artistHeader = document.createElement('h3');
                        // artistHeader.textContent = user.nama_artist;
                        // artistContainer.appendChild(artistHeader);
                
                        // let button = document.createElement('button');
                        // button.textContent = 'Go to Artist';
                        // button.onclick = () => {
                        //     window.location.href = `http://localhost:8000/find?artist_name=${encodeURIComponent(user.nama_artist)}&song_name=`;
                        // };
                        // artistContainer.appendChild(button);

                        
                        // userList.appendChild(artistContainer);
                        // }}})
                        // throw new Error('Ignore this error');

    } 

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading...';
    userList.appendChild(loadingMessage);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            if (data.length === 0) {
                userList.textContent = 'No results found';
            } else {
                let existingSongs = [];
                let histori = [];
                let groupedResults = {};
                let data_artist = {}

                for (const user of data) { // Iterate over each user object in the data array
                    const data_song = await addSong(user.id_artist);
                    if (!data_artist[user.nama_artist]) {
                        data_artist[user.nama_artist] = [];
                    }
                    data_artist[user.nama_artist].push(await addArtist(user.id_artist));
                    let data_song_filtered;
                    if (songName !== null) {
                        data_song_filtered = searchWords(data_song.mvids, songName, existingSongs);
                    } else {
                        data_song_filtered = data_song.mvids.filter(song => !existingSongs.includes(song.strTrack));
                    }
                    if (data_song && data_song.mvids) {
                        if (!groupedResults[user.nama_artist]) {
                            groupedResults[user.nama_artist] = [];
                        }
                        data_song_filtered.forEach(element => {
                            if (!existingSongs.includes(element.strTrack)) {
                                groupedResults[user.nama_artist].push(element);
                                existingSongs.push(element.strTrack);
                                // console.log(existingSongs)
                                histori.push(element.strTrack);
                            }
                        });
                    }
                }

                let followedArtists = [];
                let unfollowedArtists = [];

                for (const artist in groupedResults) {
                    const isFollowed = localStorage.getItem(`follow_${artist}`) === 'true';
                    if (isFollowed) {
                        followedArtists.push(artist);
                    } else {
                        unfollowedArtists.push(artist);
                    }
                }

                userList.innerHTML = '';
                const result = document.getElementById('result');

                if (followedArtists.length > 0) {
                    // Addresult(followedArtists);
                    awal.style.display = 'none'
                    akhir.style.display = 'block'
                    let h2_f = document.createElement('h1');
                    h2_f.id = 'Followed Artists';
                    h2_f.textContent = 'Followed Artists';
                    result.appendChild(h2_f);
                    
                }

                // Display followed artists
                followedArtists.forEach(artist => {
                    if (groupedResults[artist].length !== 0) {
                        let lagu = document.createElement('div');
                        lagu.className = 'lagu';
                        let artistHeader = document.createElement('h2');
                        artistHeader.textContent = artist;
                        artistHeader.className = 'artist-header';
                        lagu.appendChild(artistHeader); //2

                        let followButton = document.createElement('img');
                        followButton.className = "folllowBtn";
                        const isFollowed = localStorage.getItem(`follow_${artist}`) === 'true';
                        followButton.src = isFollowed ? '/assets/user-minus.svg' : '/assets/user-plus.svg';
                        followButton.onclick = () => {
                            const currentStatus = localStorage.getItem(`follow_${artist}`) === 'true';
                            localStorage.setItem(`follow_${artist}`, !currentStatus);
                            followButton.src = !currentStatus ? '/assets/user-minus.svg' : '/assets/user-plus.svg';
                        };
                        lagu.appendChild(followButton); //1


                        let artistContainer = document.createElement('div');
                        artistContainer.className = 'container';
                        
                        lagu.appendChild(artistContainer);

                        result.appendChild(lagu);

                        groupedResults[artist].forEach(song => {
                            let item_lagu = document.createElement('div');
                            item_lagu.className = 'item';

                            let img = document.createElement('img');
                            img.className = 'gambar-lagu';
                            img.src = song.strTrackThumb || '../assets/default_photo.png';
                            img.alt = song.strTrack;

                            let p = document.createElement('p');
                            p.className = 'nama-lagu';
                            p.textContent = song.strTrack;

                            let button = document.createElement('button');
                            button.className = 'listen';
                            button.textContent = 'Listen';
                            button.onclick = () => {
                                window.open(song.strMusicVid, '_blank');
                            };
                            item_lagu.appendChild(img);
                            item_lagu.appendChild(p);
                            item_lagu.appendChild(button);
                            artistContainer.appendChild(item_lagu);
                        });
                    }
                });

                // Add header for unfollowed artists if any
                if (unfollowedArtists.length > 0) {
                    // Addresult(unfollowedArtists);
                    awal.style.display = 'none'
                    akhir.style.display = 'block'
                    let h2_u = document.createElement('h1');
                    h2_u.id = 'Unfollowed Artists';
                    h2_u.textContent = 'Other Artists';
                    result.appendChild(h2_u);
                }
                
                // Display unfollowed Artists
                unfollowedArtists.forEach(artist => {
                    if (groupedResults[artist].length !== 0) {
                        let lagu = document.createElement('div');
                        lagu.className = 'lagu';
                        let artistHeader = document.createElement('h2');
                        artistHeader.textContent = artist;
                        artistHeader.className = 'artist-header';
                        lagu.appendChild(artistHeader);
                        
                        
                        let followButton = document.createElement('img');
                        followButton.className = "folllowBtn";
                        const isFollowed = localStorage.getItem(`follow_${artist}`) === 'true';
                        followButton.src = isFollowed ? '/assets/user-minus.svg' : '/assets/user-plus.svg';
                        followButton.onclick = () => {
                            const currentStatus = localStorage.getItem(`follow_${artist}`) === 'true';
                            localStorage.setItem(`follow_${artist}`, !currentStatus);
                            followButton.src = !currentStatus ? '/assets/user-minus.svg' : '/assets/user-plus.svg';
                        };
                        lagu.appendChild(followButton);


                        let artistContainer = document.createElement('div');
                        artistContainer.className = 'container';
                        
                        lagu.appendChild(artistContainer);

                        result.appendChild(lagu);

                        groupedResults[artist].forEach(song => {
                            let item_lagu = document.createElement('div');
                            item_lagu.className = 'item';

                            let img = document.createElement('img');
                            img.className = 'gambar-lagu';
                            img.src = song.strTrackThumb || '../assets/default_photo.png';
                            img.alt = song.strTrack;

                            let p = document.createElement('p');
                            p.className = 'nama-lagu';
                            p.textContent = song.strTrack;

                            let button = document.createElement('button');
                            button.className = 'listen';
                            button.textContent = 'Listen';
                            button.onclick = () => {
                                window.open(song.strMusicVid, '_blank');
                            };
                            item_lagu.appendChild(img);
                            item_lagu.appendChild(p);
                            item_lagu.appendChild(button);
                            artistContainer.appendChild(item_lagu);
                        });
                        
                    }
                });

                if (histori.length === 0) {
                    userList.textContent = 'No results found';
                    let h2_f = document.getElementById('Followed Artists');
                    let h2_u = document.getElementById('Unfollowed Artists');
                    result.removeChild(h2_f);
                    result.removeChild(h2_u);
                    akhir.removeChild(result);
                }
            }})
        
        .catch(error => {
            console.error('Error fetching data:', error);
            userList.textContent = 'Error fetching data. Please try again later.';
        });
    })

