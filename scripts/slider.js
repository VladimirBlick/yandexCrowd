document.addEventListener('DOMContentLoaded', function() {
  const listContainer = document.querySelector('.tournamentStages__list-container');
  const listItems = document.querySelectorAll('.tournamentStages__list-item');
  const sliderControls = document.querySelector('.slider-controls');
  const prevButton = document.querySelector('.slider-controls__button_type_prev');
  const nextButton = document.querySelector('.slider-controls__button_type_next');
  const indicatorContainer = document.querySelector('.slider-controls__buttons-container');

  const slides = [
      [0, 1],
      [2],
      [3, 4],
      [5],
      [6]
];

  let currentSlide = 0;

  function createIndicators() {
      for (let i = 0; i < slides.length; i++) {
          const indicator = document.createElement('button');
          indicator.classList.add('slider-controls__indicator-button');
          indicator.addEventListener('click', () => goToSlide(i));
          indicatorContainer.appendChild(indicator);
      }
  }

  function updateIndicators() {
      const indicators = document.querySelectorAll('.slider-controls__indicator-button');
      indicators.forEach((indicator, index) => {
          indicator.classList.toggle('slider-controls__indicator-button_active', index === currentSlide);
      });
  }

  function showSlide(slideIndex) {
      listItems.forEach((item, index) => {
          if (slides[slideIndex].includes(index)) {
              item.style.display = 'flex';
              // Обновляем содержимое псевдоэлемента с правильным номером
              item.setAttribute('data-number', index + 1);
          } else {
              item.style.display = 'none';
          }
      });
      updateIndicators();
  }

  function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
  }

  function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
  }

  function goToSlide(slideIndex) {
      currentSlide = slideIndex;
      showSlide(currentSlide);
  }

  function checkWindowSize() {
      if (window.innerWidth <= 768) {
          sliderControls.style.display = 'flex';
          showSlide(currentSlide);
      } else {
          sliderControls.style.display = 'none';
          listItems.forEach((item, index) => {
              item.style.display = 'flex';
              item.setAttribute('data-number', index + 1);
          });
      }
  }

  // Инициализация
  createIndicators();
  checkWindowSize();

  // Обработчики событий
  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);
  window.addEventListener('resize', checkWindowSize);
});