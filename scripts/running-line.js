document.addEventListener('DOMContentLoaded', function() {
  function setupRunningLine(runningLine) {
    const content = runningLine.querySelector('.runningLine__content');
    if (!content) return; // Проверка наличия контента

    const containerWidth = runningLine.offsetWidth;
    const contentWidth = content.offsetWidth;

    // вычисляем кол-во клонов
    const clonesCount = Math.ceil(containerWidth / contentWidth) + 1;

    // создаем фрагмент для оптимизации вставки
    const fragment = document.createDocumentFragment();

    // создаем необходимое количество клонов
    for (let i = 0; i < clonesCount; i++) {
      fragment.appendChild(content.cloneNode(true));
    }

    // замена содержимого одним обновлением DOM
    runningLine.innerHTML = '';
    runningLine.appendChild(fragment);

    // настройка длительности анимации
    const totalWidth = contentWidth * clonesCount;
    const duration = totalWidth / 45;
    runningLine.style.animationDuration = `${duration}s`;
  }

  // находим все бегущие строки
  const runningLines = document.querySelectorAll('.runningLine');

  // настраиваем каждую бегущую строку
  runningLines.forEach(setupRunningLine);

  // обработчик изменения размера окна
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