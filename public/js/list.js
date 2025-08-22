(async function () {
    // (async function () { ... })(); 関数をその場で定義して、その場で実行

    // 差し込み先を取得
    // querySelector("#projects") は CSSセレクタ で要素を1個だけ取得
    const container = document.querySelector("#projects");

    // 読み込み中UI
    // innerHTML は「この要素の中身のHTML」を文字列で挿入するプロパティ
    container.innerHTML = "<p>Loading...</p>";

    try{
        // JSONを取得して配列に
        // fetch()はネットワークからファイルを取得 
        // awaitを付けると終わるまで次に進まない
        const res = await fetch("./data/projects.json");
        
        // 取得に失敗時（404など）に明示的にエラーを投げて後のcatchが作動
        if (!res.ok) throw new Error("failed to load projects.json");
        
        // 取得したレスポンス（配列）をJSONとして解釈
        const projects = await res.json();

        // 配列をカードHTMLに変換
        // .map(cardTpl) は、各要素に対して cardTpl(要素) を呼び、返り値（HTML文字列）を並べた新配列を作る
        // .join("")で配列を1つの文字列（HTML）に結合
        const html = projects.map(cardTpl).join("");

        // 置き換え（空なら"無し"を表示）
        // A || B は「Aが空/偽ならBにする」JSの定番パターン
        container.innerHTML = html || "<P>プロジェクトが見つかりません。<p/>";
    
    } catch (err) {
        // try内でエラーが起きたときに入ってくる場所
        // 失敗時UI
        // console.error(err) で開発者ツール（F12 → Console）に赤いエラーを出す
        consolel.error(err);
        // 画面上にはユーザー向けエラーメッセージ
        container.innerHTML = "<p>データの読み込みに失敗しました。<p/>";
    }

    // 以下、テンプレ関数

    // カードのテンプレート（XSS対策で必ずエスケープ）
    function cardTpl(p) {
        // 1件分の作品オブジェクト(辞書)→p をHTMLに変換する
        // 外部データはエスケープ
        const title = escape_html(p.title);
        const summary = escape_html(p.summary || "");

        // テンプレートリテラル（バッククォート）で文字列＋変数展開
        // encodeURIComponent はURLに使えない文字を安全に変換（例：スペース → %20）
        const detailUrl = `./project.html?id=${encodeURIComponent(p.id)}`;
        
        // tags が無い/空でも落ちないように、デフォルトで空配列にしてから処理。
        const tags = (p.tags || []).map(t => `<li>${escape_html(t)}</li>`).join("");

        // links や links.github が無いときの分岐（条件演算子）
        const github = p.links && p.links.github
            ? `<a href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>`
            : "";
        
        // 戻り値は1枚のカードHTML（<article>...</article>）    
        return `
            <article class="card">
                <h3>${title}</h3>
                <p>${summary}</p>
                ${tags ? `<ul class="tags">${tags}</ul>` : ""}
                <div class="row">
                    <a href="${detailUrl}">詳細</a>
                    ${github}
                </div>
            </article>
        `;
    }

    function escape_html(s) {
        // XSS対策 HTMLに差し込む前に特殊文字を無害化
        return String(s)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39");
    }
})();