

const gui = {
  isMenuOpen: true,
  window: document.querySelector('.gui-window'),
  openTerminalBtn: document.getElementById('openTerminalBtn'),
  tabBtns: document.querySelectorAll('.tabs-btns button'),
  tabs: document.querySelectorAll('.tab'),
  activateMenu() {
    const icon = document.querySelector('.nav-icon');
    const logoContainer = document.querySelector('.header-logo');
    const lines = document.querySelectorAll('.nav-icon-line');
    const nav = document.querySelector('.header-nav');

    // Menu Management
    icon.addEventListener('click', () => {
      if (!gui.isMenuOpen) {
        openMenu();
        console.log(document.querySelectorAll('.open-gui-btn'));
      } else {
        closeMenu();
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
  populatePortfolio(portfolio) {
    const portfolioCardTemplate = document.querySelector('#cardTemplate');
    const portfolioContainer = document.querySelector('#portfolio');
    portfolio.forEach((item) => {
      const card = portfolioCardTemplate.content.cloneNode(true);
      const cardTitle = card.querySelector('.card-title');
      const cardDescription = card.querySelector('.card-description');
      const cardImg = card.querySelector('.card-img img');
      const sourceLink = card.querySelector('.source-link');
      const demoLink = card.querySelector('.demo-link');

      cardImg.src =`${imgDir}/${item.img}`;
      cardImg.alt = item.name;
      cardTitle.textContent = item.name;
      cardDescription.textContent = item.description;
      sourceLink.href = item.sourceLink;
      demoLink.href = item.demoLink;
      
      portfolioContainer.appendChild(card);
    });
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
  }
}

export default gui;