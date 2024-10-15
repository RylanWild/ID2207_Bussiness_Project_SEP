document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为
        
        const email = document.getElementById('email').value;
        
        switch(email) {
            case 'sarah@sep.se':
            case 'sam@sep.se':
            case 'judy@sep.se':
            case 'carine@sep.se':
                window.location.href = 'customerservice.html';
                break;
            case 'janet@sep.se':
                window.location.href = 'scs.html';
                break;
            case 'alice@sep.se':
                window.location.href = 'financialmanager.html';
                break;
            case 'mike@sep.se':
                window.location.href = 'administrationmanager.html';
                break;
            case 'jack@sep.se':
                window.location.href = 'productionmanager.html';
                break;
            case 'natalie@sep.se':
                window.location.href = 'servicemanager.html';
                break;
            case 'tobi@sep.se':
                window.location.href = 'photographysubteam.html';
                break;
            case 'lauren@sep.se':
                window.location.href = 'waitersubteam.html';
                break;
            default:
                alert('Login functionality not implemented for this email.');
        }
    });
});
