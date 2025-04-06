// Modal DOM
// const openBtn = document.getElementById('openModalBtn);
const closeBtn = document.getElementById('closeModal');
const dialog = document.getElementById('welcomeModal');

// Modal Functionality
// openBtn.addEventListener('click', () => {
//   dialog.showModal();
// });

closeBtn.addEventListener('click', () => {
  dialog.close();
  commandLineInput.focus();
});
// dialog.showModal();

