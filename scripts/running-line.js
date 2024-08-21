//копиписта бегущей строки
const originalRunningLine = document.querySelector('.runningLine .runningLine__content');
const clonedRunningLine = originalRunningLine.cloneNode(true);
const runningLineContainer = document.querySelector('.runningLine:last-of-type');
runningLineContainer.innerHTML = '';
runningLineContainer.appendChild(clonedRunningLine);