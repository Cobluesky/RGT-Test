const express = require('express'); // 서버 실행을 위한 express 모듈입니다.

const app = express();

const port = 3000;

//google client 정보입니다.
//보안을 위해 .env나 별도의 환경변수로 관리합니다만, 편의를 위해 그대로 남겼습니다.
const GOOGLE_CLIENT_ID = '736500464484-chdhf3vhkso43v7cfp4rlkla8uvj13u3.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/login/redirect';

app.get('/', (req, res) => {
    res.send(`
        <h1>Log in</h1>
        <a href="/login">Log in</a>
    `);
});

app.get('/login', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`
    url += '&response_type=code'
    url += '&scope=email profile'    
	res.redirect(url);
});

app.get('/login/redirect', (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('로그인 성공!');
});

app.listen(port, () => {
    console.log('서버가 실행중입니다. 포트 : ', port);
});