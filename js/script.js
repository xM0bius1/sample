// DOMContentLoadedイベントリスナーは、HTMLドキュメントが完全にロードされ、解析された後に実行される関数を登録します。
document.addEventListener("DOMContentLoaded", () => {
  // すべてのナビゲーションリンクを取得します。
  const navLinks = document.querySelectorAll(".nav-links li a");
  // すべてのコンテンツセクションを取得します。
  const sections = document.querySelectorAll(".content-section");

  // Intersection Observerのオプションを定義します。
  // root: null はビューポートを監視対象のルートとすることを意味します。
  // rootMargin: '0px' はルートのマージンを0に設定します。
  // threshold: 0.5 は、要素の50%がビューポートに入ったときにコールバックを実行することを意味します。
  // これにより、セクションが画面の半分以上表示されたときにアクティブになります。
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // セクションの50%が見えたらトリガー
  };

  // Intersection Observerのインスタンスを作成します。
  // このオブザーバーは、指定された要素がビューポートに入るか出るかを監視します。
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    // 各エントリー（監視対象の要素）についてループ処理を行います。
    entries.forEach((entry) => {
      // 現在のセクションのIDから対応するナビゲーションリンクのhref属性を生成します。
      const targetId = `#${entry.target.id}`;
      const correspondingNavLink = document.querySelector(
        `.nav-links li a[href="${targetId}"]`
      );

      // セクションがビューポートに入った場合 (isIntersecting が true)
      if (entry.isIntersecting) {
        // セクションに 'is-visible' クラスを追加してフェードイン効果をトリガーします。
        entry.target.classList.add("is-visible");

        // すべてのナビゲーションリンクから 'active' クラスを削除します。
        navLinks.forEach((link) => link.classList.remove("active"));
        // 現在表示されているセクションに対応するリンクをアクティブにします。
        if (correspondingNavLink) {
          correspondingNavLink.classList.add("active");
        }
      } else {
        // セクションがビューポートから出た場合
        // この場合、フェードアウトさせたい場合は以下の行を有効にします。
        // 現在の実装では、一度フェードインしたらそのまま表示され続けます。
        // entry.target.classList.remove('is-visible');
        // if (correspondingNavLink) {
        //     correspondingNavLink.classList.remove('active');
        // }
      }
    });
  }, observerOptions);

  // 各コンテンツセクションをIntersection Observerの監視対象に追加します。
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // ナビゲーションリンクのクリックイベントリスナーを追加します。
  // クリックされたときに、対応するセクションへスムーズにスクロールします。
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // デフォルトのアンカーリンク動作（ページ内ジャンプ）を阻止します。

      // クリックされたリンクの 'href' 属性から対象セクションのIDを取得します。
      const targetId = link.getAttribute("href");
      // 対象セクションの要素を取得します。
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // 対象セクションへスムーズにスクロールします。
        targetSection.scrollIntoView({
          behavior: "smooth",
        });

        // クリックされたリンクをアクティブな状態に設定します。
        // スクロール完了を待たずに即時反映されます。
        navLinks.forEach((nav) => nav.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });
});
