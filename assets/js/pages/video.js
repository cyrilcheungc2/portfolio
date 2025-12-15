document.querySelectorAll('.gallery-item-caption video').forEach((vid) => {
  vid.onclick = () => {
    document.querySelector('.popup-video').style.display = 'block';
    document.querySelector('.popup-video video').src = vid.getAttribute('src');
  };
});

document.querySelector('span').onclick = () => {
  document.querySelector('.popup-video').style.display = 'none';
};

//////////

let video = document.getElementById('video-gallery'),
  btn = document.querySelector('menu-btn');

btn.addEventListener(
  'click',
  function () {
    video.classList.toggle('hidden');
  },
  false
);
