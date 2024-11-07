document.addEventListener('DOMContentLoaded', () => {
    // 获取下拉容器
    const unreviewedContainer = document.getElementById('unreviewed');
    const rejectedContainer = document.getElementById('rejected');
    const doneContainer = document.getElementById('done');

    const dropdownContent = document.querySelector('.top-bar .dropdown-content');
    const newBtn = document.querySelector('.new-btn');
    const clientRequestFormBtn = document.getElementById('newclientRequestForm');
    const recruitmentRequestFormBtn = document.getElementById('newrecruitmentRequestForm');

    // 获取计划审核事件 (stage 为 07)
    fetch('http://127.0.0.1:5000/api/events/plan_review')
        .then(response => response.json())
        .then(data => {
            const planReviewUnreviewed = data.approval_stage_07_event_ids.filter(event => event.status === "11");
            const planReviewRejected = data.approval_stage_07_event_ids.filter(event => event.status === "10");
            populateDropdown(planReviewUnreviewed, unreviewedContainer, 'Plan Review');
            populateDropdown(planReviewRejected, rejectedContainer, 'Plan Review');
        })
        .catch(error => console.error('Error fetching plan review events:', error));

    // 获取生产经理请求事件 (stage 为 05，status 为 01)，显示为 "Task Assignment #"
    fetch('http://127.0.0.1:5000/api/events/production_manager_request')
        .then(response => response.json())
        .then(data => {
            const taskAssignmentEvents = data.approval_stage_05_event_ids.filter(event => event.status === "11");
            populateDropdown(taskAssignmentEvents, unreviewedContainer, 'Task Assignment');
        })
        .catch(error => console.error('Error fetching production manager request events:', error));

    // 获取财务审核事件 (stage 为 08, status 为 10)，显示为 "Financial Review #"
    fetch('http://127.0.0.1:5000/api/events/financial_increase_request')
        .then(response => response.json())
        .then(data => {
            const rejectedFinancialEvents = data.approval_stage_08_event_ids.filter(event => event.status === "10");
            populateDropdown(rejectedFinancialEvents, rejectedContainer, 'Financial Review');
        })
        .catch(error => console.error('Error fetching financial review events:', error));

    // 获取完成事件 (stage 为 09, status 为 11)，显示为 "Done #"
    fetch('http://127.0.0.1:5000/api/events/done')
        .then(response => response.json())
        .then(data => {
            const doneEvents = data.approval_stage_09_event_ids.filter(event => event.status === "11");
            populateDropdown(doneEvents, doneContainer, 'Done');
        })
        .catch(error => console.error('Error fetching done events:', error));

    const dropdowns = document.querySelectorAll('.dropdown-header');

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
});



// 填充下拉菜单
function populateDropdown(eventDataList, container, label) {
    eventDataList.forEach(event => {
        // 检查是否已经存在相同的元素
        if (!container.querySelector(`[data-record='${event.id}']`)) {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.dataset.record = event.id;

            // 根据标签设置显示格式
            eventItem.innerHTML = `<div class="record-number">${label} #${event.id}</div>`;

            // 添加点击事件监听器，传递 event.id
            eventItem.addEventListener('click', function() {
                fetchEventDetails(event.id); // 确保传递的是 event.id
            });
            container.appendChild(eventItem);
        }
    });
}

//获取事件信息
function fetchEventDetails(eventId) {
    fetch(`http://127.0.0.1:5000/api/events/${eventId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayEventForm(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            eventFormDisplay.innerHTML = '<p>Failed to load event details. Please try again later.</p>';
        });
}

function displayEventForm(eventData) {
    const eventFormDisplay = document.getElementById('eventFormDisplay');

    if (eventData) {
        // 定义键名称映射，转换为显示格式
        const preferencesMapping = {
            decoration: "Decoration",
            parties: "Parties",
            photos_videos: "Photos/Videos",
            foods: "Foods",
            drinks: "Drinks"
        };

        // 定义状态映射
        const statusMapping = {
            "00": "Submitted",
            "01": "Under Review",
            "10": "Reject",
            "11": "Approve"
        };

        // 获取选中的 preferences 并格式化
        const formattedPreferences = Object.entries(eventData.main_information.preferences || {})
            .filter(([key, value]) => value) // 仅保留选中的项
            .map(([key]) => preferencesMapping[key] || key) // 转换名称
            .join(', ') || 'None';

        // 根据状态码获取状态字符串
        const statusText = statusMapping[eventData.status] || "Unknown";

        // 填充事件详情
        eventFormDisplay.innerHTML = `
            <h3>Title: ${eventData.title} - Request #${eventData.id}</h3>
            <p><strong>Client Name:</strong> ${eventData.main_information.client_name}</p>
            <p><strong>Event Type:</strong> ${eventData.main_information.event_type}</p>
            <p><strong>From Date:</strong> ${eventData.main_information.from_date.year}-${eventData.main_information.from_date.month}-${eventData.main_information.from_date.day}</p>
            <p><strong>To Date:</strong> ${eventData.main_information.to_date.year}-${eventData.main_information.to_date.month}-${eventData.main_information.to_date.day}</p>
            <p><strong>Expected Number of Attendees:</strong> ${eventData.main_information.expected_attendees}</p>
            <p><strong>Expected Budget:</strong> $${eventData.main_information.expected_budget}</p>
            <p><strong>Preferences:</strong> ${formattedPreferences}</p>
            <p><strong>Status:</strong> ${statusText}</p>
        `;

        //分配任务的详情
        if (eventData.tasks_assignment) {
            eventFormDisplay.innerHTML += `
                <div class="detailed-plan">
                    <h4>Description For Photography Team:</h4>
                    <p>${eventData.tasks_assignment.description}</p>
                    <p><strong>Budget:</strong> ${eventData.tasks_assignment.budget}</p>
                `;

            if (eventData.tasks_assignment.detail_plan != "unavailable" && eventData.tasks_assignment.detail_plan != "N/A") { //当有数据时才显示
            eventFormDisplay.innerHTML += `                               
                <div class="detailed-plan">
                    <h4>Detailed Plan from Photography Team:</h4>
                    <p>${eventData.tasks_assignment.detail_plan}</p>
                    <p><strong>Needs More Money:</strong> ${eventData.tasks_assignment.need_more_money ? 'Yes' : 'No'}</p>
                `;
            if (eventData.tasks_assignment.need_more_money) { //需要加预算时才显示
                eventFormDisplay.innerHTML += `
                <div class="detailed-plan">
                    <p><strong>Additional Amount Requested:</strong> $${eventData.tasks_assignment.amount}</p>
                    <p><strong>Reason:</strong> ${eventData.tasks_assignment.reason}</p>
                `;
            }
            }
            eventFormDisplay.innerHTML += `</div>`;
        }

        
        // 逻辑：当 `approval_stage` 为 05 且 `status` 为 11 时，只显示 Assignment Done 按钮
        if (eventData.approval_stage === "05" && eventData.status === "11") {
            eventFormDisplay.innerHTML += `
                <div class="form-actions">
                    <button class="assignment-done-btn">Assignment Done</button>
                </div>
            `;
            const assignmentDoneBtn = eventFormDisplay.querySelector('.assignment-done-btn');
            assignmentDoneBtn.addEventListener('click', () => handleAssignmentDone(eventData.id));
        
        } else if (eventData.status !== "10" && eventData.approval_stage !== "09") {
            // 如果状态不是 "10" (Reject)，显示默认操作按钮
            eventFormDisplay.innerHTML += `
                <div class="form-actions">
                    <button class="approve-btn">Approve</button>
                    <button class="reject-btn">Reject</button>
                </div>
            `;
            const approveBtn = eventFormDisplay.querySelector('.approve-btn');
            const rejectBtn = eventFormDisplay.querySelector('.reject-btn');

            if (approveBtn) {
                approveBtn.addEventListener('click', () => handleApproval(eventData.id));
            }
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => handleRejection(eventData.id));
            }
        }
    } else {
        eventFormDisplay.innerHTML = '<p>Event form not found.</p>';
    }
}



// 处理 approve 操作
function handleApproval(eventId) {
    fetch(`http://127.0.0.1:5000/api/events/${eventId}/approve_task`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log("Event approved:", data);
        alert('Event approved successfully');
    })
    .catch(error => console.error('Error approving event:', error));
}

// 处理 reject 操作
function handleRejection(eventId) {
    fetch(`http://127.0.0.1:5000/api/events/${eventId}/reject_task`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log("Event rejected:", data);
        alert('Event rejected successfully');
    })
    .catch(error => console.error('Error rejecting event:', error));
}

function handleAssignmentDone(eventId){
    fetch(`http://127.0.0.1:5000/api/events/${eventId}/assignment_done`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log("Event Assigned:", data);
        alert('Event Assignment successfully');
    })
    .catch(error => console.error('Error rejecting event:', error));
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


function displayClientRequestForm() {
    // 这里添加显示客户请求表单的逻辑
    console.log("Displaying Client Request Form");
    // 可以调用之前的 displayNewForm() 函数或创建新的函数
    displayNewForm();
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
                        <label for="photographyBudget">Budget:</label>
                        <input type="number" id="photographyBudget" name="photographyBudget">
                    </div>
                </div>
            </div>
            <button type="submit" id="submitbtn" class="submit-btn">Send</button>
        </form>
    `;

    const eventFormDisplay = document.getElementById('eventFormDisplay');
    eventFormDisplay.innerHTML = formHtml;

    // 添加表单提交事件监听器
    const submitbtn = document.getElementById('submitbtn');
    submitbtn.addEventListener('click', function(e) {
        e.preventDefault();
        // 这里可以添加表单提交的逻辑

        const eventId = document.getElementById('EventID').value;
        const budget = document.getElementById('photographyBudget').value;
        const description = document.getElementById('photography').value;
        const title = "None";
        const assignee = "None";
        const department = "None"; //Not used

        // 检查是否有必要的字段
        if (!eventId || !budget || !description) {
            alert('Please fill in all required fields');
            return;
        }

        // 创建要发送到后端的数据对象
        const requestData = {
            budget: budget,
            description: description,
            title: title,
            assignee: assignee,
            department: department
        };

        // 发送 POST 请求到后端
        fetch(`http://127.0.0.1:5000/api/events/${eventId}/assign_task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(`Task successfully assigned for Event ID: ${data.event_id}`);
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('There was an error submitting the form:', error);
            alert('Failed to assign task. Please try again later.');
        });

        console.log('Form sent');
        alert('Form sent successfully!');
    });

    // 添加查找事件监听器
    const FindEventBtn = document.getElementById('FindEvent');
    FindEventBtn.addEventListener('click', function() {
        clearForm()
        const EventID = document.getElementById('EventID').value;
        if (EventID) {
            // 发送请求到后端获取事件数据
            fetch(`http://127.0.0.1:5000/api/events/${EventID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return response.json();
                })
                .then(data => {
                    // 填充表单
                    document.getElementById('clientName').value = data.main_information.client_name;
                    document.getElementById('eventType').value = data.main_information.event_type;
                    document.getElementById('fromDate').value = `${data.main_information.from_date.year}-${formatDateComponent(data.main_information.from_date.month)}-${formatDateComponent(data.main_information.from_date.day)}`;
                    document.getElementById('toDate').value = `${data.main_information.to_date.year}-${formatDateComponent(data.main_information.to_date.month)}-${formatDateComponent(data.main_information.to_date.day)}`;                    document.getElementById('expectedAttendees').value = data.main_information.expected_attendees;
                    document.getElementById('expectedBudget').value = data.main_information.expected_budget;
                    document.getElementById('description').value = data.financial_feedback.review;

                    // 填充各部门预算的表单（根据你的需求扩展）
                    document.getElementById('photography').value = data.tasks_assignment.description || '';
                    document.getElementById('photographyBudget').value = data.tasks_assignment.budget || '';
                    // 其他部门预算字段的同样逻辑
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to load event data.');
                });
        } else {
            alert('Please enter a valid Record Number.');
        }
    });
}

function formatDateComponent(component) {
    return component < 10 ? `0${component}` : component;
}//日期格式转换

function clearForm() {
    document.getElementById('clientName').value = '';
    document.getElementById('eventType').value = '';
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('expectedAttendees').value = '';
    document.getElementById('expectedBudget').value = '';
    document.getElementById('description').value = '';
}// 清理其他字段