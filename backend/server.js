require('dotenv').config();
const cors = require('cors')
const express = require('express')
const mysql = require('mysql2')

const port = process.env.PORT;

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "mysql_db",
    user: "root",
    password: "root",
    database: "music_player"
})

console.log(db)

app.get('/hello', (req, res) => {
    res.send("Hello World from the express server bro")
})

app.get('/get', (req, res) => {
    const sql = "SELECT file FROM music;";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json(err);
        }

        return res.json(data);
    })
});

app.listen(port, () => {
    console.log('Express server is running on the port ' + port)
})