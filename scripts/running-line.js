document.addEventListener('DOMContentLoaded', function() {
  function setupRunningLine(runningLine) {
    const content = runningLine.querySelector('.runningLine__content');
    const containerWidth = runningLine.offsetWidth;
    const contentWidth = content.offsetWidth;

    const originalContent = content.innerHTML;
    content.innerHTML = '';

    // добавляем клоны пока содержимое не станет как минимум в два раза шире контейнера
    while (content.offsetWidth < containerWidth * 2) {
      content.innerHTML += originalContent;
    }

    // еще один клон для обеспечения плавного перехода
    content.innerHTML += originalContent;

    // длительность анимации на основе ширины содержимого
    const duration = content.offsetWidth / 45;
    content.style.animationDuration = `${duration}s`;
  }

  // настройка для оригинальной бегущей строки
  const originalRunningLine = document.querySelector('.runningLine');
  setupRunningLine(originalRunningLine);

  // клонирование и настройка для новой бегущей строки
  const clonedRunningLine = originalRunningLine.cloneNode(true);
  const runningLineContainer = document.querySelector('.runningLine:last-of-type');
  runningLineContainer.innerHTML = '';
  runningLineContainer.appendChild(clonedRunningLine);
  setupRunningLine(runningLineContainer);

  // перезапуск настройки при изменении размера окна
  window.addEventListener('resize', function() {
    setupRunningLine(originalRunningLine);
    setupRunningLine(runningLineContainer);
  });
});