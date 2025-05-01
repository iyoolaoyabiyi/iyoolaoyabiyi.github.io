

const gui = {
  isMenuOpen: true,
  window: document.querySelector('.gui-window'),
  openTerminalBtn: document.getElementById('openTerminalBtn'),
  tabBtns: document.querySelectorAll('.tabs-btns button'),
  navItems: document.querySelectorAll('.header-nav-list li button'),
  tabs: document.querySelectorAll('.tab'),
  activateMenu() {
    const icon = document.querySelector('.nav-icon');
    const logoContainer = document.querySelector('.header-logo');
    const lines = document.querySelectorAll('.nav-icon-line');
    const nav = document.querySelector('.header-nav');
    const headerLogo = document.querySelector('.header-logo h1');

    // Menu Management
    icon.addEventListener('click', () => {
      if (!gui.isMenuOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 576) {
        icon.parentElement.style.display = 'none';
        logoContainer.style.margin = '0';
        if (!this.isMenuOpen) {
          openMenu();
        }
      } else {
        if (this.isMenuOpen) {
          logoContainer.style.margin = 'auto';
        }
      }
    });

    window.addEventListener('scroll', () => {
      if (window.innerWidth < 576) {
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
      }
    });

    headerLogo.addEventListener('mouseover', function() {
      this.textContent = 'Iyoolaoyabiyi'
    });
    headerLogo.addEventListener('mouseleave', function() {
      this.textContent = 'IYO'
    });

    function openMenu() {
      nav.style.display = 'flex';
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
  },
  populateTab(tabID, contentArr) {
    const imgDir = './assets/images';
    const tabContainer = document.querySelector(`#${tabID}`);
    if (!tabContainer) {
      console.error(`Tab with id ${tabID} not found`);
      return;
    }
    if (contentArr.length === 0 || !contentArr) {
      const emptyMessage = document.createElement('p');
      emptyMessage.style.padding = '10px 0'
      emptyMessage.textContent = 'No content available';
      tabContainer.appendChild(emptyMessage);
      return;
    }
    const cardTemplate = document.querySelector(`#cardTemplate`);
    contentArr.forEach((item) => {
      const card = cardTemplate.content.cloneNode(true);
      const cardImg = card.querySelector('.card-img img');
      const cardTitle = card.querySelector('.card-title');
      const cardDescription = card.querySelector('.card-description');
      const sourceLink = card.querySelector('.source-link');
      const demoLink = card.querySelector('.demo-link');
      cardTitle.textContent = item.name ? item.name : 'Untitled';
      cardDescription.textContent = item.description;
      if (item.img) {
        cardImg.src =`${imgDir}/${item.img}`;
        cardImg.alt = item.name;
      } else card.querySelector('.card-img').remove();
      if (item.sourceLink) sourceLink.href = item.sourceLink;
      else sourceLink.remove();
      if (item.demoLink) demoLink.href = item.demoLink;
      else demoLink.remove();
      if (!item.img && !item.sourceLink && !item.demoLink) {
        card.querySelector('.card-footer').remove();
      }
      tabContainer.appendChild(card);
    });
  },
  openTab(btn) {
    if (!btn.classList.contains('active')) {
      if (btn)
      this.tabBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      btn.classList.add('active');
      this.tabs.forEach(tab => {
        if (btn.dataset.tabFor === tab.id) {
          this.tabs.forEach(tab => {
            tab.classList.add('hidden');
          })
          tab.classList.remove('hidden');
        }
      });
    }
  }
}

export default gui;