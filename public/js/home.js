feather.replace();

function addArtistNameEventListeners(data) {
    const namaArtist = document.querySelectorAll('.artist-name');
    namaArtist.forEach((artist) => {
        artist.addEventListener('click', () => {
            modal_artist.style.display = 'block';
            const artistName = artist.textContent;
            // [user.nama_artist][0]['artists'][0]
            // Populate modal with artist information
            document.getElementById('nama-modal').textContent = data[artistName][0]['artists'][0].strArtist;
            document.getElementById('gambar-modal').src = data[artistName][0]['artists'][0].strArtistThumb;
            document.getElementById('gambar-modal').alt = data[artistName][0]['artists'][0].strArtist;
            const selectElement = document.getElementById('bahasa');
            const descriptionText = document.getElementById('description-text');
            selectElement.value = 'EN';
            descriptionText.textContent = data[artistName][0]['artists'][0].strBiographyEN;
            selectElement.addEventListener('change', () => {
                const selectedLanguage = selectElement.value;
                // Update the description text based on the selected language
                descriptionText.textContent =  data[artistName][0]['artists'][0][`strBiography${selectedLanguage}`] || 'No description available';
            });
            document.getElementById('tanggal_lahir').textContent = data[artistName][0]['artists'][0].intFormedYear;

            let chrome = document.getElementById('chrome');
            if (chrome) {
                chrome.onclick = (event) => {
                    event.preventDefault(); // Prevent default action
                    // Ensure the data object is populated and has the correct structure
                    const artistName = document.getElementById('nama-modal').textContent;
                    if (data[artistName] && data[artistName][0] && data[artistName][0]['artists'][0].strWebsite) {
                        let websiteUrl = data[artistName][0]['artists'][0].strWebsite;
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
                    const artistName = document.getElementById('nama-modal').textContent;
                    if (data[artistName] && data[artistName][0] && data[artistName][0]['artists'][0].strFacebook) {
                        let websiteUrl = data[artistName][0]['artists'][0].strFacebook;
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
        });
    });
}

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

const navBar = document.getElementById('nav-bar');
const rightMenu = document.getElementById('right-menu');
const closeBtn = document.getElementById('close-btn')

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

    let apiUrl = 'http://localhost:8000/find/api';

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
                    data_song_filtered = data_song.mvids.filter(song => !existingSongs.includes(song.strTrack));
                    if (data_song && data_song.mvids) {
                        if (!groupedResults[user.nama_artist]) {
                            groupedResults[user.nama_artist] = [];
                        }
                        data_song_filtered.forEach(element => {
                            if (!existingSongs.includes(element.strTrack)) {
                                groupedResults[user.nama_artist].push(element);
                                existingSongs.push(element.strTrack);
                                // console.log(existingSongs)
                                histori.push(element);
                            }
                        });
                    }
                }

                for (i=1; i<=5; i++){
                    obj_key = Object.keys(data_artist)
                    let rec_img = document.getElementById(`rec-img-${i}`);
                    let rec_p = document.getElementById(`rec-p-${i}`);
                    let rec_but = document.getElementById(`rec-but-${i}`);

                    let pop_img = document.getElementById(`pop-img-${i}`);
                    let pop_p = document.getElementById(`pop-p-${i}`);
                    let pop_but = document.getElementById(`pop-but-${i}`);

                    let art_img = document.getElementById(`art-img-${i}`);
                    let art_p = document.getElementById(`art-p-${i}`);
                    let art_but = document.getElementById(`art-but-${i}`);

                    let random_1 = histori[Math.floor(Math.random() * histori.length)]
                    let random_2 = histori[Math.floor(Math.random() * histori.length)]
                    let random_art = data_artist[obj_key[Math.floor(Math.random() * obj_key.length)]][0]['artists'][0]
            
                    rec_img.src = random_1.strTrackThumb || '../assets/default_photo.png';
                    rec_img.alt = random_1.strTrack;
                    rec_p.textContent = random_1.strTrack;
                    rec_but.onclick = () => {
                        window.open(random_1.strMusicVid, '_blank');
                    };

                    pop_img.src = random_2.strTrackThumb || '../assets/default_photo.png';
                    pop_img.alt = random_2.strTrack;
                    pop_p.textContent = random_2.strTrack;
                    pop_but.onclick = () => {
                        window.open(random_2.strMusicVid, '_blank');
                    };

                    art_img.src = random_art.strArtistThumb || '../assets/default_photo.png';
                    art_img.alt = random_art.strArtist;
                    art_p.textContent = random_art.strArtist;
                    art_but.onclick = () => {
                        window.location.href = `http://localhost:8000/find?artist=${encodeURIComponent(random_art.strArtist)}`;
                    };
                }
            }
        })
})