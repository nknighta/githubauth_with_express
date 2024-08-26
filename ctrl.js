const username = process.argv[2];
const github_oauth_url = `https://github.com/login/oauth/authorize?client_id=Iv1.f70fe782834c0370&scope=user:read`;
console.log({
    "req": `Hello, ${username}!`,
    "url": "https://localhost:3000/auth/github?requser=" + username,
    "url_auth":github_oauth_url
});