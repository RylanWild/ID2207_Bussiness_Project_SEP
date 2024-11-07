document.addEventListener('DOMContentLoaded', function() {
//    const unreviewedContainer = document.getElementById('unreviewedDropdown'); 
//    const rejectedContainer = document.getElementById('rejectrequestDropdown');

    fetch('http://127.0.0.1:5000/api/events/financial_manager_request')
        .then(response => response.json())
        .then(data => {
            const unreviewedEvents = data.approval_stage_02_event_ids.filter(event => event.status === "01");
            populateDropdown(unreviewedEvents, document.getElementById('unreviewedDropdown'), 'Event Request');
        })
        .catch(error => console.error('Error fetching approval stage 02 events:', error));

    fetch('http://127.0.0.1:5000/api/events/financial_increase_request')
        .then(response => response.json())
        .then(data => {
            const financialUnreviewed = data.approval_stage_08_event_ids.filter(event => event.status === "11");
            const financialRejected = data.approval_stage_08_event_ids.filter(event => event.status === "10");

            populateDropdown(financialUnreviewed, document.getElementById('unreviewedDropdown'), 'Financial Request');
            populateDropdown(financialRejected, document.getElementById('rejectrequestDropdown'), 'Financial Request');
        })
        .catch(error => console.error('Error fetching approval stage 08 events:', error));

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
});

function populateDropdown(eventDataList, container, label) {
    eventDataList.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.dataset.record = event.id;

        if (label === 'Event Request') {
            eventItem.innerHTML = `<div class="record-number">Event Request #${event.id}</div>`;
        } else if (label === 'Financial Request') {
            eventItem.innerHTML = `<div class="record-number">Financial Request #${event.id}</div>`;
        }

        eventItem.addEventListener('click', function() {
            fetchEventDetails(event.id);
        });
        container.appendChild(eventItem);
    });
}

function fetchEventDetails(eventId, approvalStage, status) {
    fetch(`http://127.0.0.1:5000/api/events/${eventId}`)
        .then(response => response.json())
        .then(data => {
            displayEventForm(data);
        })
        .catch(error => {
            console.error('Error fetching event details:', error);
            document.getElementById('formDisplay').innerHTML = '<p>Failed to load event details. Please try again later.</p>';
        });
}

function displayEventForm(eventData) {
    const formDisplay = document.getElementById('formDisplay');

    let formattedPreferences = Object.entries(eventData.main_information.preferences || {})
        .filter(([key, value]) => value)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
        .join(', ') || 'None';
    
    let statusText = mapStatus(eventData.status);

    if (eventData.approval_stage === "02") {
        formDisplay.innerHTML = `
            <h3>Title: ${eventData.title} - Request #${eventData.id}</h3>
            <p><strong>Client Name:</strong> ${eventData.main_information.client_name}</p>
            <p><strong>Event Type:</strong> ${eventData.main_information.event_type}</p>
            <p><strong>From Date:</strong> ${eventData.main_information.from_date.year}-${eventData.main_information.from_date.month}-${eventData.main_information.from_date.day}</p>
            <p><strong>To Date:</strong> ${eventData.main_information.to_date.year}-${eventData.main_information.to_date.month}-${eventData.main_information.to_date.day}</p>
            <p><strong>Expected Number of Attendees:</strong> ${eventData.main_information.expected_attendees}</p>
            <p><strong>Expected Budget:</strong> $${eventData.main_information.expected_budget}</p>
            <p><strong>Preferences:</strong> ${formattedPreferences}</p>
            <p><strong>Status:</strong> ${statusText}</p>
            <div class="form-actions">
                <button class="write-feedback-btn">Write Feedback</button>
            </div>
            <div class="feedback-container" style="display: none;">
                <textarea id="feedbackText" rows="4" cols="50" placeholder="Enter your feedback here..."></textarea>
                <button id="submitFeedbackBtn" class="submit-feedback-btn" disabled>Submit</button>
            </div>
        `;
        // 在元素插入后获取并绑定事件
        const writeFeedbackBtn = document.querySelector('.write-feedback-btn');
        const feedbackContainer = document.querySelector('.feedback-container');
        const feedbackText = document.getElementById('feedbackText');
        const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
    
        // 检查是否成功获取元素
        if (writeFeedbackBtn && feedbackContainer) {
            console.log('Button and container found, adding click event.');
            writeFeedbackBtn.addEventListener('click', function() {
                console.log('Write Feedback button clicked');
                writeFeedbackBtn.style.display = 'none';
                feedbackContainer.style.display = 'block';
            });
        
        // 启用 Submit 按钮
        feedbackText.addEventListener('input', () => {
            submitFeedbackBtn.disabled = feedbackText.value.trim() === '';
        });

        // 处理 Submit 按钮点击事件
        submitFeedbackBtn.addEventListener('click', function() {
        const feedbackContent = feedbackText.value;
                // 发送 POST 请求
                fetch(`http://127.0.0.1:5000/api/events/${eventData.id}/financial_review`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ review: feedbackContent })
                })
                .then(response => response.json())
                .then(data => {
                    alert("Feedback submitted successfully!");
                    feedbackContainer.style.display = 'none';
                    writeFeedbackBtn.style.display = 'block';
                    feedbackText.value = '';  // 清空文本框
                    submitFeedbackBtn.disabled = true; // 禁用按钮
                })
                .catch(error => console.error('Error submitting feedback:', error));
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        // 获取 Write Feedback 按钮和反馈容器
        const writeFeedbackBtn = document.querySelector('.write-feedback-btn');
        const feedbackContainer = document.querySelector('.feedback-container');
    
        // 添加点击事件监听器
        writeFeedbackBtn.addEventListener('click', function() {
            // 点击后隐藏 Write Feedback 按钮并显示反馈文本框
            writeFeedbackBtn.style.display = 'none';
            feedbackContainer.style.display = 'block';
        });
    });


    if (eventData.approval_stage === "08") {
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
        formDisplay.innerHTML = `
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
            formDisplay.innerHTML += `
                <div class="detailed-plan">
                    <h4>Description For Photography Team:</h4>
                    <p>${eventData.tasks_assignment.description}</p>
                    <p><strong>Budget:</strong> ${eventData.tasks_assignment.budget}</p>
                `;

            if (eventData.tasks_assignment.detail_plan != "unavailable" && eventData.tasks_assignment.detail_plan != "N/A") { //当有数据时才显示
                formDisplay.innerHTML += `                               
                <div class="detailed-plan">
                    <h4>Detailed Plan from Photography Team:</h4>
                    <p>${eventData.tasks_assignment.detail_plan}</p>
                    <p><strong>Needs More Money:</strong> ${eventData.tasks_assignment.need_more_money ? 'Yes' : 'No'}</p>
                `;
            if (eventData.tasks_assignment.need_more_money) { //需要加预算时才显示
                formDisplay.innerHTML += `
                <div class="detailed-plan">
                    <p><strong>Additional Amount Requested:</strong> $${eventData.tasks_assignment.amount}</p>
                    <p><strong>Reason:</strong> ${eventData.tasks_assignment.reason}</p>
                `;
            }
            }
            formDisplay.innerHTML += `</div>`;
        }

            if (eventData.status !== "10" && eventData.approval_stage !== "09") {
            // 如果状态不是 "10" (Reject)，显示默认操作按钮
            formDisplay.innerHTML += `
                <div class="form-actions">
                    <button class="approve-btn">Approve</button>
                    <button class="reject-btn">Reject</button>
                </div>
            `;
            const approveBtn = formDisplay.querySelector('.approve-btn');
            const rejectBtn = formDisplay.querySelector('.reject-btn');

            if (approveBtn) {
                approveBtn.addEventListener('click', () => approveEvent(eventData.id));
            }
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => rejectEvent(eventData.id));
            }
        }
    }
    


}




function mapStatus(status) {
    const statusMapping = {
        "00": "Submitted",
        "01": "Under Review",
        "10": "Rejected",
        "11": "Approved"
    };
    return statusMapping[status] || "Unknown";
}

function approveEvent(eventId) {
    fetch(`http://127.0.0.1:5000/api/events/${eventId}/financial_approve_task`, { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            alert("Event approved successfully!");
            fetchEventDetails(eventId);
        })
        .catch(error => console.error('Error approving event:', error));
}

function rejectEvent(eventId) {
    fetch(`http://127.0.0.1:5000/api/events/${eventId}/reject`, { method: 'PUT' })
        .then(response => response.json())
        .then(data => {
            alert("Event rejected successfully!");
            fetchEventDetails(eventId);
        })
        .catch(error => console.error('Error rejecting event:', error));
}
