document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为
        
        const email = document.getElementById('email').value;
        
        if (email === 'customerservice@sep.com') {
            window.location.href = 'customerservice.html';
        } else if (email === 'janet@sep.com') {
            window.location.href = 'scs.html';
        } else if (email === 'alice@sep.com') {
            window.location.href = 'financialmanager.html';
        } else if (email === 'mike@sep.com') {
            window.location.href = 'administrationmanager.html';
        } else {
            alert('Login functionality not implemented for this email.');
        }
    });
});
