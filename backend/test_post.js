const http = require('http');

const data = JSON.stringify({
    "team_a": "Testing Team",
    "team_b": "Tester",
    "stadium_id": "ahmedabad",
    "date": "2025-05-15T15:30",
    "pricing_tiers": []
});

const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/matches',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, res => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => console.log('Response:', res.statusCode, raw));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
