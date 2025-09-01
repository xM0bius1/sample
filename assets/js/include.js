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

// --- AOS 初期化 & スタッガー（遅延の自動付与） ---
function setupAOS() {
  // prefers-reduced-motion を尊重
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  AOS.init({
    offset: 120,
    duration: reduce ? 0 : 700,
    easing: 'ease-out',
    once: true,
    disable: () => reduce
  });

  // .stagger コンテナ内の AOS要素に 0,100,200... と遅延を自動付与
  document.querySelectorAll('.stagger').forEach(group => {
    const step = Number(group.dataset.stagger || 100); // 既定100ms
    group.querySelectorAll('[data-aos]').forEach((el, i) => {
      el.setAttribute('data-aos-delay', String(i * step));
    });
  });
}

// 既存の includeParts 実行後に AOS をセットアップ
window.addEventListener('load', setupAOS);

// --- ヒーローを少しスクロールしたら .reveal-after-hero を表示（window.scrollY 版） ---
document.addEventListener('DOMContentLoaded', () => {
  const targets = Array.from(document.querySelectorAll('.reveal-after-hero'));
  if (!targets.length) return;

  const hero = document.querySelector('.hero-section');

  // ヒーロー高さの 5% or 最低20px をしきい値に
  const getThreshold = () => {
    const base = hero ? Math.floor(hero.clientHeight * 0.05) : 0;
    return Math.max(20, base);
  };

  let threshold = getThreshold();
  let revealed = false;

  const reveal = () => {
    targets.forEach(el => {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
    });
  };

  const onScroll = () => {
    if (revealed) return;
    if (window.scrollY > threshold) {
      reveal();
      revealed = true;
      window.removeEventListener('scroll', onScroll);
    }
  };

  // 初期チェック & 監視
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    threshold = getThreshold();
    onScroll();
  });
});
