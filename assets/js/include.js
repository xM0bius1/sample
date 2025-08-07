function includeParts(id, url) {
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${url} 読み込みエラー: ${res.status}`);
      }
      return res.text();
    })
    .then(data => {
      const container = document.getElementById(id);
      if (!container) {
        console.warn(`ID ${id} が見つかりませんでした`);
        return;
      }

      // HTML挿入
      container.insertAdjacentHTML('beforeend', data);

      // --- IDごとの後処理（例: header 読み込み後に JS イベント追加） ---
      if (id === "header") {
        // 少し遅延させてからDOM取得
        requestAnimationFrame(() => {
          const hamburger = document.getElementById("hamburger-btn");
          const navMenu = document.getElementById("nav-menu");

          if (hamburger && navMenu) {
            hamburger.addEventListener("click", () => {
              navMenu.classList.toggle("active");
            });
          } else {
            console.warn("ハンバーガーメニューの要素が見つかりませんでした");
          }
        });
      }

      // script タグの再実行（必要に応じて）
      const scripts = container.querySelectorAll("script");
      scripts.forEach(script => {
        const newScript = document.createElement("script");
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
      });
    })
    .catch(err => console.error("読み込み失敗:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  includeParts("header", "assets/parts/header.html");
  includeParts("footer", "assets/parts/footer.html");
  includeParts("hero-video", "assets/parts/herovideo.html");
});
