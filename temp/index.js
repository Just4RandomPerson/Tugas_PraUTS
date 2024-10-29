import express from "express"
import mysql from 'mysql2'
import { fileURLToPath } from "url"
import { dirname } from "path"

let filename = fileURLToPath(import.meta.url)
let dir = dirname(filename)

const app = express()
const hostname = "localhost"
const port = 8000

app.use(express.static('public'));

const pool = mysql.createPool({
    host: 'localhost',  
    user: 'root',       
    password: '427kBjS46xVRvqa', 
    database: 'backend' 
});  

app.get("/", (req, res) => {
    res.sendFile(dir + "/public/html/home.html")
})

// app.get("/find/:artist_name/:album_name", (req, res) => {
//     res.sendFile(dir + "/public/html/search.html");
// });

// app.get('/find/api', (req, res) => {
//     const { artist_name, album_name } = req.query;
//     let query = 'SELECT * FROM artists';
//     let queryParams = [];

//     if (artist_name || album_name) {
//         query += ' WHERE';
//         if (artist_name) {
//             query += ' nama_artist = ?';
//             queryParams.push(artist_name);
//         }
//         if (album_name) {
//             if (artist_name) query += ' AND';
//             query += ' album_name = ?';
//             queryParams.push(album_name);
//         }
//     }

//     pool.query(query, queryParams, (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).send('Internal Server Error');
//         }
//         res.json(results);
//     });
// });


// app.get('/find/api/:artist_name?', (req, res) => {
//     const { artist_name } = req.params;

//     let query ;
//     let queryParams = [];

//     if (artist_name) {
//         query = 'SELECT * FROM artists WHERE nama_artist LIKE ?';
//         queryParams = [`${artist_name}%`];
//     } else {
//         query = 'SELECT * FROM artists';
//     }

//     pool.query(query, queryParams, (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).send('Internal Server Error');
//         }
//         res.json(results);
//     });
// });

// app.get("/find/:artist_name?", (req, res) => {
//     res.sendFile(dir + "/public/html/search.html");
// });

app.get("/find", (req, res) => {
    res.sendFile(dir + "/public/html/search.html");
});

app.get('/find/api', (req, res) => {
    const { artist_name} = req.query;

    let query = 'SELECT * FROM artists';
    let queryParams = [];

    if (artist_name) {
        query += ' WHERE nama_artist LIKE ?';
        queryParams.push(`${artist_name}%`);
    } else {
        query = 'SELECT * FROM artists';
    }

    pool.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

// app.post("/", (req, res) => {
//     res.send("Post Index")
// })

// app.get("/mikroskil", (req, res) => {
//     res.sendFile(dir + "/public/assets/mikroskil.png")
// })

// app.get("/buku", (req, res) => {
//     res.send(`<center><h1>Get Buku, back to <a href="/">Index</a></h1></center>`)
// })

// // /buku/123
// app.post("/buku/:id", (req, res) => {
//     res.send(`Post Buku ${req.params.id}`)
// })

// app.put("/buku/:id", (req, res) => {
//     res.send(`Put Buku ${req.params.id}`)
// })

// app.delete("/buku/:id", (req, res) => {
//     res.status(201).send(`Delete Buku ${req.params.id}`)
// })

app.get("*", (req, res) => {
    res.status(404).send("Not Found")
})

app.listen(port, () => {
    console.log(`http://${hostname}:${port}`)
})