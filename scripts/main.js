function createtournametMembers__carosel(tournametMember__containerSelector) {
  const tournametMember__container = document.querySelector(tournametMember__containerSelector);
  const tournametMembersList = tournametMember__container.querySelector('.tournametMembers__list');
  const prevButton = tournametMember__container.querySelector('.tournametMembers__prev-btn');
  const nextButton = tournametMember__container.querySelector('.tournametMembers__next-btn');
  const tournametMembers = tournametMember__container.querySelectorAll('.tournametMember');
  const tournametMembersLength = tournametMembers.length;
  const currenttournametMembers = tournametMember__container.querySelector('.tournametMembers__current-items');
  const counttournametMembers = tournametMember__container.querySelector('.tournametMembers__count-items');

  let currentIndex = 0;
  let itemWidth = tournametMembers[0].offsetWidth;
  let gapWidth = 20; // Значение column-gap
  let autoSlideTimeout;

  function updateItemWidth() {
    itemWidth = tournametMembers[0].offsetWidth;
    gapWidth = window.innerWidth <= 768 ? 0 : 20;
  }

  function autoSlide(delay = 4000) {
    clearTimeout(autoSlideTimeout);
    autoSlideTimeout = setTimeout(() => {
      moveNext();
      autoSlide();
    }, delay);
  }

  function updateUI() {
    counttournametMembers.textContent = tournametMembersLength.toString();
    movetournametMembersList();
    updateIndicator();
  }

  function movetournametMembersList() {
    const offset = -(currentIndex * (itemWidth + gapWidth));
    tournametMembersList.style.transform = `translateX(${offset}px)`;
  }

  function moveNext() {
    currentIndex++;
    if (currentIndex >= tournametMembersLength) {
      setTimeout(() => {
        tournametMembersList.style.transition = 'none';
        currentIndex = 0;
        movetournametMembersList();
        setTimeout(() => {
          tournametMembersList.style.transition = 'transform 0.5s';
        }, 50);
      }, 500);
    }
    updateUI();
  }

  function movePrev() {
    currentIndex--;
    if (currentIndex < 0) {
      setTimeout(() => {
        tournametMembersList.style.transition = 'none';
        currentIndex = tournametMembersLength - 1;
        movetournametMembersList();
        setTimeout(() => {
          tournametMembersList.style.transition = 'transform 0.5s';
        }, 50);
      }, 500);
    }
    updateUI();
  }

  function updateIndicator() {
    currenttournametMembers.textContent = `${(currentIndex % tournametMembersLength) + 1}`;
  }

  function restartAutoSlide() {
    clearTimeout(autoSlideTimeout);
    autoSlide();
  }

  nextButton.addEventListener('click', () => {
    moveNext();
    restartAutoSlide();
  });

  prevButton.addEventListener('click', () => {
    movePrev();
    restartAutoSlide();
  });

  window.addEventListener('resize', debounce(() => {
    updateItemWidth();
    updateUI();
    restartAutoSlide();
  }, 150));

  // Клонируем элементы для создания иллюзии бесконечной карусели
  const clones = Array.from(tournametMembers).map(item => item.cloneNode(true));
  clones.forEach(clone => tournametMembersList.appendChild(clone));

  updateItemWidth();
  updateUI();
  autoSlide();
}

document.addEventListener('DOMContentLoaded', function () {
  createtournametMembers__carosel('.tournametMembers__carosel');
});

function debounce(callee, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callee.apply(this, args), timeout);
  };
}