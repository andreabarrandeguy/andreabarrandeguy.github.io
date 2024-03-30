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

// Open CV
function openCV() {
    var pdfUrl = './img/AndreaBarrandeguyCV.pdf';
    window.open(pdfUrl, '_blank');
}

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
    .then(function(response) {
        console.log("Email sent successfully:", response);
        alert("The email has been sent successfully!");
        }, function(error) {
        console.log("Error sending email:", error);
        alert("There was an error sending the email. Please try again later.");
        
    });
  }

  
// Dark mode
let darkModeOn = true;

function toggleDarkMode() {
    darkModeOn = !darkModeOn;

    if (darkModeOn) {
        body.classList.add('dark-mode');
        mode.style.backgroundImage = 'url("./img/foco.png")';
        mode.title = "Light mode";
    } else {
        body.classList.remove('dark-mode');
        mode.style.backgroundImage = 'url("./img/luna.png")';
        mode.title = "Dark mode";
    }
}

mode.addEventListener('click', toggleDarkMode);
toggleDarkMode();