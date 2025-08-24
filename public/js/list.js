// js/list.js
"use strict";
import { load_projects, render_card } from "./common.js";


async function init() {
  const container = document.querySelector("#projects-list");
  if (!container) return;

  container.innerHTML = "<p>Loading...</p>";

  try {
    const projects = await load_projects();

    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = "<p>プロジェクトが見つかりません。</p>";
      return;
    }

    const frag = document.createDocumentFragment();
    for (const p of projects) {
      const wrap = document.createElement("div");
      wrap.innerHTML = render_card(p);
      const article = wrap.firstElementChild;
      if (article) frag.appendChild(article);
    }
    container.replaceChildren(frag);
  } catch (err) {
    console.error("[list.js] load/render error:", err);
    container.innerHTML = "<p>データの読み込みに失敗しました。</p>";
  }
}


init();
