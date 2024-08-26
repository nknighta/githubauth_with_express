import express from 'express';

const app = express();

//const username = process.argv[2];
const github_oauth_url = `https://github.com/login/oauth/authorize?client_id=Iv1.f70fe782834c0370`;

app.get('/auth/github', (req, res) => {
    //console.log(req.query.country)
    res.redirect(github_oauth_url)
}
);

app.get('/auth/callback/', (req, res) => {
    //console.log(req.query.country)
    const URL = 'https://github.com/login/oauth/access_token';
    const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    const TEMP_CODE = req.query.code;  // 一時コード
    // HTTP リクエストのカスタマイズ
    const fetchOption = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: TEMP_CODE,
        })
    };

    // HTTP POST リクエストを送信
    fetch(URL, fetchOption)
        .then(res => {
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            res.setHeader("Content-Type", "application/json");
            // 一時コードを使ってアクセストークンを取得

            const match_live = "nknighta";
            const giturl = `https://api.github.com/users/${match_live}`;
            // アクセストークンからユーザー情報を取得
            fetch(giturl, {
                headers: {
                    Authorization: `Bearer ` + data.access_token,
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    return response.json();
                })
                /*
                .then(data => {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        user: match_live,
                        message: "vx v0.5",
                        id: data.login,
                        name: data.name,
                        email: data.email,
                        image: data.avatar_url,
                        created_at: data.created_at,
                        datasorce: ["github", "vx-auth-x9"],
                    }));
                })
                */
                .then(data => {
                    res.setHeader("Content-Type", "text/html");
                    res.send(
                        `
                            <div>
                            <h1>${data.name}</h1>
                                <img src="${data.avatar_url}" alt="${data.name}" />
                                <p>${data.bio}</p>
                                <style>
                                * {
                                    font-family: Arial, sans-serif;
                                    padding: 0;
                                    margin: 0;
                                }
                                </style>
                                <a href="/">logout</a>
                            <div>
                                `
                    );
                })
                .catch(error => {
                    res.setHeader("Content-Type", "text/html");
                    res.send(`<div>faild github login back to <a href="/">home</a></div>`);
                });
        })
        // エラーはまとめて処理
        .catch(err => console.error(err));

});


app.listen(3000, () => {
    //console.log('Server is running on port 3000');
    console.log("http://localhost:3000/");
});

app.get('/', (req, res) => {
    res.send(`<a href="/auth/github">Login with GitHub</a>`);
});


export default app;