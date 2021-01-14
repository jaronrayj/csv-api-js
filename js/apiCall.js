module.exports =
    function apiCall(instance, apiCallInfo) {
        const returnJson = {};
        instance({
                method: apiCallInfo.apiType,
                url: `${apiCallInfo.preAPIUrl}/${object[apiCallInfo.csvHeaderValue]}/${apiCallInfo.postAPIUrl}`,
                data: apiData
            })
            .then(res => {
                returnJson[object[apiCallInfo.csvHeaderValue]] = res.data;
                count += 1;
                if (fileJSON.length === count) {
                    if (debug) {
                        console.log(`finished processing`);
                    }
                    resolve(returnJson)
                }
            })
    };

// todo work in progress maybe make async?