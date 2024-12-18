document.addEventListener('DOMContentLoaded', function() {
    //在网页启动时获取request与meeting的EventID
//    const requestContainer = document.getElementById('requestDropdown'); 
//    const businessMeetingContainer = document.getElementById('businessmeetingDropdown');

    // 获取审批阶段为 01 的事件 ID
    fetch('http://127.0.0.1:5000/api/events/senior_customer_request')
        .then(response => response.json())
        .then(data => {
            // 分别过滤不同 status 的事件
            const pendingRequests = data.approval_stage_01_event_ids.filter(event => event.status === "00");
            const rejectedRequests = data.approval_stage_01_event_ids.filter(event => event.status === "10");

            // 填充到不同的下拉菜单中
            populateDropdown(pendingRequests, document.getElementById("requestDropdown"), 'Request');
            populateDropdown(rejectedRequests, document.getElementById("rejectedRequestDropdown"), 'Rejected Request');
        })
        .catch(error => console.error('Error fetching approval stage 01 events:', error));

    // 获取审批阶段为 04 的事件 ID
    fetch('http://127.0.0.1:5000/api/events/business_meeting_request')
        .then(response => response.json())
        .then(data => {
            const businessmeeting = data.approval_stage_04_event_ids;
            populateDropdown(businessmeeting, document.getElementById("businessMeetingDropdown"), 'Business Meeting');
        })
        .catch(error => console.error('Error fetching approval stage 04 events:', error));

    const dropdowns = document.querySelectorAll('.dropdown-header');
//    const eventItems = document.querySelectorAll('.event-item');

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

    const profilePicture = document.querySelector('.profile-picture');
    const infoPopup = document.querySelector('.info-popup');

    if (profilePicture && infoPopup) {
        console.log('Profile picture and info popup elements found.');

        profilePicture.addEventListener('click', function(event) {
            event.stopPropagation(); // 防止事件冒泡
            console.log('Profile picture clicked.');

            // 切换 infoPopup 的显示状态
            if (infoPopup.style.display === 'block') {
                infoPopup.style.display = 'none';
            } else {
                infoPopup.style.display = 'block';
            }
        });

        // 可选：点击页面其他地方时隐藏 infoPopup
        document.addEventListener('click', function(event) {
            if (!profilePicture.contains(event.target)) {
                infoPopup.style.display = 'none';
            }
        });
    } else {
        console.error('Profile picture or info popup element not found.');
    }

});

//自动补全下拉菜单
function populateDropdown(eventDataList, container, label) {
    container.innerHTML = ''; // 清空现有内容
    eventDataList.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.dataset.record = event.id; // 设置记录的 ID

        // 根据 label 参数动态设置内容格式
        if (label === 'Request') {
            eventItem.innerHTML = `<div class="record-number">Event Request #${event.id} </div>`;
        } else if (label === 'Business Meeting') {
            eventItem.innerHTML = `<div class="record-number">Business Meeting #${event.id} </div>`;
        } else if (label === 'Rejected Request') {
            eventItem.innerHTML = `<div class="record-number">Event Rejected #${event.id} </div>`;
        }

        // 添加点击事件监听器，传递 event.id
        eventItem.addEventListener('click', function() {
            fetchEventDetails(event.id); // 确保传递的是 event.id
        });
        container.appendChild(eventItem);
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


//将数据填入显示选项中
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

        // 如果状态不是 "10" (Reject)，则显示操作按钮
        if (eventData.status !== "10") {
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
    fetch(`http://127.0.0.1:5000/api/events/${eventId}/update_stage`, {
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
    fetch(`http://127.0.0.1:5000/api/events/${eventId}/reject`, {
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