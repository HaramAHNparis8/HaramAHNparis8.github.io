document.addEventListener('DOMContentLoaded', function() {
    // 이미지 인덱스 변수 선언
    let currentImageIndex = 0;
    
    // Intersection Observer를 이용한 애니메이션 효과 적용
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    });

    // '.animate-me' 클래스를 가진 모든 요소에 대해 Observer 적용
    document.querySelectorAll('.animate-me').forEach((el) => {
        observer.observe(el);
    });

    // 이미지 슬라이드 쇼 로직
    const images = document.querySelectorAll('.animatedImage');
    const numberOfImages = images.length;
    const displayTime = 5000; // 이미지 변경 간격 설정 (5초)

    function changeImage() {
        // 현재 이미지 숨기기
        images[currentImageIndex].style.display = 'none';
        // 다음 이미지 인덱스 계산 (순환 로직)
        currentImageIndex = (currentImageIndex + 1) % numberOfImages;
        // 다음 이미지 표시
        images[currentImageIndex].style.display = 'block';

        // 설정한 시간 후 다음 이미지로 변경
        setTimeout(changeImage, displayTime);
    }

    // 첫 번째 이미지를 제외하고 모든 이미지를 숨깁니다.
    images.forEach((img, index) => {
        if (index !== 0) img.style.display = 'none';
    });

    // 페이지 로드 후 설정한 시간 뒤에 이미지 변경 시작
    setTimeout(changeImage, displayTime);
});