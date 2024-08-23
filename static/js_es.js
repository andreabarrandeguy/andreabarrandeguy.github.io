const mode = document.getElementById('mode');
const body = document.body;
const navLogo = document.getElementById('navLogo');

// Presentation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

const hiddenTitle = document.getElementById('titulo');
observer.observe(hiddenTitle);

hiddenTitle.addEventListener('transitionend', () => {
  setTimeout(() => {
    const hiddenSubtitle = document.getElementById('subtitulo');
    observer.observe(hiddenSubtitle);
  }, 50);
})

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Portfolio
const observer2 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) {
      entry.target.classList.add('show3');
    }
  });
});

const hiddenProyects = document.querySelectorAll('.hidden3');
hiddenProyects.forEach((el) => observer2.observe(el));

//Container Room
document.addEventListener('DOMContentLoaded', () => {
  const videoRoom = document.getElementById('room-video');
  const containerRoom = document.getElementById('room');

  containerRoom.addEventListener('mouseenter', () => {
    videoRoom.currentTime = 0; // Reset video to the start
    videoRoom.play(); // Start playing the video
  });

  containerRoom.addEventListener('mouseleave', () => {
    videoRoom.pause(); // Pause the video
    // No need to reset currentTime here; the video will replay from start on next hover
  });
});

//Container Chromatik
document.addEventListener('DOMContentLoaded', () => {
  const videoChromatik = document.getElementById('chromatik-video');
  const containerChromatik = document.getElementById('chromatik');

  containerChromatik.addEventListener('mouseenter', () => {
    videoChromatik.currentTime = 0;
    videoChromatik.play();
  });

  containerChromatik.addEventListener('mouseleave', () => {
    videoChromatik.pause();
  });
});

//Container Countdown
document.addEventListener('DOMContentLoaded', () => {
  const videoCountdown = document.getElementById('countdown-video');
  const containerCountdown = document.getElementById('countdown');

  containerCountdown.addEventListener('mouseenter', () => {
    videoCountdown.currentTime = 0;
    videoCountdown.play();
  });

  containerCountdown.addEventListener('mouseleave', () => {
    videoCountdown.pause();
  });
});

// Open CV
function openCV() {
  var pdfUrl = '../img/Andrea Barrandeguy_es.pdf';
  window.open(pdfUrl, '_blank');
}

// Dark mode
let darkModeOff = true;

function toggleDarkMode() {
  darkModeOff = !darkModeOff;

  if (darkModeOff) {
    body.classList.add('dark-mode');
    mode.style.backgroundImage = 'url("../img/foco.png")';
    mode.title = "Modo claro";
  } else {
    body.classList.remove('dark-mode');
    mode.style.backgroundImage = 'url("../img/luna.png")';
    mode.title = "Modo oscuro";
  }
}

mode.addEventListener('click', toggleDarkMode);
toggleDarkMode();

// Change nav color
// Change nav color
document.addEventListener('scroll', function () {
  if (darkModeOff) return;

  const navbar = document.getElementById('navbar');
  const links = navbar.querySelectorAll('a');
  const roomImage = document.getElementById('room-image');
  const chromatikImage = document.getElementById('chromatik-image');
  const countdownImage = document.getElementById('countdown-image');

  const roomImageRect = roomImage.getBoundingClientRect();
  const chromatikImageRect = chromatikImage.getBoundingClientRect();
  const countdownImageRect = countdownImage.getBoundingClientRect();

  const navbarRect = navbar.getBoundingClientRect();
  const modeButton = document.getElementById('mode');

  // Calculate if any part of the navbar overlaps with the black image
  const overlapRoom = !(roomImageRect.right < navbarRect.left ||
    roomImageRect.left > navbarRect.right ||
    roomImageRect.bottom < navbarRect.top ||
    roomImageRect.top > navbarRect.bottom);

  const overlapChromatik = !(chromatikImageRect.right < navbarRect.left ||
    chromatikImageRect.left > navbarRect.right ||
    chromatikImageRect.bottom < navbarRect.top ||
    chromatikImageRect.top > navbarRect.bottom);

  const overlapCountdown = !(countdownImageRect.right < navbarRect.left ||
    countdownImageRect.left > navbarRect.right ||
    countdownImageRect.bottom < navbarRect.top ||
    countdownImageRect.top > navbarRect.bottom);



  if (overlapRoom || overlapChromatik || overlapCountdown) {
    links.forEach(link => {
      link.style.color = 'white';
    });
    modeButton.classList.add('foco');
  } else {
    links.forEach(link => {
      link.style.color = 'black';
    });
    modeButton.classList.remove('foco');
  }
});

// Send form to email
function sendEmail() {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var message = document.getElementById('message').value;

  emailjs.send("service_enoxr6l", "template_jtk852d", {
    from_name: name,
    from_email: email,
    message: message
  })
    .then(function (response) {
      console.log("Correo electrónico enviado con éxito:", response);
      alert("¡El correo electrónico ha sido enviado con éxito!");

      // Vaciar los campos del formulario después de enviar el mensaje
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';

    }, function (error) {
      console.log("Error al enviar el correo electrónico:", error);
      alert("Hubo un error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.");
    });
}