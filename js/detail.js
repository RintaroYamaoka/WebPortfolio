// js/detail.js
"use strict";
import { load_projects, escape_html } from "./common.js";


function render_not_found(container, id) {
  container.innerHTML = `<p>指定のプロジェクトが見つかりません: ${escape_html(id)}</p>`;
}


function render_images(images, alt_base = "") {
  if (!images?.length) return "";

  const items = images.map((src, i) => {
    const alt = `${alt_base || "screenshot"} #${i + 1}`;
    return `<img class="thumb" src="${escape_html(String(src))}" alt="${escape_html(alt)}">`;
  }).join("");

  return `
    <div class="thumb-track" aria-label="screenshots">
      ${items}
    </div>
  `;
}


function render_description(desc) {
  if (!desc) return "";

  // ① 配列: 各要素を段落に
  if (Array.isArray(desc)) {
    return desc
      .filter(Boolean)
      .map(p => `<p>${escape_html(String(p))}</p>`)
      .join("");
  }

  if (!paragraphs.length) return "";

  return paragraphs
    .map(p => `<p>${escape_html(p)}</p>`)
    .join("");
}


function render_links(links) {
  if (!links || typeof links !== "object") return "";

  const to_label = (key) => {
    if (key === "github") return "GitHub";
    if (key === "download") return "Download";
    return String(key).charAt(0).toUpperCase() + String(key).slice(1);
  };

  const items = Object.entries(links)
    .filter(([, href]) => typeof href === "string" && href.trim() !== "")
    .map(([key, href]) => {
      const label = to_label(key);
      // URLは属性値エスケープ、ラベルはテキストエスケープ
      return `<li><a href="${escape_html(href)}" target="_blank" rel="noopener">${escape_html(label)}</a></li>`;
    })
    .join("");

  if (!items) return "";

  return `
    <section>
      <h3>リンク</h3>
      <ul>${items}</ul>
    </section>
  `;
}


function render_project(container, p) {
  const title = escape_html(p.id);
  const genres = Array.isArray(p.genre) ? p.genre : [p.genre];
  const summary = escape_html(p.summary || "");
  const thumbs = render_images(p.images, p.id || "");
  const stack_items = (p.stack || []).map(s => `<li>${escape_html(s)}</li>`).join("");
  const links_section = render_links(p.links);

  const back_links = genres.map(g =>
    `<p><a href="./?genre=${encodeURIComponent(g)}">← ${escape_html(g)} 一覧へ</a></p>`
  ).join("");

  container.innerHTML = `
    <article class="project-detail">
      <header>
        <h1>${title}</h1>
        <p>${genres.map(g => `#${escape_html(g)}`).join(" ")}</p>
        ${back_links || `<p><a href="./">← 一覧へ</a></p>`}
      </header>
        ${thumbs}

      　${summary ? `
        <section>
          <p>${summary}</p>
        </section>` : ""}

        <section class="description">
        ${render_description(p.description)}
      　</section>

        ${stack_items ? `
          <section>
            <h3>技術スタック</h3>
            <ul>${stack_items}</ul>
          </section>` : ""}
        
        ${links_section}
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
    const p = projects.find(x => x.id === id);
    if (!p) return render_not_found(container, id);
    render_project(container, p);
  } catch (err) {
    console.error("[detail.js] load/render error:", err);
    container.innerHTML = "<p>データの読み込みに失敗しました。</p>";
  }
}

init();
