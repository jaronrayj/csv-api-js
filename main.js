require('dotenv').config()
const axios = require('axios');
const csvtojson = require('csvtojson');
const fs = require('fs');
const inquirer = require('inquirer');

////////// Change these up ///////////////
const token = process.env.TOKEN;
const baseUrl = 'jjohnson.com';
const preAPIUrl = `users`;
const postAPIUrl = 'enrollments'
const apiType = 'get';
const apiData = {

};
//////////////////////////////////////////
const debug = false;

const instance = axios.create({
    baseURL: `https://${baseUrl}/api/`,
    timeout: 1000,
    headers: { 'Authorization': `Bearer ${token}` }
});

function main() {
    const csvStorage = fs.readdirSync('./csv-storage');
    try {
        inquirer.prompt({
                message: "What file do you want to use?",
                name: "file",
                choices: csvStorage,
                type: 'list'
            })
            .then(res => {
                const returnJson = {};
                csvtojson()
                    .fromFile(`./csv-storage/${res.file}`)
                    .then(fileJSON => {
                        if (debug) {
                            console.log("🚀 ~ file: main.js ~ line 39 ~ main ~ fileJSON", fileJSON)
                        }

                        fileJSON.forEach(object => {
                            instance({
                                    method: apiType,
                                    url: `${preAPIUrl}/${object}/${postAPIUrl}`,
                                    data: apiData
                                })
                                .then(res => {
                                    returnJson[object] = res.data;
                                })
                        });
                        fs.writeFile('returnData.json', JSON.stringify(returnJson, null, 2), (err) => {
                            if (err) {
                                throw err
                            } else {
                                console.log(`File has been saved to returnData.json`)
                            }
                        });
                    })
            })
    } catch (err) {
        throw err;
    }
}

main();