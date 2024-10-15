document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const images = slider.querySelectorAll('img');
    let currentIndex = 0;

    function nextSlide() {
        images[currentIndex].style.opacity = 0;
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].style.opacity = 1;
    }

    function startSlideShow() {
        setInterval(nextSlide, 5000); // 每5秒切换一次图片
    }

    // 初始化样式
    images.forEach((img, index) => {
        img.style.opacity = index === 0 ? 1 : 0;
        img.style.transition = 'opacity 1.5s ease-in-out';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
    });

    startSlideShow();

    // 添加登录按钮点击事件
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
});
