function gitfetch(url, options) {

    const URL = 'https://github.com/login/oauth/access_token';
    const CLIENT_ID = 'Iv1.f70fe782834c0370';
    const CLIENT_SECRET = '924685d452b1fc7496bfa0a8812fb5c30aa1852f';
    const TEMP_CODE = 'fae820c87b5878ba5478';  
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
        // ここでレスポンスの JSON オブジェクトを出力
        .then(json => console.log(json))
        // エラーはまとめて処理
        .catch(err => console.error(err));
}

gitfetch();