// js/list.js
"use strict";
import { escape_html, load_projects } from "./common.js";


function get_current_genre() {
  const params = new URLSearchParams(location.search);
  const g = params.get("genre");
  return g && g.trim() ? g : null;
}


function build_genre_list(projects) {
  const set = new Set();
  for (const p of projects) {
    const genres = Array.isArray(p.genre) ? p.genre : [p.genre];
    for (const g of genres) {
      if (g) set.add(g);
    }
  }
  return Array.from(set);
}


function render_genre_nav(container, genres, current_genre) {
  const items = [];

  items.push(
    current_genre === null
      ? `<strong>#AllProject</strong>`
      : `<a href="./">#AllProjects</a>`
  );

  for (const g of genres) {
    if (current_genre === g) {
      items.push(`<strong>#${escape_html(g)}</strong>`);
    } else {
      items.push(`<a href="./?genre=${encodeURIComponent(g)}">#${escape_html(g)}</a>`);
    }
  }
  container.innerHTML = items.join(" ");
}


function render_card(p) {
  const id = escape_html(p.id);
  const genres = Array.isArray(p.genre) ? p.genre : [p.genre];
  const summary = escape_html(p.summary || "");
  const stack_text = (p.stack || []).join(" / ");
  const detail_url = `./project.html?id=${encodeURIComponent(p.id)}`;
  const images = (p.images && p.images.length > 0)
    ? `<img src="${escape_html(String(p.images[0]))}" alt="${id} thumbnail" class="thumb">`
    : "";
  const genre_links = genres
    .map(g => `<a href="./?genre=${encodeURIComponent(g)}">#${escape_html(g)}</a>`)
    .join(" ");

  return `
    <a class="card" href="${detail_url}">
      ${images}
      <h3>${id}</h3>
      <p>${summary}</p>
      <div class="tags"> 
        <p class="genre">${genre_links}</p>
        ${stack_text ? `<p class="stack">${escape_html(stack_text)}</p>` : ""}
      </div>  
    </a>
  `;
}


async function init() {
  const list_container = document.querySelector("#projects-list");
  const nav_container = document.querySelector("#genre-nav");

  if (!list_container || !nav_container) return;

  list_container.innerHTML = "<p>Loading...</p>";
  nav_container.innerHTML = "<p>Loading...</p>";

  try {
    const projects = await load_projects();
    const current_genre = get_current_genre();

    // ジャンルナビ生成（カウントなし）
    const genres = build_genre_list(projects);
    render_genre_nav(nav_container, genres, current_genre);

    // フィルタ
    const showing = current_genre
      ? projects.filter(p => {
          const genres = Array.isArray(p.genre) ? p.genre : [p.genre];
          return genres.includes(current_genre);
        })
      : projects;

    if (showing.length === 0) {
      list_container.innerHTML = `<p>${current_genre 
        ? `ジャンル「${escape_html(current_genre)}」に該当する作品がありません。`
        : "プロジェクトが見つかりません。"} </p>`;
      return;
    }

    const frag = document.createDocumentFragment();
    for (const p of showing) {
      const wrap = document.createElement("div");
      wrap.innerHTML = render_card(p);
      const el = wrap.firstElementChild;
      if (el) frag.appendChild(el);
    }
    list_container.replaceChildren(frag);
  } catch (err) {
    console.error("[list.js] load/render error:", err);
    list_container.innerHTML = "<p>データの読み込みに失敗しました。</p>";
    nav_container.textContent = "";
  }
}


init();
