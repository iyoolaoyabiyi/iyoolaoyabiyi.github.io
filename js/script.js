// DOM
// const openBtn = document.getElementById('openModalBtn);
const closeBtn = document.getElementById('closeModal');
const dialog = document.getElementById('welcomeModal');
const openTerminalBtn = document.getElementById('openTerminalBtn');

// Modal Functionality
// openBtn.addEventListener('click', () => {
//   dialog.showModal();
// });

closeBtn.addEventListener('click', () => {
  dialog.close();
  commandLineInput.focus();
});
openTerminalBtn.addEventListener('click', () => {
  dialog.close();
  commandLineInput.focus();
  document.querySelector('.terminal').classList.remove("hidden");
  document.querySelector('.gui').classList.add("hidden");
  commandLineInput.focus();
});
// dialog.showModal();
