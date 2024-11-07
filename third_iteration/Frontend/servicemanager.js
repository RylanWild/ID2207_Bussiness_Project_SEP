document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-header');
    const eventFormDisplay = document.getElementById('eventFormDisplay');
    const newBtn = document.querySelector('.new-btn');
    const dropdownContent = document.querySelector('.top-bar .dropdown-content');

    // 模拟收到的各种请求
    const inboxItems = [
        { id: 'EF001', type: 'Event Form', title: 'Wedding', status: 'Pending' },
        { id: 'EF002', type: 'Event Form', title: 'Corporate Meeting', status: 'Pending' },
        { id: 'FR001', type: 'Financial Request', title: 'Budget Increase', status: 'Pending' },
        { id: 'RR001', type: 'Recruitment Request', title: 'New Photographer Position', status: 'Pending' }
    ];

    const sentItems = [
        { id: 'EF003', type: 'Event Form', title: 'Birthday Party', status: 'Approved' },
        { id: 'FR002', type: 'Financial Request', title: 'Camera Equipment Purchase', status: 'Approved' }
    ];

    // 处理新建表单的点击事件
    document.getElementById('clientRequestForm').addEventListener('click', function(e) {
        e.preventDefault();
        displayClientRequestForm();
    });

    document.getElementById('recruitmentRequestForm').addEventListener('click', function(e) {
        e.preventDefault();
        displayRecruitmentRequestForm();
    });

    document.getElementById('financialRequestForm').addEventListener('click', function(e) {
        e.preventDefault();
        displayFinancialRequestForm();
    });

    // 显示客户请求表单
    function displayClientRequestForm() {
        // 这里添加显示客户请求表单的逻辑
        console.log("Displaying Client Request Form");
        // 可以调用之前的 displayNewForm() 函数或创建新的函数
        displayNewForm();
    }
    
    function displayNewForm() {
        eventFormDisplay.innerHTML = `
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px;">
                <h3 style="color: #0078d4;">New Client Request Form - Production Department</h3>
                <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div class="form-group">
                        <label>EventID:</label>
                        <input type="text" id="eventId">
                        <button class="FindEventBtn" style="background-color: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Find Event</button>
                    </div>
                    <div class="form-group">
                        <label>Client Name:</label>
                        <input type="text" id="clientName">
                    </div>
                    <div class="form-group">
                        <label>Event Type:</label>
                        <input type="text" id="eventType">
                    </div>
                    <div class="form-group">
                        <label>From Date:</label>
                        <input type="date" id="fromDate">
                    </div>
                    <div class="form-group">
                        <label>To Date:</label>
                        <input type="date" id="toDate">
                    </div>
                    <div class="form-group">
                        <label>Expected Number of Attendees:</label>
                        <input type="number" id="expectedAttendees">
                    </div>
                    <div class="form-group">
                        <label>Expected Budget:</label>
                        <input type="number" id="expectedBudget">
                    </div>
                    <div class="form-group">
                        <label>Financial Feedback:</label>
                        <textarea id="financialFeedback" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Photography:</label>
                        <textarea id="photography" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Budget:</label>
                        <input type="number" id="budget">
                    </div>
                    <button class="submit-btn" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Send</button>
                </div>
            </div>
        `;

        // 添加Find Event按钮的事件监听器
        const findEventBtn = eventFormDisplay.querySelector('.FindEventBtn');
        findEventBtn.addEventListener('click', handleFindEvent);

        // 添加Send按钮的事件监听器
        const submitBtn = eventFormDisplay.querySelector('.submit-btn');
        submitBtn.addEventListener('click', handleClientRequestSubmit);
    }

    // 处理Find Event按钮点击
    function handleFindEvent() {
        const eventId = document.getElementById('eventId').value;
        // 这里添加查找事件的逻辑
        console.log('Finding event:', eventId);
    }

    // 处理表单提交
    function handleClientRequestSubmit() {
        // 获取表单数据
        const formData = {
            event_id: document.getElementById('eventId').value,
            client_name: document.getElementById('clientName').value,
            event_type: document.getElementById('eventType').value,
            from_date: document.getElementById('fromDate').value,
            to_date: document.getElementById('toDate').value,
            expected_attendees: document.getElementById('expectedAttendees').value,
            expected_budget: document.getElementById('expectedBudget').value,
            financial_feedback: document.getElementById('financialFeedback').value,
            photography: document.getElementById('photography').value,
            budget: document.getElementById('budget').value
        };

        console.log('Form submitted:', formData);
        // 这里可以添加向后端发送数据的代码
        alert('Form submitted successfully!');
    }

    // 显示招聘请求表单
    function displayRecruitmentRequestForm() {
        eventFormDisplay.innerHTML = `
            <h3>Recruitment Request Form</h3>
            <div class="form-group">
                <label>Position:</label>
                <select id="position">
                    <option value="">Select Position</option>
                    <option value="photographer">Photographer</option>
                    <option value="videographer">Videographer</option>
                    <option value="editor">Photo/Video Editor</option>
                </select>
            </div>
            <div class="form-group">
                <label>Required Experience (Years):</label>
                <input type="number" id="experience">
            </div>
            <div class="form-group">
                <label>Job Description:</label>
                <textarea id="jobDescription"></textarea>
            </div>
            <button class="submit-btn">Submit Request</button>
        `;
    }

    // 显示财务请求表单
    function displayFinancialRequestForm() {
        eventFormDisplay.innerHTML = `
            <h3>Financial Request Form</h3>
            <div class="form-group">
                <label>Request Type:</label>
                <select id="requestType">
                    <option value="">Select Request Type</option>
                    <option value="equipment">Equipment Purchase</option>
                    <option value="maintenance">Equipment Maintenance</option>
                    <option value="training">Staff Training</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount Required:</label>
                <input type="number" id="amount">
            </div>
            <div class="form-group">
                <label>Reason:</label>
                <textarea id="reason"></textarea>
            </div>
            <button class="submit-btn">Submit Request</button>
        `;
    }

    // 显示收件箱和已发送项目
    function displayInboxItems() {
        const inboxContent = document.querySelector('.sidebar .dropdown-content');
        inboxContent.innerHTML = inboxItems.map(item => `
            <div class="event-item" data-record="${item.id}">
                <div class="record-number">${item.type} #${item.id}</div>
                <div class="event-type">${item.title}</div>
            </div>
        `).join('');

        const sentContent = document.querySelectorAll('.sidebar .dropdown-content')[1];
        sentContent.innerHTML = sentItems.map(item => `
            <div class="event-item" data-record="${item.id}">
                <div class="record-number">${item.type} #${item.id}</div>
                <div class="event-type">${item.title}</div>
            </div>
        `).join('');

        // 为每个项目添加点击事件
        document.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', () => displayItemDetails(item.dataset.record));
        });
    }

    // 显示项目详情
    function displayItemDetails(itemId) {
        const item = [...inboxItems, ...sentItems].find(item => item.id === itemId);
        if (item) {
            eventFormDisplay.innerHTML = `
                <h3>${item.type} Details</h3>
                <p><strong>ID:</strong> ${item.id}</p>
                <p><strong>Type:</strong> ${item.type}</p>
                <p><strong>Title:</strong> ${item.title}</p>
                <p><strong>Status:</strong> ${item.status}</p>
                ${item.status === 'Pending' ? `
                    <div class="form-actions">
                        <button class="approve-btn">Approve</button>
                        <button class="reject-btn">Reject</button>
                    </div>
                ` : ''}
            `;
        }
    }

    // 处理下拉菜单的显示/隐藏
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

    // 初始化显示收件箱内容
    displayInboxItems();
});
