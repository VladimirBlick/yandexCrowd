document.addEventListener('DOMContentLoaded', function() {
  function setupRunningLine(runningLine) {
    const content = runningLine.querySelector('.runningLine__content');
    if (!content) return; // Проверка наличия контента

    const containerWidth = runningLine.offsetWidth;
    const contentWidth = content.offsetWidth;

    // Вычисляем количество необходимых клонов
    const clonesCount = Math.ceil(containerWidth / contentWidth) + 1;

    // Создаем фрагмент для оптимизации вставки
    const fragment = document.createDocumentFragment();

    // Создаем необходимое количество клонов
    for (let i = 0; i < clonesCount; i++) {
      fragment.appendChild(content.cloneNode(true));
    }

    // Заменяем содержимое одним обновлением DOM
    runningLine.innerHTML = '';
    runningLine.appendChild(fragment);

    // Устанавливаем длительность анимации
    const totalWidth = contentWidth * clonesCount;
    const duration = totalWidth / 45;
    runningLine.style.animationDuration = `${duration}s`;
  }

  // Находим все бегущие строки
  const runningLines = document.querySelectorAll('.runningLine');

  // Настраиваем каждую бегущую строку
  runningLines.forEach(setupRunningLine);

  // Обработчик изменения размера окна
  const debounce = (func, delay) => {
    let timeoutId;
    return function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, arguments), delay);
    };
  };

  const handleResize = debounce(() => {
    runningLines.forEach(setupRunningLine);
  }, 250);

  window.addEventListener('resize', handleResize);
});