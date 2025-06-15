function adjustHeaderSpace() {
  const header = document.querySelector('header');
  if (!header) return;
  const headerHeight = header.offsetHeight;
  document.body.style.paddingTop = headerHeight + 'px';
  // サイドバーのpadding-topは必要に応じて
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.style.paddingTop = '24px';
  }
}
window.addEventListener('DOMContentLoaded', adjustHeaderSpace);
window.addEventListener('resize', adjustHeaderSpace); 