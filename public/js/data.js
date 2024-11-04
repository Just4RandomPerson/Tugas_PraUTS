let idartist = [];

async function addData(json) {
    let data = JSON.parse(json);
    if (data['artists'] && data['artists'][0]) {
        let id = data['artists'][0]['idArtist'];
        let nama = data['artists'][0]['strArtist'];
        idartist.push({ id_artist : id , nama_artist: nama});
    }
}

async function getData() {
    for (let i = 111233; i <= 111258; i++) {
        let ids = i;
        let link = `https://www.theaudiodb.com/api/v1/json/2/artist.php?i=${ids}`;
        try {
            let response = await fetch(link);
            if (response.ok) {
                let jsonData = await response.text();
                await addData(jsonData);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }
    return idartist;
}

// Export the data only after fetching
let idartistPromise = getData();
export { idartistPromise };
