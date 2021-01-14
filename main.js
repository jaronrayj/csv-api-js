require('dotenv').config()
const axios = require('axios');
const csvtojson = require('csvtojson');
const fs = require('fs');
const inquirer = require('inquirer');
const writeFile = require('./js/writeFile');
const apiCall = require('./js/apiCall');

////////// Change these up ///////////////
const token = process.env.TOKEN;
const api = {
    baseUrl: 'api.giphy.com',
    preUrl: `/gifs/search?api_key=${token}&q=`,
    postUrl: '&limit=1&offset=0&rating=pg-13&lang=en',
    type: 'get',
    data: {

    },
    csvHeaderValue: 'search',
    returnData: 'data.embed_url'
}
const returnFileName = 'returnData.json';
//////////////////////////////////////////

const debug = true;
const instance = axios.create({
    baseURL: `https://${api.baseUrl}/v1/`,
    timeout: 1000,
    headers: { 'Authorization': `Bearer ${token}` }
});

function main() {
    // selecting desired csv from csv-storage
    const csvStorage = fs.readdirSync('./csv-storage');
    try {
        inquirer.prompt({
                message: "What file do you want to use?",
                name: "file",
                choices: csvStorage,
                type: 'list'
            })
            .then(res => {
                const apiRun = new Promise((resolve, reject) => {
                    let count = 0;
                    const returnJson = {};
                    // converting csv into json
                    csvtojson()
                        .fromFile(`./csv-storage/${res.file}`)
                        .then(fileJSON => {
                            if (debug) {
                                console.log("🚀 ~ file: main.js ~ line 43 ~ apiRun ~ fileJSON", fileJSON)
                            }
                            // running api calls on the csv data
                            fileJSON.forEach(object => {
                                instance({
                                        method: api.type,
                                        url: `${api.preUrl}/${object[api.csvHeaderValue]}/${api.postUrl}`,
                                        data: api.data
                                    })
                                    .then(res => {
                                        returnJson[object[api.csvHeaderValue]] = res.data.data[0].images.original.url;
                                        count += 1;
                                        if (fileJSON.length === count) {
                                            if (debug) {
                                                console.log(`finished processing`);
                                            }
                                            resolve(returnJson)
                                        }
                                    })
                            });
                        })
                });
                // writing return data to file
                apiRun.then(returnJson => {
                    if (debug) {
                        console.log(`writing to file`);
                    }
                    writeFile(returnFileName, returnJson);
                });
            })
    } catch (err) {
        throw err;
    }
}

main();

// TODO better error messaging
// TODO allow multiple inputs from csv file
// TODO take api "get" info and use that as part of the next api call
// TODO clean up the data that is returned and written back
// TODO break script down into smaller reusable functions