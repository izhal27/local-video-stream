const toggleNav = document.querySelector('.toggle');
const hamburgerBtn = document.querySelector('#hamburger');
const imgOpen = document.getElementById('hamburger-open');
const imgClose = document.getElementById('hamburger-close');
let player = document.getElementById('my-video');
let isOpen = false;

if (player) {
  player = videojs('my-video', {
    fluid: true,
  });

  player.seekButtons({
    forward: 30,
    back: 10,
  });
  player.landscapeFullscreen();
}

const show = el => {
  el.classList.remove('hidden');
  el.classList.add('block');
};
const hide = el => {
  el.classList.remove('block');
  el.classList.add('hidden');
};

const toggle = (showEl, hideEl) => {
  show(showEl);
  hide(hideEl);
};

const toggleImg = () => {
  if (isOpen) {
    toggle(imgOpen, imgClose);
  } else {
    toggle(imgClose, imgOpen);
  }
};

hamburgerBtn.addEventListener('click', () => {
  toggleNav.classList.toggle('hidden');
  toggleImg();
  isOpen = !isOpen;
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    if (isOpen) {
      toggleNav.classList.toggle('hidden');
      toggleImg();
      isOpen = false;
    }
  }
});
