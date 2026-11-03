// szhin showcase: hiện dần khi cuộn, slideshow/chữ chạy chỉ chạy khi nhìn thấy, sao chép email.
// Không có JS trang vẫn đọc được đầy đủ (class .js do <head> gắn; CSS chỉ ẩn .reveal khi có .js).
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const reveal = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('is-in');
    reveal.unobserve(entry.target);
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

if (!reduceMotion) {
  const play = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.toggleAttribute('data-playing', entry.isIntersecting);
  }, { threshold: 0.2 });
  document.querySelectorAll('[data-play]').forEach((el) => play.observe(el));
}

const nav = document.querySelector('[data-nav]');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const toast = document.querySelector('[data-toast]');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2200);
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      showToast('Đã sao chép email ✓');
    } catch {
      showToast('Chưa sao chép được — bạn chép tay giúp mình nhé');
    }
  });
});

// Video giới thiệu: chỉ tải/phát khi nhìn thấy, tạm dừng khi cuộn đi; giảm chuyển động → không tự phát, hiện nút điều khiển.
document.querySelectorAll('[data-video]').forEach((video) => {
  if (reduceMotion) {
    video.controls = true;
    video.preload = 'metadata';
    return;
  }
  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }
  }, { threshold: 0.35 }).observe(video);
});
