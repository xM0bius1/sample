// ====== パーツ読み込み（Promise対応・重複script抑止） ======
async function includeParts(id, url, afterInsert) {
  const container = document.getElementById(id);
  if (!container) {
    console.warn(`ID ${id} が見つかりませんでした`);
    return;
  }
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${url} 読み込みエラー: ${res.status}`);
    const html = await res.text();

    // HTML挿入
    container.insertAdjacentHTML('beforeend', html);

    // script タグの再実行（既に読み込み済みの外部JSはスキップ）
    const scripts = container.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        // 既に同一srcが存在するならスキップ（重複実行防止）
        const exists = !!document.querySelector(`script[src="${script.src}"]`);
        if (exists) return;
        newScript.src = script.src;
        newScript.defer = true;
      } else {
        newScript.textContent = script.textContent;
      }
      document.body.appendChild(newScript);
    });

    // 挿入後フック
    if (typeof afterInsert === 'function') afterInsert(container);
  } catch (err) {
    console.error('読み込み失敗:', err);
  }
}

// ====== ヘッダー専用フック（ハンバーガー配線） ======
function wireHeader(container) {
  // カスタム実装（id="hamburger-btn" と id="nav-menu" の組み合わせ想定）
  const hamburger = container.querySelector('#hamburger-btn');
  const navMenu = container.querySelector('#nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    // モバイル：リンククリックで閉じる
    navMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navMenu.classList.remove('active'))
    );
  }
  // Bootstrap Navbar を使っている場合は data-bs-* で動くので特に不要
}

// ====== AOS 初期化 & スタッガー（自動ディレイ） ======
function setupAOS() {
  if (!window.AOS) return; // 読み込まれていなければスキップ
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  AOS.init({
    offset: 120,
    duration: reduce ? 0 : 700,
    easing: 'ease-out',
    once: true,
    disable: () => reduce
  });

  // .stagger コンテナ配下の [data-aos] に 0,100,200... を自動付与
  document.querySelectorAll('.stagger').forEach((group) => {
    const step = Number(group.dataset.stagger || 100);
    group.querySelectorAll('[data-aos]').forEach((el, i) => {
      // 既に delay 指定があれば尊重
      if (!el.hasAttribute('data-aos-delay')) {
        el.setAttribute('data-aos-delay', String(i * step));
      }
    });
  });

  // 部品読み込み後のレイアウト反映
  if (typeof AOS.refreshHard === 'function') AOS.refreshHard();
}

// ====== 起動シーケンス ======
document.addEventListener('DOMContentLoaded', () => {
  // パーツ読み込み（完了後に初期化をまとめて行う）
  Promise.all([
    includeParts('header', 'assets/parts/header.html', wireHeader),
    includeParts('footer', 'assets/parts/footer.html'),
    includeParts('hero-video', 'assets/parts/herovideo.html')
  ]).finally(() => {
    setupAOS();
  });
});
