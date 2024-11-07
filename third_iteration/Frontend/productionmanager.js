document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-header');
    const eventItems = document.querySelectorAll('.event-item');
    const eventFormDisplay = document.getElementById('eventFormDisplay');
    const newBtn = document.querySelector('.new-btn');
    const dropdownContent = document.querySelector('.top-bar .dropdown-content');
    const clientRequestFormBtn = document.getElementById('clientRequestForm');
    const recruitmentRequestFormBtn = document.getElementById('recruitmentRequestForm');
    const financialRequestFormBtn = document.getElementById('financialRequestForm');

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

    eventItems.forEach(item => {
        item.addEventListener('click', function() {
            const recordNumber = this.getAttribute('data-record');
            displayEventForm(recordNumber);
        });
    });

    // 处理 "+ New" 按钮的点击事件
    if (newBtn) {
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
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

    // 处理 "Client Request Form" 的点击事件
    clientRequestFormBtn.addEventListener('click', function() {
        displayClientRequestForm();
        dropdownContent.style.display = 'none';
    });

    // 处理 "Recruitment Request Form" 的点击事件
    recruitmentRequestFormBtn.addEventListener('click', function() {
        displayRecruitmentRequestForm();
        dropdownContent.style.display = 'none';
    });

    // 处理 "Financial Request Form" 的点击事件
    financialRequestFormBtn.addEventListener('click', function() {
        displayFinancialRequestForm();
        dropdownContent.style.display = 'none';
    });

    function displayEventForm(recordNumber) {
        const eventForms = {
            '001': {
                clientName: 'John & Sarah Smith',
                eventType: 'Wedding',
                fromDate: '2023-08-15',
                toDate: '2023-08-16',
                expectedNumAttendees: 150,
                expectedBudget: 25000,
                preferences: ['Decoration', 'Photos/Videos', 'Meals', 'Drinks'],
                status: 'Inbox',
                detailedPlan: 'We will need to set up a professional photography studio on-site. This will require additional lighting equipment and backdrops.',
                needMoreMoney: true,
                additionalAmount: 2000,
                reason: 'The client has requested a more elaborate photo setup than initially planned.'
            },
            '002': {
                clientName: 'Tech Innovations Inc.',
                eventType: 'Corporate Meeting',
                fromDate: '2023-09-10',
                toDate: '2023-09-11',
                expectedNumAttendees: 75,
                expectedBudget: 15000,
                preferences: ['Meals', 'Drinks'],
                status: 'Inbox',
                detailedPlan: 'Standard corporate event photography setup will be sufficient. We will focus on capturing key moments and group photos.',
                needMoreMoney: false
            },
            '003': {
                clientName: 'Emily Johnson',
                eventType: 'Birthday Party',
                fromDate: '2023-07-20',
                toDate: '2023-07-20',
                expectedNumAttendees: 50,
                expectedBudget: 5000,
                preferences: ['Decoration', 'Meals', 'Drinks'],
                status: 'Sent'
            }
        };

        const form = eventForms[recordNumber];
        if (form) {
            let formHtml = `
                <h3>Event Form - Record #${recordNumber}</h3>
                <p><strong>Client Name:</strong> ${form.clientName}</p>
                <p><strong>Event Type:</strong> ${form.eventType}</p>
                <p><strong>From Date:</strong> ${form.fromDate}</p>
                <p><strong>To Date:</strong> ${form.toDate}</p>
                <p><strong>Expected Number of Attendees:</strong> ${form.expectedNumAttendees}</p>
                <p><strong>Expected Budget:</strong> $${form.expectedBudget}</p>
                <p><strong>Preferences:</strong> ${form.preferences.join(', ')}</p>
            `;

            if (form.status === 'Inbox' && form.detailedPlan) {
                formHtml += `
                    <div class="detailed-plan">
                        <h4>Detailed Plan from Photography Team:</h4>
                        <p>${form.detailedPlan}</p>
                        <p><strong>Needs More Money:</strong> ${form.needMoreMoney ? 'Yes' : 'No'}</p>
                    `;
                
                if (form.needMoreMoney) {
                    formHtml += `
                        <p><strong>Additional Amount Requested:</strong> $${form.additionalAmount}</p>
                        <p><strong>Reason:</strong> ${form.reason}</p>
                    `;
                }

                formHtml += `</div>`;
            }

            if (form.status === 'Inbox') {
                formHtml += `
                    <div class="form-actions">
                        <button class="approve-btn">Approve</button>
                        <button class="reject-btn">Reject</button>
                    </div>
                `;
            }

            eventFormDisplay.innerHTML = formHtml;

            // Add event listeners to the buttons
            const approveBtn = eventFormDisplay.querySelector('.approve-btn');
            const rejectBtn = eventFormDisplay.querySelector('.reject-btn');

            if (approveBtn && rejectBtn) {
                approveBtn.addEventListener('click', () => handleFormAction(recordNumber, 'approve'));
                rejectBtn.addEventListener('click', () => handleFormAction(recordNumber, 'reject'));
            }
        } else {
            eventFormDisplay.innerHTML = '<p>Event form not found.</p>';
        }
    }

    function handleFormAction(recordNumber, action) {
        console.log(`Form ${recordNumber} ${action}ed`);
        alert(`Form ${recordNumber} has been ${action}ed.`);
    }

    function displayClientRequestForm() {
        // 这里添加显示客户请求表单的逻辑
        console.log("Displaying Client Request Form");
        // 可以调用之前的 displayNewForm() 函数或创建新的函数
        displayNewForm();
    }

    function displayRecruitmentRequestForm() {
        const formHtml = `
            <h3>Recruitment Request Form</h3>
            <form id="recruitmentRequestForm" class="recruitment-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="contractType">Contract Type:</label>
                        <select id="contractType" name="contractType" required>
                            <option value="">Select Contract Type</option>
                            <option value="fullTime">Full Time</option>
                            <option value="partTime">Part Time</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="jobTitle">Job Title:</label>
                        <input type="text" id="jobTitle" name="jobTitle" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="department">Requesting Department:</label>
                        <select id="department" name="department" required>
                            <option value="">Select Department</option>
                            <option value="Administration">Administration</option>
                            <option value="Services">Services</option>
                            <option value="Production">Production</option>
                            <option value="Financial">Financial</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reportTo">Report To:</label>
                        <input type="text" id="reportTo" name="reportTo" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="yearsOfExperience">Years of Experience:</label>
                        <input type="number" id="yearsOfExperience" name="yearsOfExperience" required>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label for="jobDescription">Job Description:</label>
                    <textarea id="jobDescription" name="jobDescription" rows="4" required></textarea>
                </div>
                <div class="form-group full-width">
                    <label for="jobRequirements">Job Requirements:</label>
                    <textarea id="jobRequirements" name="jobRequirements" rows="4" required></textarea>
                </div>
                <div class="form-group full-width">
                    <button type="submit" class="submit-btn">Submit</button>
                </div>
            </form>
        `;

        const eventFormDisplay = document.getElementById('eventFormDisplay');
        eventFormDisplay.innerHTML = formHtml;

        // 添加表单提交事件监听器
        const form = document.getElementById('recruitmentRequestForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单提交的逻辑
            console.log('Recruitment Request Form submitted');
            alert('Recruitment Request Form submitted successfully!');
        });
    }

    function displayNewForm() {
        const formHtml = `
            <h3>New Client Request Form - Production Department</h3>
            <form id="newClientRequestForm">
                <div class="form-group">
                    <label for="EventID">EventID:</label>
                    <input type="text" id="EventID" name="EventID" required> 
                </div>  
                <div class="form-group">
                    <button type="FindEvent" id="FindEvent" class="FindEventBtn">Find Event</button>
                </div>         
                <div class="form-group">
                    <label for="clientName">Client Name:</label>
                    <input type="text" id="clientName" name="clientName" required>
                </div>
                <div class="form-group">
                    <label for="eventType">Event Type:</label>
                    <input type="text" id="eventType" name="eventType" required>
                </div>
                <div class="form-group">
                    <label for="fromDate">From Date:</label>
                    <input type="date" id="fromDate" name="fromDate" required>
                </div>
                <div class="form-group">
                    <label for="toDate">To Date:</label>
                    <input type="date" id="toDate" name="toDate" required>
                </div>
                <div class="form-group">
                    <label for="expectedAttendees">Expected Number of Attendees:</label>
                    <input type="number" id="expectedAttendees" name="expectedAttendees" required>
                </div>
                <div class="form-group">
                    <label for="expectedBudget">Expected Budget:</label>
                    <input type="number" id="expectedBudget" name="expectedBudget" required>
                </div>
                <div class="form-group">
                    <label for="description">Financial Feedback:</label>
                    <textarea id="description" name="description" rows="4" required></textarea>
                </div>
                <div class="department-budget-container">
                    <div class="department-budget">
                        <label for="photography">Photography:</label>
                        <textarea id="photography" name="photography" rows="3"></textarea>
                        <div class="budget-input">
                            <label>Budget:</label>
                            <input type="number">
                            <label>Person:</label>
                            <select>
                                <option value="">Select Person</option>
                                <option value="Tobias">Tobias</option>
                                <option value="Magdalena">Magdalena</option>
                            </select>
                        </div>
                    </div>
                    <div class="department-budget">
                        <label for="decoration">Decoration:</label>
                        <textarea id="decoration" name="decoration" rows="3"></textarea>
                        <div class="budget-input">
                            <label>Budget:</label>
                            <input type="number">
                            <label>Person:</label>
                            <select>
                                <option value="">Select Person</option>
                                <option value="Magy">Magy</option>
                                <option value="Angelina">Angelina</option>
                                <option value="Don">Don</option>
                                <option value="Tom">Tom</option>

                            </select>
                        </div>
                    </div>
                   
                    <div class="department-budget">
                        <label for="music">Music:</label>
                        <textarea id="music" name="music" rows="3"></textarea>
                        <div class="budget-input">
                            <label>Budget:</label>
                            <input type="number">
                            <label>Person:</label>
                            <select>
                                <option value="">Select Person</option>
                                <option value="Antony">Antony</option>
                                <option value="Adam">Adam</option>
                            </select>
                        </div>
                    </div>
                    <div class="department-budget">
                        <label for="poster">Poster:</label>
                        <textarea id="poster" name="poster" rows="3"></textarea>
                        <div class="budget-input">
                            <label>Budget:</label>
                            <input type="number">
                            <label>Person:</label>
                            <select>
                                <option value="">Select Person</option>
                                <option value="Julia">Julia</option>
                                <option value="Raymond">Raymond</option>
                            </select>
                        </div>
                    </div>
                    <div class="department-budget">
                        <label for="computerIssues">Computer Issues:</label>
                        <textarea id="computerIssues" name="computerIssues" rows="3"></textarea>
                        <div class="budget-input">
                            <label>Budget:</label>
                            <input type="number">
                            <label>Person:</label>
                            <select>
                                <option value="">Select Person</option>
                                <option value="Christian">Christian</option>
                                <option value="Nicolas">Nicolas</option>
                                <option value="Michael">Michael</option>
                                <option value="Robert">Robert</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="submit" id="submitbtn" class="submit-btn">Send</button>
            </form>
        `;

        const eventFormDisplay = document.getElementById('eventFormDisplay');
        eventFormDisplay.innerHTML = formHtml;

        // 添加表单提交事件监听器
        const form = document.getElementById('newClientRequestForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单提交的逻辑
            console.log('Form sent');
            alert('Form sent successfully!');
        });
    }

    function displayFinancialRequestForm() {
        const formHtml = `
            <h3>Financial Request Form</h3>
            <form id="financialRequestForm" class="financial-form">
                <div class="form-group">
                    <label for="requestingDepartment">Requesting Department:</label>
                    <select id="requestingDepartment" name="requestingDepartment" required>
                        <option value="">Select Department</option>
                        <option value="Administration">Administration</option>
                        <option value="Services">Services</option>
                        <option value="Production">Production</option>
                        <option value="Financial">Financial</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="projectReference">Project Reference:</label>
                    <input type="text" id="projectReference" name="projectReference" required>
                </div>
                <div class="form-group">
                    <label for="requiredAmount">Required Amount:</label>
                    <input type="number" id="requiredAmount" name="requiredAmount" required>
                </div>
                <div class="form-group">
                    <label for="reason">Reason:</label>
                    <textarea id="reason" name="reason" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <button type="submit" class="submit-btn">Submit Request</button>
                </div>
            </form>
        `;

        eventFormDisplay.innerHTML = formHtml;

        // 添加表单提交事件监听器
        const form = document.getElementById('financialRequestForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单提交的逻辑
            console.log('Financial Request Form submitted');
            alert('Financial Request Form submitted successfully!');
        });
    }

    // 获取日历图标和模态框元素
    const calendarIcon = document.querySelector('.calendar-icon');
    const modal = document.getElementById('calendar-modal');
    const closeBtn = document.querySelector('.close');

    // 初始化日历
    let calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            // 这里可以添加事件数据
            {
                title: 'Meeting',
                start: '2024-01-15',
                end: '2024-01-17'
            }
            // 更多事件...
        ]
    });

    // 点击日历图标显示模态框
    calendarIcon.addEventListener('click', function() {
        modal.style.display = "block";
        calendar.render(); // 重新渲染日历以确保正确显示
    });

    // 点击关闭按钮关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});