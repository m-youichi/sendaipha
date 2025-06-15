console.log("sidebar.js loaded");

// サイドバー要素が出現するまで待つ関数
function waitForSidebarAndInit() {
  const btn = document.getElementById('sidebar-toggle-inner');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (btn && sidebar && overlay) {
    // ここに本来の初期化処理
    const links = document.querySelectorAll('.sidebar a');
    const path = location.pathname.split('/').pop().replace(/\?.*$/, ''); // クエリ除去
    links.forEach(link => {
      if (link.getAttribute('href').replace(/\.html$/, '') === path.replace(/\.html$/, '')) {
        link.classList.add('active');
      }
    });
    btn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
      btn.textContent = sidebar.classList.contains('open') ? '◀' : '▶';
    });
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
      btn.textContent = '▶';
    });
  } else {
    // まだ要素が無ければ50ms後に再試行
    setTimeout(waitForSidebarAndInit, 50);
  }
}
waitForSidebarAndInit(); 