import PROFILE from "./configs/myProfile.js";

const gui = {
  isMenuOpen: true,
  window: document.querySelector('.gui-window'),
  paddingWidth: 10,
  openTerminalBtn: document.getElementById('openTerminalBtn'),
  tabBtns: document.querySelectorAll('.tabs-btns button'),
  navItems: document.querySelectorAll('.header-nav-list li button'),
  tabs: document.querySelectorAll('.tab'),
  accords: document.querySelectorAll('.accord'),
  activateMenu() {
    const icon = document.querySelector('.nav-icon');
    const headerLogo = document.querySelector('.header-logo');
    const lines = document.querySelectorAll('.nav-icon-line');
    const nav = document.querySelector('.header-nav');

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
        headerLogo.style.margin = '0';
        if (!this.isMenuOpen) {
          openMenu();
        }
      } else {
        if (this.isMenuOpen) {
          headerLogo.style.margin = 'auto';
        }
      }
    });

    window.addEventListener('scroll', () => {
      if (window.innerWidth < 576) {
        if (window.scrollY > 40) {
          if (this.isMenuOpen) {
            icon.parentElement.style.display = 'block';
            headerLogo.style.margin = '0';
            closeMenu();
          } 
        } else {
          icon.parentElement.style.display = 'none';
          headerLogo.style.margin = 'auto';
          if (!this.isMenuOpen) {
            openMenu();
          }
        }
      }
    });

    headerLogo.addEventListener('mouseenter', function() {
      const textEl = this.querySelector('h1');
      textEl.style.fontSize = `23px`;
      textEl.textContent = 'Iyoolaoyabiyi';
      icon.parentElement.style.paddingTop = `${gui.paddingWidth}px`;
      
    });
    headerLogo.addEventListener('mouseleave', function() {
      const textEl = this.querySelector('h1');
      textEl.style.fontSize = '32px';
      textEl.textContent = 'IYO';
      icon.parentElement.style.paddingTop = `${gui.paddingWidth + 7}px`;
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
  populateProfile() {
    const nameEl = document.querySelector('#fullName');
    const usernameEl = document.querySelector('#username');
    const roleEl = document.querySelector('#role');
    const locationEl = document.querySelector('#location');
    const descEl = document.querySelector('#description');
    const descP = document.createElement('p');
    const otherDescDiv = document.createElement('div');
    const descBtn = document.createElement('button');
    const stackListEl = document.querySelector('#stackList');
    const studiesListEl = document.querySelector('#studiesList');
    const interestsListEl = document.querySelector('#interestsList');
    const studiesList = document.createElement('ul');
    const interestsList = document.createElement('ul');
    const { name, username, role, location, description, otherDescriptions, techStack, currentStudies, interests } = PROFILE;

    nameEl.textContent = name;
    usernameEl.textContent = `@${username}`;
    roleEl.textContent = role;
    locationEl.textContent = location;
    descP.textContent = description;
    descBtn.textContent = 'show more';
    otherDescDiv.classList.add('hidden');
    descBtn.addEventListener('click', () => {
      if (otherDescDiv.classList.contains('hidden')) {
        otherDescDiv.classList.remove('hidden');
        descEl.querySelector('button').remove();
        descBtn.textContent = 'show less';
        descEl.append(descBtn);
      } else {
        otherDescDiv.classList.add('hidden');
        descBtn.textContent = 'show more';
      }
    });
    otherDescriptions.forEach(desc => {
      const p = document.createElement('p');
      p.textContent = desc;
      otherDescDiv.append(p);
    });
    descEl.append(descP, descBtn, otherDescDiv);
    // Add Tech Stack
    Object.keys(techStack).forEach(stack => {
      const listTemplate = document.querySelector('#listTemplate');
      const profileList = listTemplate.content.cloneNode(true);
      const listHeading = profileList.querySelector('h4');
      const listEl = profileList.querySelector('ul');
      listHeading.textContent = stack.toUpperCase();
      techStack[stack].forEach(tech => {
        const li = document.createElement('li');
        li.textContent = tech;
        listEl.append(li);
      });
      stackListEl.append(profileList);
    });
    // Add Studies
    currentStudies.forEach(study => {
      const li = document.createElement('li');
      li.textContent = study;
      studiesList.append(li);
    });
    studiesListEl.append(studiesList);
    // Add Interests
    interests.forEach(interest => {
      const li = document.createElement('li');
      li.textContent = interest;
      interestsList.append(li);
    });
    interestsListEl.append(interestsList);
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