// js/common.js
"use strict";


// 外部JSON取得（キャッシュさせたくない開発時は no-store ）
export async function load_projects() {
  const res = await fetch("./data/projects.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`failed to load projects.json: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  // 契約を作る：常に配列を返す
  if (!Array.isArray(data)) throw new Error("projects must be an array");
  
  return data;

}


// XSS対策（タグ無効化）
export function escape_html(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


// 1件分のカードHTML（一覧用）
export function render_card(p) {
  const id = escape_html(p.id);
  const summary = escape_html(p.summary || "");
  const tags = (p.tags || []).map(t => `<li>${escape_html(t)}</li>`).join("");
  const detail_url = `./project.html?id=${encodeURIComponent(p.id)}`;
  const github = p.links?.github
    ? `<a href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>`
    : "";

  return `
    <article class="card">
      <h3>${id}</h3>
      <p>${summary}</p>
      ${tags ? `<ul class="tags">${tags}</ul>` : ""}
      <div class="row">
        <a href="${detail_url}">詳細</a>
        ${github}
      </div>
    </article>
  `;
}
