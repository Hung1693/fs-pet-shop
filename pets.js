const fs = require('fs');
const subcommand = process.argv[2];


switch (subcommand) {
    case 'read':
        {
            fs.readFile('pets.json', 'utf-8', (error, data) => {
                if (error) {
                    console.log('error');
                } else {
                    let index = parseInt(process.argv[3]);
                    if (index !== NaN) {
                        console.log(JSON.parse(data)[index]);
                    } else {
                        console.log(JSON.parse(data));
                    }
                    
                        
                    
                    
                }
            })
        }
        break;

    case 'create':
        {
            let age = parseInt(process.argv[3]);
            let kind = process.argv[4];
            let name = process.argv[5];
            fs.readFile('pets.json', 'utf-8', (error, data) => {
                let newPet = {age, kind, name};
                if (error) {
                    console.log('error');
                } else {
                    const petList = JSON.parse(data);
                    petList.push(newPet);
                    fs.writeFile('pets.json', JSON.stringify(petList), () => {});

                }
            })
        }
        break;
    case 'update':
        {
            let index = parseInt(process.argv[3]);
            let age = parseInt(process.argv[4]);
            let kind = process.argv[5];
            let name = process.argv[6];

            fs.readFile('pets.json', 'utf-8', (error, data) => {
                if (index !== NaN && age !== NaN && kind !== "" && name !== "") {
                    const petList = JSON.parse(data);
                    const oldData = petList[index];
                    oldData.age = age;
                    oldData.kind = kind;
                    oldData.name = name;
                    petList[index] = oldData;
                    console.log(petList[index]);
                    fs.writeFile('pets.json', JSON.stringify(petList), () => {});
                } else {
                    console.log('Usage: node pets.js update INDEX AGE KIND NAME');
                }
            })
        }
        break;
    case 'delete':
        {
            fs.readFile('pets.json', 'utf-8', (error, data) => {
                if (error) {
                    console.log('error');
                } else {
                    const petList = JSON.parse(data);
                    let index = parseInt(process.argv[3]);
                    console.log(petList[index]);
                    petList.splice(index, 1);
                    fs.writeFile('pets.json', JSON.stringify(petList), () => {});
                }
            })
        }
        break;
    default:
        {
            console.error(`node pets.js [read | create | update | destroy]`);
        }
}
