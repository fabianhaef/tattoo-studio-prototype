/**
 * GSAP motion layer — Alena Lizier
 * Requires: gsap, ScrollTrigger (loaded before this file)
 */
(function () {
  'use strict';

  const EASE = {
    out: 'power3.out',
    inOut: 'power2.inOut',
    soft: 'power2.out',
  };

  function refreshScroll() {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  function initHeroIntro(slides, updateHeroCounter, startHeroAutoplay) {
    gsap.set(slides, { opacity: 0, scale: 1 });
    gsap.set(slides[0], { opacity: 1 });
    slides[0].classList.add('is-active');
    updateHeroCounter();

    const introEls = [
      '.hero__chapter',
      '.hero__carousel',
      '.hero__nav',
      '.hero__eyebrow',
      '.hero__title',
      '.hero__subtitle',
      '.hero__services',
      '.hero__cta',
      '.hero__scroll',
    ];

    gsap.set(introEls, { opacity: 0, y: 20 });
    gsap.set('.hero__carousel', { y: 16, scale: 0.96 });
    gsap.set('.hero__title', { y: 28 });
    gsap.set('.ginkgo-float', { opacity: 0, y: 24 });
    gsap.set('.nav', { opacity: 0, y: -12 });
    gsap.set('.hero__blob', { scale: 0.92 });

    const introTl = gsap.timeline({
      defaults: { ease: EASE.out },
      onComplete: () => {
        gsap.set(introEls.concat(['.nav', '.ginkgo-float']), { clearProps: 'transform' });
        gsap.to('.hero__blob', {
          scale: 1.02,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        refreshScroll();
      },
    });

    introTl
      .to('.ginkgo-float', { opacity: 0.07, y: 0, stagger: 0.1, duration: 1 }, 0)
      .to('.nav', { opacity: 1, y: 0, duration: 0.6 }, 0.12)
      .to('.hero__blob', { scale: 1, duration: 1.1, ease: EASE.soft }, 0.08)
      .to('.hero__carousel', { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0.2)
      .to('.hero__chapter', { opacity: 1, y: 0, duration: 0.55 }, 0.32)
      .to('.hero__nav', { opacity: 1, y: 0, duration: 0.5 }, 0.38)
      .to('.hero__title', { opacity: 1, y: 0, duration: 0.8 }, 0.42)
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.55 }, 0.5)
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.65 }, 0.54)
      .to('.hero__services', { opacity: 1, y: 0, duration: 0.55 }, 0.6)
      .to('.hero__cta', { opacity: 1, y: 0, duration: 0.5 }, 0.66)
      .to('.hero__scroll', { opacity: 0.55, y: 0, duration: 0.45 }, 0.72);

    startHeroAutoplay();
  }

  function createHeroCarousel(slides, heroCounter, reduceMotion) {
    let heroIndex = 0;
    const heroTotal = slides.length;
    let heroBusy = false;
    let heroTimer;

    function updateHeroCounter() {
      heroCounter.textContent = `${String(heroIndex + 1).padStart(2, '0')} / ${String(heroTotal).padStart(2, '0')}`;
    }

    function setHeroSlide(idx) {
      const next = (idx + heroTotal) % heroTotal;
      if (next === heroIndex || heroBusy) return;

      const current = slides[heroIndex];
      const upcoming = slides[next];

      if (reduceMotion) {
        current.classList.remove('is-active');
        upcoming.classList.add('is-active');
        gsap.set(current, { opacity: 0 });
        gsap.set(upcoming, { opacity: 1 });
        heroIndex = next;
        updateHeroCounter();
        return;
      }

      heroBusy = true;
      gsap.timeline({
        defaults: { ease: EASE.inOut },
        onComplete: () => {
          gsap.set(current, { scale: 1, clearProps: 'scale' });
          current.classList.remove('is-active');
          upcoming.classList.add('is-active');
          heroIndex = next;
          heroBusy = false;
          updateHeroCounter();
        },
      })
        .to(current, { opacity: 0, scale: 1.03, duration: 0.55 })
        .fromTo(upcoming, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.7 }, '-=0.32');
    }

    function startHeroAutoplay() {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => setHeroSlide(heroIndex + 1), 7000);
    }

    return {
      setHeroSlide,
      startHeroAutoplay,
      updateHeroCounter,
      prev: () => setHeroSlide(heroIndex - 1),
      next: () => setHeroSlide(heroIndex + 1),
      pauseAutoplay: () => clearInterval(heroTimer),
      resumeAutoplay: startHeroAutoplay,
    };
  }

  function initScrollMotion() {
    gsap.set('.reveal', { opacity: 0, y: 24 });

    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 94%',
          toggleActions: 'play none none none',
        },
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: EASE.out,
      });
    });

      ScrollTrigger.batch('.work-item', {
        start: 'top 98%',
        once: true,
        onEnter: (batch) => {
          gsap.from(batch, {
            opacity: 0,
            y: 20,
            stagger: 0.06,
            duration: 0.65,
            ease: EASE.out,
            overwrite: true,
          });
        },
      });
  }

  function initWorkHover(finePointer) {
    if (!finePointer) return;

    document.querySelectorAll('.work-item').forEach((item) => {
      const preview = item.querySelector('.work-item__preview');
      const name = item.querySelector('.work-item__name');

      gsap.set(preview, { yPercent: -50, scale: 0.94, opacity: 0, x: 0 });

      item.addEventListener('mouseenter', () => {
        gsap.to(preview, { opacity: 1, scale: 1, x: -10, duration: 0.4, ease: EASE.out });
        gsap.to(name, { x: 6, duration: 0.35, ease: EASE.out });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(preview, { opacity: 0, scale: 0.94, x: 0, duration: 0.3, ease: EASE.inOut });
        gsap.to(name, { x: 0, duration: 0.3, ease: EASE.inOut });
      });
    });
  }

  function initGinkgoParallax() {
    gsap.to('.ginkgo-float--1', {
      y: -56,
      ease: 'none',
      scrollTrigger: {
        trigger: '.page',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });

    gsap.to('.ginkgo-float--2', {
      y: 48,
      ease: 'none',
      scrollTrigger: {
        trigger: '.page',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });
  }

  function createMenuController(menu, menuBtn) {
    let menuOpen = false;

    const menuTl = gsap.timeline({
      paused: true,
      defaults: { ease: EASE.out },
      onReverseComplete: () => {
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Menü öffnen');
        document.body.style.overflow = '';
        menuOpen = false;
        gsap.set(menu, { visibility: 'hidden', pointerEvents: 'none' });
      },
    });

    menuTl
      .set(menu, { visibility: 'visible', pointerEvents: 'all' })
      .to(menu, { opacity: 1, duration: 0.35 })
      .from('.menu-link', { y: 48, opacity: 0, stagger: 0.07, duration: 0.65 }, '-=0.18')
      .from('.menu-footer a', { y: 12, opacity: 0, stagger: 0.05, duration: 0.4 }, '-=0.4')
      .from('.menu-overlay__num', { scale: 0.9, opacity: 0, duration: 0.55 }, '-=0.5');

    return {
      isOpen: () => menuOpen,
      open(reduceMotion) {
        if (menuOpen) return;
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        menuBtn.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Menü schließen');
        document.body.style.overflow = 'hidden';
        menuOpen = true;

        if (reduceMotion) {
          gsap.set(menu, { opacity: 1, visibility: 'visible', pointerEvents: 'all' });
          return;
        }
        menuTl.play(0);
      },
      close(reduceMotion) {
        if (!menuOpen) return;
        if (reduceMotion) {
          menu.classList.remove('is-open');
          menu.setAttribute('aria-hidden', 'true');
          menuBtn.classList.remove('is-open');
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.setAttribute('aria-label', 'Menü öffnen');
          document.body.style.overflow = '';
          menuOpen = false;
          gsap.set(menu, { clearProps: 'opacity,visibility,pointerEvents' });
          return;
        }
        menuTl.reverse();
      },
    };
  }

  function createLightboxMotion(lightbox, lightboxImgWrap, reduceMotion) {
    return {
      open() {
        if (reduceMotion) {
          gsap.set(lightbox, { opacity: 1, visibility: 'visible', pointerEvents: 'all' });
          return;
        }
        gsap.set(lightbox, { visibility: 'visible', pointerEvents: 'all' });
        gsap.timeline()
          .to(lightbox, { opacity: 1, duration: 0.3, ease: EASE.soft })
          .fromTo(lightboxImgWrap,
            { opacity: 0, scale: 0.96, y: 16 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: EASE.out },
            '-=0.12'
          );
      },
      close(onDone) {
        if (reduceMotion) {
          gsap.set(lightbox, { clearProps: 'opacity,visibility,pointerEvents' });
          onDone();
          return;
        }
        gsap.to(lightbox, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(lightbox, { visibility: 'hidden', pointerEvents: 'none' });
            gsap.set(lightboxImgWrap, { clearProps: 'opacity,scale,y' });
            onDone();
          },
        });
      },
      animateImage(lightboxImgWrap) {
        if (reduceMotion) return;
        gsap.fromTo(lightboxImgWrap,
          { opacity: 0, scale: 0.98, y: 8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: EASE.out }
        );
      },
    };
  }

  function initReducedMotion(slides, updateHeroCounter, startHeroAutoplay) {
    gsap.set('.reveal, .work-item', { opacity: 1, y: 0, clearProps: 'transform' });
    gsap.set(slides, { opacity: 0 });
    gsap.set(slides[0], { opacity: 1 });
    slides[0].classList.add('is-active');
    updateHeroCounter();
    startHeroAutoplay();
  }

  window.AlenaMotion = {
    init(options) {
      const {
        reduceMotion,
        finePointer,
        slides,
        heroCounter,
        menu,
        menuBtn,
        lightbox,
        lightboxImgWrap,
      } = options;

      const carousel = createHeroCarousel(slides, heroCounter, reduceMotion);
      const menuCtrl = createMenuController(menu, menuBtn);
      const lightboxMotion = createLightboxMotion(lightbox, lightboxImgWrap, reduceMotion);

      if (reduceMotion) {
        initReducedMotion(slides, carousel.updateHeroCounter, carousel.startHeroAutoplay);
      } else {
        initHeroIntro(slides, carousel.updateHeroCounter, carousel.startHeroAutoplay);
        initScrollMotion();
        initWorkHover(finePointer);
        initGinkgoParallax();
      }

      window.addEventListener('load', refreshScroll);
      window.addEventListener('resize', refreshScroll);

      return { carousel, menuCtrl, lightboxMotion };
    },
  };
})();
