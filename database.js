import { idartistPromise } from "./public/js/data.js";
import mysql from 'mysql2';

idartistPromise.then((idartist) => {
  const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',       
    password: '427kBjS46xVRvqa', 
    database: 'backend' 
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
  });
  
  const query = 'INSERT INTO artists (nama_artist, id_artist) VALUES ?'
  
  const values = idartist.map(item => {
    return [item.nama_artist, item.id_artist];
  });
  
  connection.query(query, [values], (err, result) => {
    if (err) throw err;
    console.log('Data inserted into MySQL database!');
    connection.end();
  })

}).catch((error) => {
  console.error("Failed to fetch data:", error);
});

