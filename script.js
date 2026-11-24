const pages = [...document.querySelectorAll('.page')];
const count = document.getElementById('pageCount');
const progress = document.querySelector('.progress span');
const invitation = document.querySelector('.invitation');
let current = 0;
let busy = false;
let transitionTimer;

function showPage(next) {
  if (busy || next < 0 || next >= pages.length || next === current) return;
  busy = true;
  window.clearTimeout(transitionTimer);

  const previousIndex = current;
  const oldPage = pages[previousIndex];
  const nextPage = pages[next];
  const direction = next > previousIndex ? 'up' : 'down';

  // Place the incoming page off-screen first, then animate it into view.
  nextPage.classList.remove('active', 'exit-up', 'exit-down', 'enter-from-top');
  if (direction === 'down') nextPage.classList.add('enter-from-top');
  void nextPage.offsetHeight;

  oldPage.classList.remove('active', 'exit-up', 'exit-down');
  oldPage.classList.add(direction === 'up' ? 'exit-up' : 'exit-down');
  nextPage.classList.remove('enter-from-top');
  nextPage.classList.add('active');

  current = next;
  count.textContent = `${current + 1} / ${pages.length}`;
  progress.style.width = `${((current + 1) / pages.length) * 100}%`;

  const finish = () => {
    pages.forEach((page, index) => {
      if (index !== current) page.classList.remove('exit-up', 'exit-down');
    });
    busy = false;
  };
  nextPage.addEventListener('transitionend', function onEnd(event) {
    if (event.propertyName !== 'transform') return;
    nextPage.removeEventListener('transitionend', onEnd);
    window.clearTimeout(transitionTimer);
    finish();
  });
  transitionTimer = window.setTimeout(finish, 1100);
}

document.querySelectorAll('.next-page').forEach(button => button.addEventListener('click', () => showPage(current + 1)));
document.querySelector('.open-invite').addEventListener('click', () => showPage(1));
document.getElementById('next').addEventListener('click', () => showPage(Math.min(current + 1, pages.length - 1)));
document.getElementById('prev').addEventListener('click', () => showPage(Math.max(current - 1, 0)));
document.getElementById('restart').addEventListener('click', () => showPage(0));

const heart = document.getElementById('scratchHeart');
heart.addEventListener('click', () => {
  heart.classList.add('revealed');
  document.getElementById('revealedMessage').classList.add('show');
  heart.querySelector('.scratch-text').textContent = 'REVEALED WITH LOVE';
});

document.getElementById('saveDate').addEventListener('click', () => {
  const start = '20261115T190000', end = '20261115T230000';
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'BEGIN:VEVENT', `DTSTART:${start}`, `DTEND:${end}`, 'SUMMARY:Rida  & Usman  — Wedding Celebration', 'LOCATION:Victoria Marquee, Faisalabad, Pakistan', 'DESCRIPTION:Join us to celebrate Rida  & Usman .', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'Rida -Usman -wedding.ics'; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.getElementById('openMap').addEventListener('click', () => {
  window.open('https://www.google.com/maps/search/?api=1&query=The+Garden+Estate+Faisalabad', '_blank', 'noopener');
});

let touchStartX = 0, touchStartY = 0;
invitation.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });
invitation.addEventListener('touchend', event => {
  const dx = event.changedTouches[0].screenX - touchStartX;
  const dy = event.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dy) > 55 && Math.abs(dy) > Math.abs(dx)) {
    showPage(dy < 0 ? Math.min(current + 1, pages.length - 1) : Math.max(current - 1, 0));
  }
}, { passive: true });
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'PageDown') showPage(Math.min(current + 1, pages.length - 1));
  if (event.key === 'ArrowUp' || event.key === 'PageUp') showPage(Math.max(current - 1, 0));
});
