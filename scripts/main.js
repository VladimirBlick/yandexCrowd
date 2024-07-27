function createtournametMembers__carosel (tournametMember__containerSelector) {
  const tournametMember__container = document.querySelector(tournametMember__containerSelector);
  const tournametMembersList = tournametMember__container.querySelector('.tournametMembers__list');
  const prevButton = tournametMember__container.querySelector('.tournametMembers__prev-btn');
  const nextButton = tournametMember__container.querySelector('.tournametMembers__next-btn');
  const tournametMembers = tournametMember__container.querySelectorAll('.tournametMember');
  const tournametMembersLength = tournametMembers.length;
  const tournametMember = tournametMember__container.querySelector('.tournametMember');
  const currenttournametMembers = tournametMember__container.querySelector('.tournametMembers__current-items');
  const counttournametMembers = tournametMember__container.querySelector('.tournametMembers__count-items');

  let currentIndex = 0;
  let visibleItems = calculateVisibletournametMembers(tournametMembersList.offsetWidth, tournametMember.offsetWidth);
  let autoSlideTimeout;

  // Автоматическая смена слайдов
  function autoSlide(initialDelay = 0) {
    clearTimeout(autoSlideTimeout);
    autoSlideTimeout = setTimeout(() => {
      if (currentIndex + visibleItems < tournametMembersLength) {
        currentIndex += visibleItems;
      } else {
        currentIndex = 0;
      }
      updateUI();
      autoSlide(4000);
    }, initialDelay);
  }

  // Обновление интерфейса
  function updateUI() {
    counttournametMembers.textContent = tournametMembersLength.toString();
    movetournametMembersList();
    updateButtonState();
    updateIndicator();
  }

  // Смещение списка участников
  function movetournametMembersList() {
    currentIndex = Math.min(currentIndex, tournametMembersLength - visibleItems);
    const offset = currentIndex * (tournametMember.offsetWidth + (window.innerWidth > 1350 ? 20 : 0));
    tournametMembersList.style.transform = `translateX(-${offset}px)`;
  }

  // Упрвление кнопкой вперед
  function handleClickNext() {
    clearTimeout(autoSlideTimeout);
    if (currentIndex + visibleItems < tournametMembersLength) {
      currentIndex += visibleItems;
    }
    updateUI();
    autoSlide(4000);
  }

  // Управление кнопкой назад
  function handleClickPrev() {
    clearTimeout(autoSlideTimeout);
    currentIndex = Math.max(0, currentIndex - visibleItems);
    updateUI();
    autoSlide(4000);
  }

  // Расчет кол-ва элементов видимых в карусели
  function calculateVisibletournametMembers(tournametMember__containerWidth, itemWidth) {
    const tolerance = 0.05;
    const exactCount = tournametMember__containerWidth / itemWidth;
    const roundedCount = Math.floor(exactCount);
    const fraction = exactCount - roundedCount;
    return (1 - fraction <= tolerance) ? roundedCount + 1 : roundedCount;
  }

  // Обновление индикатора текущего положения
  function updateIndicator() {
    const endIndex = Math.min(currentIndex + visibleItems, tournametMembersLength);
    currenttournametMembers.textContent = endIndex.toString();
  }

  // Обновление активности кнопок
  function updateButtonState() {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === tournametMembersLength - visibleItems;
  }

  nextButton.addEventListener('click', handleClickNext);
  prevButton.addEventListener('click', handleClickPrev);

  window.addEventListener('resize', debounce(() => {
    visibleItems = calculateVisibletournametMembers(tournametMembersList.offsetWidth, tournametMember.offsetWidth);
    if (currentIndex > tournametMembersLength - visibleItems) {
      currentIndex = Math.max(0, tournametMembersLength - visibleItems);
    }
    updateUI();
    autoSlide(4000);
  }, 150));

  updateUI();
  autoSlide(4000);
}

document.addEventListener('DOMContentLoaded', function () {
  createtournametMembers__carosel ('.tournametMembers__carosel ');
});
;function debounce(callee, timeout) {
  let lastCallTimer;

  return function perform(...args) {
    const context = this;
    if (lastCallTimer) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => {
      callee.apply(context, args);
    }, timeout);
  }
};document.fonts.load('1em "Merriweather"').then(function () {

  const runningLinetournametMember__containers = document.querySelectorAll('.running-line__tournametMember__container');

  runningLinetournametMember__containers.forEach((tournametMember__container) => {
    const clonedtournametMember__container = tournametMember__container.cloneNode(true);
    const parentSection = tournametMember__container.parentElement;
    parentSection.appendChild(clonedtournametMember__container);
  })

  document.querySelectorAll('.running-line__tournametMember__container').forEach(tournametMember__container => {
    tournametMember__container.classList.add('running-line__animated');
  });
});;function createSlideShow(gridStepsSelector) {
  let currentSlideIndex = 0;
  const gridSteps = document.querySelector(gridStepsSelector);
  const steps = gridSteps.querySelectorAll('.grid-steps__step');
  const prevButton = document.querySelector('.slider-controls__button_type_prev');
  const nextButton = document.querySelector('.slider-controls__button_type_next');
  const indicatorstournametMember__container = document.querySelector('.slider-controls__buttons-tournametMember__container');
  let isSliderInitialized = false;
  let eventListenersAdded = false;

  // Отображает активный слайд, обновляет состояние кнопок навигации
  function showCurrentSlide() {

    steps.forEach((step) => {
      step.style.visibility = 'hidden';
      step.style.position = 'absolute';
    });

    cachedSlides[currentSlideIndex].forEach((step) => {
      step.style.visibility = 'visible';
      step.style.position = 'relative';
    });

    updateActiveIndicator();

    prevButton.disabled = currentSlideIndex === 0;
    nextButton.disabled = currentSlideIndex === cachedSlides.length - 1;
  }

  // Рассчитывает и группирует шаги в слайды, в зависимости от высоты шагов с учетом контента.
  function calculateSlides() {
    const gridStepsStyles = window.getComputedStyle(gridSteps);
    const gridStepsPaddingTop = parseInt(gridStepsStyles.paddingTop, 10);
    const gridStepsPaddingBottom = parseInt(gridStepsStyles.paddingBottom, 10);
    const tournametMember__containerHeight = gridSteps.offsetHeight - gridStepsPaddingBottom - gridStepsPaddingTop;

    const slides = [];
    let currentSlide = [];
    let totalHeight = 0;

    steps.forEach((step) => {
      const stepHeight = step.offsetHeight;
      if (stepHeight > tournametMember__containerHeight / 2) {
        if (totalHeight > 0) {
          slides.push(currentSlide);
          currentSlide = [];
          totalHeight = 0;
        }
        slides.push([step]);
      } else if (totalHeight + stepHeight > tournametMember__containerHeight) {
        slides.push(currentSlide);
        currentSlide = [step];
        totalHeight = stepHeight;
      } else {
        currentSlide.push(step);
        totalHeight += stepHeight;
      }
    });

    if (currentSlide.length > 0) {
      slides.push(currentSlide);
    }

    return slides;
  }

  // Добавляет индикаторы для каждого слайда
  function addIndicators() {
    const indicatortournametMember__container = document.querySelector('.slider-controls__buttons-tournametMember__container');
    indicatortournametMember__container.innerHTML = '';

    for (let i = 0; i < cachedSlides.length; i++) {
      const indicator = document.createElement('button');
      indicator.classList.add('slider-controls__circle-button');
      indicator.addEventListener('click', () => {
        currentSlideIndex = i;
        showCurrentSlide();
      })

      indicatortournametMember__container.appendChild(indicator);
    }

    updateActiveIndicator();
  }

  // Обновляет активный индикатор слайда
  function updateActiveIndicator() {
    indicatorstournametMember__container.querySelectorAll('.slider-controls__circle-button').forEach((indicator, index) => {
      indicator.classList.toggle('slider-controls__circle-button_active', index === currentSlideIndex);
    });
  }

  // Инициализиует слайдер, добавляет слушатели кнопок навигации
  function initSlider() {
    if (!isSliderInitialized) {
      cachedSlides = calculateSlides();
      currentSlideIndex = Math.min(currentSlideIndex, cachedSlides.length - 1);
      addIndicators();
      showCurrentSlide();

      if (!eventListenersAdded) {
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
        eventListenersAdded = true;
      }
      isSliderInitialized = true;
    }
  }

  // Удаляет слушатели кнопок и возвращает компонент к исходному виду
  function deinitSlider() {
    if (isSliderInitialized) {
      steps.forEach(step => {
        step.style.visibility = '';
        step.style.position = '';
        step.style.opacity = '';
      });
      if (eventListenersAdded) {
        nextButton.removeEventListener('click', nextSlide);
        prevButton.removeEventListener('click', prevSlide);
        eventListenersAdded = false;
      }
      isSliderInitialized = false;
    }
  }

  // Следующий слайд
  function nextSlide() {
    if (currentSlideIndex < cachedSlides.length - 1) {
      currentSlideIndex++;
      showCurrentSlide();
    }
  }

  // Предыдущий слайд
  function prevSlide() {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      showCurrentSlide();
    }
  }

  // Проверяет инициализацию слайдера для ширины менее 680px
  function checkSlideShow() {
    if (window.matchMedia('(max-width: 680px)').matches) {
      if (!isSliderInitialized) {
        initSlider();
      } else {
        cachedSlides = calculateSlides();
        addIndicators();
        showCurrentSlide();
      }
    } else {
      deinitSlider();
    }
  }

  checkSlideShow();

  const debouncedCheckSlideShow = debounce(checkSlideShow, 150);
  window.addEventListener('resize', debouncedCheckSlideShow);
}

document.addEventListener('DOMContentLoaded', function () {
  createSlideShow('.grid-steps');
});