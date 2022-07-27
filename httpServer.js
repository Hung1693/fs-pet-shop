// import http from 'http';
// import fs from "fs/promises";
const http = require('http');
const fs = require('fs/promises');
const {readPetsFile} = require('./share.js');

const server = http.createServer((req, res) => { // console.log('header', req.headers);
    if (req.url === '/pets' && req.method === "GET") {
        res.writeHead(200, {'Content-Type': 'application/json'});

        readPetsFile.then((data) => { // console.log(JSON.parse(data));
            res.end(data);
        })
    }


    if (req.url === `/pets` && req.method === "POST") {
        res.writeHead(200, {'Content-Type': 'application/json'});
        readPetsFile.then(data => {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                let newPet = JSON.parse(body);
                const petList = JSON.parse(data);
                petList.push(newPet);
                fs.writeFile('pets.json', JSON.stringify(petList), () => {});
                res.end(body);
            })
        })
    }

    let index = req.url.split('/')[2];
    if (req.url === `/pets/${index}` && req.method === "GET") {
        readPetsFile.then((data) => {
            if (index > -1 && index < JSON.parse(data).length) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                let pet = JSON.parse(data)[index];
                res.end(JSON.stringify(pet));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('NOT FOUND');
            }
        })
    }
})

server.listen(3000, () => {
    console.log("listening on port 3000");
})
