document.addEventListener('DOMContentLoaded', function() {
    // 在网页启动时获取未审核和拒绝的请求
    const unreviewedContainer = document.getElementById('unreviewedDropdown'); 
    const rejectRequestContainer = document.getElementById('rejectrequestDropdown');

    // 获取未审核的事件 ID
    fetch('http://127.0.0.1:5000/api/events/unreviewed')
        .then(response => response.json())
        .then(data => {
            const unreviewedRequests = data.unreviewed_event_ids;
            populateDropdown(unreviewedRequests, unreviewedContainer, 'Unreviewed');
        })
        .catch(error => console.error('Error fetching unreviewed events:', error));

    // 获取拒绝的事件 ID
    fetch('http://127.0.0.1:5000/api/events/rejected')
        .then(response => response.json())
        .then(data => {
            const rejectedRequests = data.rejected_event_ids;
            populateDropdown(rejectedRequests, rejectRequestContainer, 'Rejected Request');
        })
        .catch(error => console.error('Error fetching rejected events:', error));

    const dropdowns = document.querySelectorAll('.dropdown-header');
    const eventItems = document.querySelectorAll('.event-item');

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

    function updateUserInfo(email) {
        const avatar = document.querySelector('.avatar');
        const welcomeText = document.querySelector('.welcome-text');

        if (email === 'alice@sep.se') {
            avatar.style.backgroundImage = "url('imgs/portrait/alice.png')"; // 更新头像图片路径
            welcomeText.textContent = 'Welcome, Alice'; // 更新欢迎文字
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

//自动补全下拉菜单
function populateDropdown(eventDataList, container, label) {
    container.innerHTML = ''; // 清空现有内容
    eventDataList.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.dataset.record = event.id; // 设置记录的 ID

        // 根据 label 参数动态设置内容格式
        if (label === 'Unreviewed') {
            eventItem.innerHTML = `<div class="record-number">Unreviewed Request #${event.id} </div>`;
        } else if (label === 'Rejected Request') {
            eventItem.innerHTML = `<div class="record-number">Rejected Request #${event.id} </div>`;
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
            formDisplay.innerHTML = '<p>Failed to load event details. Please try again later.</p>';
        });
}

//将数据填入显示选项中
function displayEventForm(eventData) {
    const formDisplay = document.getElementById('formDisplay');
    
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

        // 如果状态不是 "10" (Reject)，则显示操作按钮
        if (eventData.status !== "10") {
            formDisplay.innerHTML += `
                <div class="form-actions">
                    <button class="approve-btn">Approve</button>
                    <button class="reject-btn">Reject</button>
                </div>
            `;

            const approveBtn = formDisplay.querySelector('.approve-btn');
            const rejectBtn = formDisplay.querySelector('.reject-btn');

            if (approveBtn) {
                approveBtn.addEventListener('click', () => handleApproval(eventData.id));
            }
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => handleRejection(eventData.id));
            }
        }
    } else {
        formDisplay.innerHTML = '<p>Event form not found.</p>';
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