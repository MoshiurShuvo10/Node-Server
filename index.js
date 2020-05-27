const http = require('http');
const fs = require('fs');
const path = require('path');
const hostName = 'localhost';
const port = process.env.port || 8083;

const server = http.createServer((req, res) => {
    console.log('Request for ' + req.url + '  by ' + req.method);
    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/')
            fileUrl = '/index.html';
        else
            fileUrl = req.url;

        var filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);
        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><h1>' + fileUrl + ' not found</h1></body></html>');
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            })
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>' + fileUrl + ' not an html file</h1></body></html>');
            return;
        }
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>' + req.method + ' not supported</h1></body></html>');
        return;
    }
});

server.listen(port, hostName, () => {
    console.log(`server running at http://${hostName}:${port}`);
});