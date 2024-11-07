document.addEventListener('DOMContentLoaded', function() {
    // 获取下拉容器
    const unreviewedContainer = document.getElementById('unreviewed');

    // 获取计划审核事件 (stage 为 07)
    fetch('http://127.0.0.1:5000/api/events/subteam_request')
    .then(response => response.json())
    .then(data => {
        const planReviewUnreviewed = data.approval_stage_06_event_ids.filter(event => event.status === "11");
        populateDropdown(planReviewUnreviewed, unreviewedContainer, 'Task Assignment');
    })
    .catch(error => console.error('Error fetching plan review events:', error));
    
    const dropdowns = document.querySelectorAll('.dropdown-header');
    //点击下拉菜单操作
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
        };
});

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
        eventFormDisplay.innerHTML += `
            <div class="detailed-plan">
                <h4>Description For Photography Team:</h4>
                <p>${eventData.tasks_assignment.description}</p>
                <p><strong>Budget:</strong> ${eventData.tasks_assignment.budget}</p>
                </div>
            `;

        //显示填充任务细节
        eventFormDisplay.innerHTML += `
            <h3></h3>
            <h3>Detailed Plan</h3>
            <textarea id="detailedPlan" rows="4" cols="50" placeholder="Enter your detailed plan here..."></textarea>
            <div>
                <label>Need more money?</label>
                <input type="radio" id="needMoneyYes" name="needMoney" value="yes" onchange="toggleAmountReason(true)">
                <label for="needMoneyYes">Yes</label>
                <input type="radio" id="needMoneyNo" name="needMoney" value="no" onchange="toggleAmountReason(false)">
                <label for="needMoneyNo">No</label>
            </div>
            <div id="amountReasonContainer" style="display: none;">
                <div>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" name="amount">
                </div>
                <div>
                    <label for="reason">Reason:</label>
                    <textarea id="reason" rows="3" cols="50"></textarea>
                </div>
            </div>
        `;

        //显示Respond按钮
        eventFormDisplay.innerHTML += `
            <div class="form-actions">
                <button class="assignment-done-btn" id="respondbtn">Respond Task</button>
            </div>
        `;

        // 添加表单提交事件监听器
        const respondbtn = document.getElementById('respondbtn');
            respondbtn.addEventListener('click', function(e) {
            e.preventDefault();
            // 这里可以添加表单提交的逻辑
            const needMoreMoney = document.querySelector('input[name="needMoney"]:checked').value === 'yes';
            const detailedPlan = document.getElementById('detailedPlan').value;
            const amount = document.getElementById("amount").value;
            const Reason = document.getElementById("reason").value;
        
            // 检查是否有必要的字段
            if (!detailedPlan || !needMoneyYes) {
                alert('Please fill in all required fields');
                return;
            }

            // 创建要发送到后端的数据对象
            const requestData = {
                detail_plan: detailedPlan,
                need_more_money: needMoreMoney,
                amount: amount,
                reason: Reason
            };

            // 发送 POST 请求到后端
            fetch(`http://127.0.0.1:5000/api/events/${eventData.id}/response_task`, {
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
                alert(`Task successfully response for Event ID: ${data.event_id}`);
                console.log('Server response:', data);
            })
            .catch(error => {
                console.error('There was an error submitting the form:', error);
                alert('Failed to assign task. Please try again later.');
            });
            })
    } 
    else {
        eventFormDisplay.innerHTML = '<p>Event form not found.</p>';
    }
}

window.toggleAmountReason = function(show) {
    const container = document.getElementById('amountReasonContainer');
    container.style.display = show ? 'block' : 'none';
}