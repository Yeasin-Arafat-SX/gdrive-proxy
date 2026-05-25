const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const reqUrl = url.parse(req.url, true);
    const fileId = reqUrl.query.id;

    if (!fileId) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Error: Please provide a Google Drive file ID.');
        return;
    }

    const driveUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;

    https.get(driveUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (driveRes) => {
        res.writeHead(driveRes.statusCode, {
            'Content-Type': driveRes.headers['content-type'] || 'application/octet-stream',
            'Content-Disposition': 'inline',
            'Access-Control-Allow-Origin': '*'
        });
        driveRes.pipe(res);
    }).on('error', (e) => {
        res.writeHead(500);
        res.end('Error fetching file');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
