document.addEventListener('DOMContentLoaded', function() {
    initObserver();
    initImageSlideshow();
    initExtraAnimation();
});

function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.closest('.presentation')) {
                    // .presentation에 가까운 요소에 대한 처리
                    entry.target.classList.remove('animate');
                    setTimeout(() => {
                        entry.target.classList.add('fadeInAnimate');
                    }, 50);
                } else if (entry.target.querySelector('.nav')) { // .nav를 포함하는 요소를 찾는 조건으로 변경
                    // .nav를 포함하는 요소에 대한 처리
                    entry.target.classList.remove('animate');
                    setTimeout(() => {
                        entry.target.classList.add('fadeInAnimate');
                    }, 50);
                } else {
                    // 나머지 경우에 대한 처리
                    entry.target.classList.remove('animate');
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 50);
                }
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-me').forEach(el => {
        observer.observe(el);
    });
}

function initImageSlideshow() {
    let currentImageIndex = 0;
    const images = document.querySelectorAll('.animatedImage');
    const displayTime = 5000; // 5 seconds

    images.forEach((img, index) => {
        if (index !== 0) img.style.display = 'none';
    });

    function changeImage() {
        images[currentImageIndex].style.display = 'none';
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].style.display = 'block';
        setTimeout(changeImage, displayTime);
    }

    setTimeout(changeImage, displayTime);
}

function initExtraAnimation() {
    const element = document.querySelector('.showtabtletarea');
    if (element) {
        element.classList.add('animate');
    }
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

function initSlideshow() {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.mySlides');
    const numberOfSlides = slides.length;

    function showSlide() {
        // 모든 슬라이드를 숨김
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // 다음 슬라이드를 보여줌
        slideIndex = (slideIndex + 1) % numberOfSlides;
        slides[slideIndex].style.display = 'block';
    }

    // 6초마다 showSlide 함수를 실행
    setInterval(showSlide, 6000);
}

// DOM이 로드된 후 슬라이드쇼를 초기화
document.addEventListener('DOMContentLoaded', initSlideshow);