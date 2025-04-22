const gui = {
  isMenuOpen: true,
  activate() {
    const icon = document.querySelector('.nav-icon');
    const logoContainer = document.querySelector('.header-logo');
    const lines = document.querySelectorAll('.nav-icon-line');
    const nav = document.querySelector('.header-nav');
    icon.addEventListener('click', () => {
      if (!gui.isMenuOpen) {
        openMenu();
      } else {
        closeMenu();
      }
      
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        if (this.isMenuOpen) {
          icon.parentElement.style.display = 'block';
          logoContainer.style.margin = '0';
          closeMenu();
        } 
      } else {
          icon.parentElement.style.display = 'none';
          logoContainer.style.margin = 'auto';
          if (!this.isMenuOpen) {
            openMenu();
          }
        }
    });
    function openMenu() {
      nav.style.display = 'block';
      setTimeout(() => {
        nav.style.opacity = '1';
      }, 300);
      lines.forEach((line, index) => {
        line.style.transform = index % 2 ? 'rotate(45deg)' : 'rotate(-45deg)';
      });
      gui.isMenuOpen = true;
    }
    function closeMenu() {
      nav.style.opacity = '0';
      setTimeout(() => {
        nav.style.display = 'none';
      }, 300);
      lines.forEach((line, index) => {
        line.style.transform = index % 2 ? 'translateY(-5px)' : 'translateY(5px)';
      });
      gui.isMenuOpen = false;
    }
  }
}

export default gui;