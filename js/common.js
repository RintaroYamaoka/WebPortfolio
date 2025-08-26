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