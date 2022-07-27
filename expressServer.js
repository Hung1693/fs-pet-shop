const express = require('express')
const port = 8000;
const app = express();
const fs = require('fs/promises');
const {readPetsFile, writeNewPets} = require('./share')
const path = require('path');
// pg library
const {Pool} = require('pg');


// always put at top
app.use(express.json());
app.use(express.static(path.join(__dirname, "/")));

const pool = new Pool({user: 'postgres', host: 'localhost', database: 'pet_shop', password: 'macbook1693', port: 5432})


app.get('/pets', (req, res, next) => {
    // readPetsFile.then((data) => {
    //     res.send(data);
    // }).catch(next);

    pool.query('SELECT * FROM pets order by id desc', (err, data) => {
        const petList = data.rows;
        res.json(petList);
    });

})

app.get('/pets/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM pets where id = ${id}`, (err, data) => {
        const pet = data.rows;
        res.json(pet);
    });

    // readPetsFile.then((data) => {
    //     const petList = JSON.parse(data);
    //     if (id > -1 && id < petList.length) {
    //         res.send(petList[id]);
    //     } else { // must set header before status and message
    //         res.setHeader('content-type', 'text/plain');
    //         res.status(404).send('NOT FOUND');
    //     }
    // }).catch(next)
})


app.post('/pets', (req, res, next) => {
    const {name, kind} = req.body;
    pool.query('INSERT INTO pets (name, kind) VALUES ($1, $2) RETURNING *', [
        name, kind
    ], (error, data) => {
        if (error) {
            throw error
        }
        res.json(data.rows);
    })
});


app.delete('/pets/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query("delete from pets where id = $1 returning *", [id], (data) => {
        res.sendStatus(204);
    })
    // readPetsFile.then((data) => {
    //     const petList = JSON.parse(data);
    //     if (id > -1 && id < petList.length) {
    //         res.send(petList[id]);
    //         petList.splice(id, 1);
    //         writeNewPets(petList);
    //     } else { // must set header before status and message
    //         res.setHeader('content-type', 'text/plain');
    //         res.status(404).send('NOT FOUND');
    //     }
    // }).catch(next)
})

app.patch('/pets/:id', (req, res, next) => {
    const {id} = req.params;
    const {name, kind} = req.body;

    pool.query(`update pets set name = coalesce($1, name), kind = coalesce($2, kind) where id =$3 returning *;`, [
        name, kind, id
    ], (error, data) => {
        if (error) {
            throw error
        }
        res.json(data.rows);
    })

    // readPetsFile.then((data) => {
    //     const petList = JSON.parse(data);
    //     if (id > -1 && id < petList.length) {
    //         const oldPet = petList[id];
    //         const newPet = {... oldPet, age, name, kind};
    //         petList[id] = newPet;
    //         res.send(petList[id]);
    //         writeNewPets(petList);
    //     } else { // must set header before status and message
    //         res.setHeader('content-type', 'text/plain');
    //         res.status(404).send('NOT FOUND');
    //     }
    // }).catch(next)
})


app.use((err, req, res, next) => { // console.log(err.stack);
    if (err) {
        res.setHeader('content-type', 'text/plain');
        // res.status(500).send("Internal Server Error")
        // use it for above alteration
        res.sendStatus(500);
    }
})
app.use(function (req, res, next) {
    res.setHeader('content-type', 'text/plain');
    res.status(404).send('Wrong URL');
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
