(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.documentElement.classList.add(reduceMotion ? 'no-motion' : 'gsap-ready');

  const works = [
    {
      name: 'Powder Brows',
      typeLabel: 'Permanent Make-up',
      images: [
        'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=80',
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80',
      ],
    },
    {
      name: 'Lip Blush',
      typeLabel: 'Permanent Make-up',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80',
      ],
    },
    {
      name: 'Wimpernkranz',
      typeLabel: 'Permanent Make-up',
      images: [
        'https://images.unsplash.com/photo-1583001378847-14197e3db9ed?w=900&q=80',
      ],
    },
    {
      name: 'Fine Line Florals',
      typeLabel: 'Fine Line Tattoo',
      images: [
        'https://images.unsplash.com/photo-1590246815117-0b8925b6860e?w=900&q=80',
        'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=900&q=80',
      ],
    },
    {
      name: 'Botanical Sleeve',
      typeLabel: 'Fine Line Tattoo',
      images: [
        'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=900&q=80',
        'https://images.unsplash.com/photo-1574169208507-84376144848b?w=900&q=80',
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&q=80',
      ],
    },
    {
      name: 'Minimal Script',
      typeLabel: 'Fine Line Tattoo',
      images: [
        'https://images.unsplash.com/photo-1598371839696-5c5bb1d9243c?w=900&q=80',
      ],
    },
  ];

  const workList = document.getElementById('work-list');
  works.forEach((work, i) => {
    const num = String(i + 1).padStart(2, '0');
    const n = work.images.length;
    const li = document.createElement('li');
    li.className = 'work-item';
    li.dataset.index = i;
    li.innerHTML = `
      <span class="work-item__num">${num}</span>
      <div class="work-item__main">
        <h3 class="work-item__name">${work.name}</h3>
        <span class="work-item__type">${work.typeLabel}</span>
      </div>
      <span class="work-item__count">${n} ${n === 1 ? 'Bild' : 'Bilder'}</span>
      <div class="work-item__preview" aria-hidden="true">
        <img src="${work.images[0]}" alt="">
      </div>
    `;
    li.addEventListener('click', () => openLightbox(i, 0));
    workList.appendChild(li);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImgWrap = document.querySelector('.lightbox__img-wrap');

  let currentWork = 0;
  let currentImg = 0;
  let lightboxOpen = false;
  let motionApi = null;

  function updateLightbox(animateImage = false) {
    const work = works[currentWork];
    lightboxTitle.textContent = work.name;
    lightboxImg.src = work.images[currentImg];
    lightboxImg.alt = `${work.name} — Bild ${currentImg + 1} von ${work.images.length}`;
    lightboxCounter.textContent = `${currentImg + 1} von ${work.images.length}`;
    lightboxPrev.style.visibility = currentImg > 0 ? 'visible' : 'hidden';
    lightboxNext.style.visibility = currentImg < work.images.length - 1 ? 'visible' : 'hidden';

    if (animateImage && lightboxOpen && motionApi) {
      motionApi.lightboxMotion.animateImage(lightboxImgWrap);
    }
  }

  function openLightbox(workIdx, imgIdx) {
    currentWork = workIdx;
    currentImg = imgIdx;
    updateLightbox(false);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxOpen = true;
    motionApi?.lightboxMotion.open();
  }

  function closeLightbox() {
    const finish = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxOpen = false;
    };

    if (motionApi) {
      motionApi.lightboxMotion.close(finish);
    } else {
      finish();
    }
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => {
    if (currentImg > 0) { currentImg--; updateLightbox(true); }
  });
  lightboxNext.addEventListener('click', () => {
    if (currentImg < works[currentWork].images.length - 1) { currentImg++; updateLightbox(true); }
  });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentImg > 0) { currentImg--; updateLightbox(true); }
    if (e.key === 'ArrowRight' && currentImg < works[currentWork].images.length - 1) { currentImg++; updateLightbox(true); }
  });

  const slides = Array.from(document.querySelectorAll('.hero__slide'));
  const heroCounter = document.getElementById('hero-counter');
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');

  motionApi = window.AlenaMotion.init({
    reduceMotion,
    finePointer,
    slides,
    heroCounter,
    menu,
    menuBtn,
    lightbox,
    lightboxImgWrap,
  });

  document.getElementById('hero-prev').addEventListener('click', () => motionApi.carousel.prev());
  document.getElementById('hero-next').addEventListener('click', () => motionApi.carousel.next());

  const heroCarousel = document.querySelector('.hero__carousel');
  heroCarousel.addEventListener('mouseenter', () => motionApi.carousel.pauseAutoplay());
  heroCarousel.addEventListener('mouseleave', () => motionApi.carousel.resumeAutoplay());

  menuBtn.addEventListener('click', () => {
    motionApi.menuCtrl.isOpen()
      ? motionApi.menuCtrl.close(reduceMotion)
      : motionApi.menuCtrl.open(reduceMotion);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => motionApi.menuCtrl.close(reduceMotion));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && motionApi.menuCtrl.isOpen()) {
      motionApi.menuCtrl.close(reduceMotion);
    }
  });

  document.querySelectorAll('.menu-link').forEach((link) => {
    const mirror = link.dataset.mirror;
    if (mirror) link.querySelector('.menu-link__back').textContent = mirror;
  });
})();
