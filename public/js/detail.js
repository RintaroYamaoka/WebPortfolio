(async function () {
    const container = document.querySelector("#project");

    // URLの検索パラメータを扱うオブジェクトを作成
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    if (!id) {
        container.innerHTML = "<p>id が指定されていません。<p>";
        return;
    }

    try {
        // JSONを読み込む
        const res = await fetch("./data/projects.json");
        if (!res.ok) throw new Error("failed to load projects.json");
        const projects = await res.json();

        // 配列の中から、idが一致する1件を探す
        const p = projects.find(x => x.id === id);
        if (!p) {
            container.innerHTML = `<p>指定のプロジェクトが見つかりません: ${id}<p>`;
            return;
        }

        // 詳細HTMLを組み立て
        container.innerHTML = `
            <h2>${escape_html(p.title)}<h2>
            <p>${escape_html(p.summary || "")}<p>

            <h3>技術スタック</h3>
            <ul>${(p.stack || []).map(s =>`<li>${escape_html(s)}</li>`).join("")}</ul>

            <h3>リンク<h3>
            <ul>${p.links?.github ?`<li><a href="${p.links.github}" target="_blank">GitHub</a></li>` : ""}
        `;
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>データの読み込みに失敗しました。</p>";
    }
    
    // HTMLエスケープ（XSS対策）
    function escape_html(s) {
        return String(s)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot")
            .replaceAll("'", "&#39;");
    }    
})();