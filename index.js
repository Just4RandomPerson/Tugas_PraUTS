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

import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express()
const hostname = "localhost"
const port = 3000

let filename = fileURLToPath(import.meta.url)
let dir = dirname(filename)

app.use(express.static("public"))

// login - home
app.get("/login",(req,res) => {
    res.status(200).sendFile(dir + "/public/html/login.html")
})

app.post("/home", (req,res) => {
    res.status(200).sendFile(dir + "/public/html/home.html")
})

// sign up -login
app.get("/", (req,res) => {
    res.status(200).sendFile(dir + "/public/html/sign_up.html")
})

app.post("/login",(req,res) => {
    res.status(200).sendFile(dir + "/public/html/login.html")
})

app.get("/search", (req, res) => {
    res.status(200).sendFile(dir+ "/public/html/search.html")
})

app.get("*", (req,res) => {
    res.status(404).sendFile(dir + "/public/html/not-found.html")
})

app.listen(port, () => {
    console.log(`http://${hostname}:${port}`)
})
