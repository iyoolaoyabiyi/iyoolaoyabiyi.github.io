const gui = {
  isMenuOpen: false,
  activate() {
    const icon = document.querySelector('.nav-icon');
    const lines = document.querySelectorAll('.nav-icon-line');
    const nav = document.querySelector('.header-nav');
    icon.addEventListener('click', () => {
      if (!gui.isMenuOpen) {
        lines.forEach((line, index) => {
          line.style.transform = index % 2 ? 'rotate(45deg)' : 'rotate(-45deg)';
        });
        nav.style.display = 'block';
        nav.style.visibility = 'visible';
      } else {
        lines.forEach((line, index) => {
          line.style.transform =   'rotate(0)';
          line.style.transform = index % 2 ? 'translateY(-5px)' : 'translateY(5px)';
        });
        nav.style.display = 'none';
        nav.style.visibility = 'hidden';
      }
      gui.isMenuOpen = !gui.isMenuOpen;
    });
  }
}

export default gui;