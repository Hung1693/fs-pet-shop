// import fs from 'fs/promises';
const fs = require('fs/promises');
const readPetsFile = fs.readFile("pets.json", "utf8");

const writeNewPets = (data) => fs.writeFile('pets.json', JSON.stringify(data), () => {});

module.exports = {readPetsFile, writeNewPets};
