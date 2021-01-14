const fs = require('fs');
module.exports =
    function writeFile(filename, fileData) {
        fs.writeFile(filename, JSON.stringify(fileData, null, 2), (err) => {
            if (err) {
                throw err
            } else {
                console.log(`File has been saved to returnData.json`)
            }
            return
        });
    };