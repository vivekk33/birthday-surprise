let currentSlide = 1;
function nextSlide() {
  document.getElementById(`slide${currentSlide}`).classList.remove('active');
  currentSlide++;
  document.getElementById(`slide${currentSlide}`).classList.add('active');

  if (currentSlide === 5) {
    launchConfetti();
  }
}

function createEmojiGame(containerId, emojis, unlockSlideId) {
  const grid = document.getElementById(containerId);
  const gameSlide = grid.parentElement;
  const nextSlide = document.getElementById(unlockSlideId);
  const pairs = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let first = null, lock = false;

  pairs.forEach((emoji) => {
    const box = document.createElement('div');
    box.className = 'box';
    box.dataset.emoji = emoji;
    box.textContent = '';
    box.addEventListener('click', () => {
      if (lock || box.classList.contains('matched')) return;
      box.textContent = emoji;
      if (!first) {
        first = box;
      } else {
        lock = true;
        if (first.dataset.emoji === box.dataset.emoji && first !== box) {
          first.classList.add('matched');
          box.classList.add('matched');
          first = null;
          lock = false;
          if (grid.querySelectorAll('.matched').length === pairs.length) {
            setTimeout(() => {
              gameSlide.classList.remove('active');
              nextSlide.classList.add('active');
              currentSlide++;
              if (currentSlide === 5) launchConfetti();
            }, 1000);
          }
        } else {
          setTimeout(() => {
            first.textContent = '';
            box.textContent = '';
            first = null;
            lock = false;
          }, 600);
        }
      }
    });
    grid.appendChild(box);
  });
}

const emojiSet1 = ['💖','🌸','😍','💘','💞','🥰','😘','💕'];
const emojiSet2 = ['🎂','🎁','🎉','💝','🎊','🎈','🍰','💐'];

createEmojiGame('emojiGame1', emojiSet1, 'slide3');
createEmojiGame('emojiGame2', emojiSet2, 'slide5');

// Confetti Celebration
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 50 + 10,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      tilt: Math.random() * 10 - 10
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x + p.tilt, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    update();
    requestAnimationFrame(draw);
  }

  function update() {
    pieces.forEach((p, i) => {
      p.y += Math.cos(p.d) + 1 + p.r / 2;
      p.x += Math.sin(p.d);
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
  }

  draw();
}
