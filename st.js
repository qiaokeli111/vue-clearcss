const downloadFile=async (src, localFilePath, data)=> {
    try{
        const ws = fs.createWriteStream(localFilePath);
        return new Promise((resolve, reject) => {
            ws.on('finish', () => {
                resolve(localFilePath);
            });
            if (data) {
                request({
                    method: 'POST',
                    uri: src,
                    json: true,
                    body: data
                }).pipe(ws);
            } else {
                request(src).pipe(ws);
            }
        });
    }catch (e){
        logger.error('wxdownloadFile error: ',e);
        throw e;
    }
}

