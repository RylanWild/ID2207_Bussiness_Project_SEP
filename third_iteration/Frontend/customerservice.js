document.addEventListener('DOMContentLoaded', function() {
    function updateUserInfo(email) {
        const avatar = document.querySelector('.avatar');
        const welcomeText = document.querySelector('.welcome-text');

        if (email === 'sarah@sep.se') {
            avatar.style.backgroundImage = "url('imgs/portrait/sarah.png')"; // 更新头像图片路径
            welcomeText.textContent = 'Welcome, Sarah'; // 更新欢迎文字
        }
    }

    // 示例：假设在登录成功后调用此函数
    function onLoginSuccess(email) {
        updateUserInfo(email);
    }

    // 假设这是登录表单提交后的处理逻辑
    document.querySelector('#login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.querySelector('#email-input').value;
        onLoginSuccess(email);
    });
}); 