// js/detail.js
"use strict";
import { load_projects, escape_html } from "./common.js";


function render_not_found(container, id) {
  container.innerHTML = `<p>指定のプロジェクトが見つかりません: ${escape_html(id)}</p>`;
}


function render_project(container, p) {
  const title = escape_html(p.id);
  const summary = escape_html(p.summary || "");
  const stack_items = (p.stack || []).map(s => `<li>${escape_html(s)}</li>`).join("");
  const github = p.links?.github
    ? `<li><a href="${p.links.github}" target="_blank" rel="noopener">GitHub</a></li>`
    : "";

  container.innerHTML = `
    <article class="project-detail">
      <header><h1>${title}</h1></header>
      ${summary ? `<section><p>${summary}</p></section>` : ""}
      ${stack_items ? `
        <section>
          <h3>技術スタック</h3>
          <ul>${stack_items}</ul>
        </section>` : ""}
      ${github ? `
        <section>
          <h3>リンク</h3>
          <ul>${github}</ul>
        </section>` : ""}
    </article>
  `;
}


async function init() {
  const container = document.querySelector("#project-body");
  if (!container) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) {
    container.innerHTML = "<p>id が指定されていません。</p>";
    return;
  }

  container.innerHTML = "<p>Loading...</p>";

  try {
    const projects = await load_projects();
    const p = Array.isArray(projects) ? projects.find(x => x.id === id) : null;
    if (!p) return render_not_found(container, id);
    render_project(container, p);
  } catch (err) {
    console.error("[detail.js] load/render error:", err);
    container.innerHTML = "<p>データの読み込みに失敗しました。</p>";
  }
}

init();
