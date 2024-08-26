"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
//const username = process.argv[2];
var github_oauth_url = "https://github.com/login/oauth/authorize?client_id=Iv1.f70fe782834c0370";
app.get('/auth/github', function (req, res) {
    //console.log(req.query.country)
    res.redirect(github_oauth_url);
});
app.get('/auth/callback/', function (req, res) {
    //console.log(req.query.country)
    var URL = 'https://github.com/login/oauth/access_token';
    var CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    var CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    var TEMP_CODE = req.query.code; // 一時コード
    // HTTP リクエストのカスタマイズ
    var fetchOption = {
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
        .then(function (res) {
        if (!res.ok) {
            throw new Error("".concat(res.status, " ").concat(res.statusText));
        }
        return res.json();
    })
        .then(function (data) {
        res.setHeader("Content-Type", "application/json");
        // 一時コードを使ってアクセストークンを取得
        var match_live = "nknighta";
        var giturl = "https://api.github.com/users/".concat(match_live);
        // アクセストークンからユーザー情報を取得
        fetch(giturl, {
            headers: {
                Authorization: "Bearer " + data.access_token,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
            .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok: ".concat(response.status));
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
            .then(function (data) {
            res.setHeader("Content-Type", "text/html");
            res.send("\n                            <div>\n                            <h1>".concat(data.name, "</h1>\n                                <img src=\"").concat(data.avatar_url, "\" alt=\"").concat(data.name, "\" />\n                                <p>").concat(data.bio, "</p>\n                                <style>\n                                * {\n                                    font-family: Arial, sans-serif;\n                                    padding: 0;\n                                    margin: 0;\n                                }\n                                </style>\n                                <a href=\"/\">logout</a>\n                            <div>\n                                "));
        })
            .catch(function (error) {
            res.setHeader("Content-Type", "text/html");
            res.send("<div>faild github login back to <a href=\"/\">home</a></div>");
        });
    })
        // エラーはまとめて処理
        .catch(function (err) { return console.error(err); });
});
app.listen(3000, function () {
    //console.log('Server is running on port 3000');
    console.log("http://localhost:3000/");
});
app.get('/', function (req, res) {
    res.send("<a href=\"/auth/github\">Login with GitHub</a>");
});
exports.default = app;
