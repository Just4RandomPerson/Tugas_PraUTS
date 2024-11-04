import express from "express"
import mysql from 'mysql2'
import { fileURLToPath } from "url"
import { dirname } from "path"
import  bcrypt  from "bcrypt"

let filename = fileURLToPath(import.meta.url)
let dir = dirname(filename)

const app = express()
const hostname = "localhost"
const port = 8000

// Serve static files from the "public" folder
app.use(express.static('public'));

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());



const pool = mysql.createPool({
    host: 'localhost',  
    user: 'root',       
    password: '427kBjS46xVRvqa', 
    database: 'backend' 
});  

app.get("/", (req, res) => {
    res.sendFile(dir + "/public/html/sign_up.html")
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

app.get("/login", (req, res) => {
    res.status(200).sendFile(dir + "/public/html/login.html");
});

// Handle sign-up POST request
app.post('/sign_up', (req, res) => {
    // console.log('Request body:', req.body);
    
    const { email, password } = req.body;

    // Check if email already exists
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            // Email already exists
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, message: 'Error hashing password' });
            }

            // Insert new user into database
            const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
            pool.query(insertQuery, [email, hash], (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                res.status(200).json({ success: true, message: 'User registered successfully' });
            });
        });
    });
});

// Handle login POST request
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email exists
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            // Email does not exist
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).json({ success: false, message: 'Error comparing password' });
            }

            if (!isMatch) {
                // Password does not match
                return res.status(400).json({ success: false, message: 'Invalid email or password' });
            }

            // Password matches
            res.status(200).json({ success: true, message: 'Login successful' });
            res.status(200).sendFile(dir + "/public/html/home.html");
        });
    });
});

app.get("/home", (req, res) => {
    res.status(200).sendFile(dir + "/public/html/home.html");
});

app.get("/find", (req, res) => {
    res.status(200).sendFile(dir + "/public/html/search.html");
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
    res.status(404).sendFile(dir + "/public/html/not-found.html")
})

app.listen(port, () => {
    console.log(`http://${hostname}:${port}`)
})
