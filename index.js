feather.replace();

let idartist = {};

async function addData(json) {
    let data = JSON.parse(json);
    if (data['artists'] && data['artists'][0]) {
        idartist[data['artists'][0]['strArtist']] = data['artists'][0]['idArtist'];
    }
}

async function getData() {
    for (let i = 111233; i <= 111253; i++) {
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
    return idartist; // Return idartist after fetching all data
}

// Export the data only after fetching
let idartistPromise = getData();
export { idartistPromise };




// audio ketika yang lain di play maka yang sebelumnya stop

document.addEventListener('play', function(e){  
    var audios = document.getElementsByTagName('audio');  
    for(var i = 0, len = audios.length; i < len;i++){  
        if(audios[i] != e.target){  
            audios[i].pause();  
        }  
    }  
}, true);
