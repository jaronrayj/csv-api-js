require('dotenv').config()
const axios = require('axios');
const csvtojson = require('csvtojson');
const fs = require('fs');
const inquirer = require('inquirer');

////////// Change these up ///////////////
const token = process.env.TOKEN;
const baseUrl = 'api.giphy.com';
const preAPIUrl = `/gifs/search?api_key=KdpWJf2OZMZ9f4Gu8IyQvUBt1DOKkXJ8&q=`;
const postAPIUrl = '&limit=1&offset=0&rating=pg-13&lang=en'
const apiType = 'get';
const apiData = {

};
const columnHeader = 'search';
//////////////////////////////////////////

const debug = true;
const instance = axios.create({
    baseURL: `https://${baseUrl}/v1/`,
    timeout: 1000,
    // headers: { 'Authorization': `Bearer ${token}` }
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
                const apiRun = new Promise((resolve, reject) => {
                    let count = 0;
                    csvtojson()
                        .fromFile(`./csv-storage/${res.file}`)
                        .then(fileJSON => {
                            if (debug) {
                                console.log("🚀 ~ file: main.js ~ line 43 ~ apiRun ~ fileJSON", fileJSON)
                            }
                            fileJSON.forEach(object => {
                                instance({
                                        method: apiType,
                                        url: `${preAPIUrl}/${object[columnHeader]}/${postAPIUrl}`,
                                        data: apiData
                                    })
                                    .then(res => {
                                        returnJson[(object[columnHeader])] = res.data;
                                        count += 1;
                                        if (fileJSON.length === count) {
                                            resolve(returnJson)
                                        }
                                    })
                            });
                        })
                })
                apiRun.then(returnJson => {
                    fs.writeFile('returnData.json', JSON.stringify(returnJson, null, 2), (err) => {
                        if (err) {
                            throw err
                        } else {
                            console.log(`File has been saved to returnData.json`)
                        }
                    });
                });
            })
    } catch (err) {
        throw err;
    }
}

main();