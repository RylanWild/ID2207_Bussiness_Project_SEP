document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-header');
    const newBtn = document.querySelector('.new-btn');
    const dropdownContent = document.querySelector('.top-bar .dropdown-content');
    const jobAdvertisementBtn = document.getElementById('jobAdvertisement');
    const requestFormDisplay = document.getElementById('requestFormDisplay');
    const inboxContent = document.querySelector('.sidebar .dropdown-content');

    // 模拟收到的 Recruitment Request Forms
    let recruitmentRequests = [
        { id: 'RRF001', title: 'Photographer Position', department: 'Production', status: 'Pending' },
        { id: 'RRF002', title: 'Waiter Position', department: 'Service', status: 'Pending' },
        { id: 'RRF003', title: 'Event Coordinator', department: 'Production', status: 'Pending' }
    ];

    // 显示 Inbox 中的 Recruitment Request Forms
    function displayInboxItems() {
        inboxContent.innerHTML = recruitmentRequests
            .filter(request => request.status === 'Pending')
            .map(request => `
                <div class="request-item" data-id="${request.id}">
                    <div class="request-title">${request.title}</div>
                    <div class="request-department">${request.department} Department</div>
                </div>
            `).join('');

        // 为每个请求项添加点击事件
        document.querySelectorAll('.request-item').forEach(item => {
            item.addEventListener('click', () => displayRecruitmentRequest(item.dataset.id));
        });
    }

    function displayRecruitmentRequest(requestId) {
        const request = recruitmentRequests.find(r => r.id === requestId);
        if (request) {
            const requestHtml = `
                <h3>Recruitment Request - ${request.title}</h3>
                <p><strong>Department:</strong> ${request.department}</p>
                <p><strong>Request ID:</strong> ${request.id}</p>
                <p><strong>Status:</strong> ${request.status}</p>
                <!-- 这里可以添加更多详细信息 -->
                <div class="form-actions">
                    <button class="approve-btn" onclick="handleRequestAction('${requestId}', 'approve')">Approve</button>
                    <button class="reject-btn" onclick="handleRequestAction('${requestId}', 'reject')">Reject</button>
                </div>
            `;
            requestFormDisplay.innerHTML = requestHtml;
        }
    }

    window.handleRequestAction = function(requestId, action) {
        const request = recruitmentRequests.find(r => r.id === requestId);
        if (request) {
            if (action === 'approve') {
                request.status = 'Approved';
                sendToManagerInbox(request);
            } else if (action === 'reject') {
                request.status = 'Rejected';
            }
            console.log(`Request ${requestId} ${action}d`);
            alert(`Recruitment request ${requestId} has been ${action}d.`);
            displayInboxItems(); // 刷新 Inbox 显示
            displayRecruitmentRequest(requestId); // 刷新当前请求的显示
        }
    }

    function sendToManagerInbox(request) {
        // 这里我们只是模拟发送到经理的收件箱
        // 在实际应用中，这里应该是一个 API 调用或者其他方式来通知相应的经理
        console.log(`Approved request ${request.id} sent to ${request.department} Manager's inbox`);
    }

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            this.classList.toggle('active');
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
                this.querySelector('i').classList.remove('fa-caret-up');
                this.querySelector('i').classList.add('fa-caret-down');
            } else {
                dropdownContent.style.display = "block";
                this.querySelector('i').classList.remove('fa-caret-down');
                this.querySelector('i').classList.add('fa-caret-up');
            }
        });
    });

    // 处理 "+ New" 按钮的点击事件
    if (newBtn) {
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
    }

    // 点击页面其他地方时隐藏下拉菜单
    document.addEventListener('click', function() {
        dropdownContent.style.display = 'none';
    });

    // 阻止下拉菜单内的点击事件冒泡到document
    dropdownContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 处理 "Job Advertisement" 的点击事件
    jobAdvertisementBtn.addEventListener('click', function() {
        displayJobAdvertisementForm();
        dropdownContent.style.display = 'none';
    });

    function displayJobAdvertisementForm() {
        const formHtml = `
            <h3>Job Advertisement Form</h3>
            <form id="jobAdvertisementForm">
                <div class="form-group">
                    <label for="jobTitle">Job Title:</label>
                    <input type="text" id="jobTitle" name="jobTitle" required>
                </div>
                <div class="form-group">
                    <label for="jobDescription">Job Description:</label>
                    <textarea id="jobDescription" name="jobDescription" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label for="requirements">Requirements:</label>
                    <textarea id="requirements" name="requirements" rows="4" required></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit Advertisement</button>
            </form>
        `;
        requestFormDisplay.innerHTML = formHtml;

        // 添加表单提交事件监听器
        const form = document.getElementById('jobAdvertisementForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Job Advertisement Form submitted');
            alert('Job Advertisement Form submitted successfully!');
        });
    }

    // 初始化显示 Inbox 内容
    displayInboxItems();
});
