// 假设你有一个按钮用来提交表单
document.getElementById('submit-btn').addEventListener('click', () => {
    // 收集用户输入的数据
    const title = document.getElementById('title').value;
    const clientName = document.getElementById('client-name').value;
    const eventType = document.getElementById('event-type').value;
    const fromDate = {
        year: parseInt(document.getElementById('from-year').value),
        month: parseInt(document.getElementById('from-month').value),
        day: parseInt(document.getElementById('from-day').value)
    };
    const toDate = {
        year: parseInt(document.getElementById('to-year').value),
        month: parseInt(document.getElementById('to-month').value),
        day: parseInt(document.getElementById('to-day').value)
    };
    const expectedAttendees = parseInt(document.getElementById('expected-attendees').value);
    const expectedBudget = parseInt(document.getElementById('expected-budget').value);

    // 偏好设置（布尔值）
    const preferences = {
        decoration: document.getElementById('decoration').checked,
        parties: document.getElementById('parties').checked,
        photos_videos: document.getElementById('photos-videos').checked,
        foods: document.getElementById('foods').checked,
        drinks: document.getElementById('drinks').checked
    };

    // 组织发送给后端的数据
    const eventData = {
        title: title,
        client_name: clientName,
        event_type: eventType,
        from_date: fromDate,
        to_date: toDate,
        expected_attendees: expectedAttendees,
        expected_budget: expectedBudget,
        preferences: preferences
    };

    // 使用 fetch API 发送 POST 请求
    fetch('/api/newevents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Event created successfully:', data);
        alert(`Event ${data.event_id} created successfully`);
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
        alert('Failed to create event.');
    });
});







fetch('/api/events/1')  // 这里的 '1' 是一个示例 EventID
    .then(response => {
        if (!response.ok) {
            throw new Error('Event not found');
        }
        return response.json();
    })
    .then(data => {
        console.log('Event details:', data);
        // 在页面上显示事件的详细信息
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to retrieve event details.');
    });






const eventId = 1;  // 假设这是用户选择的 Event ID
fetch(`/api/events/${eventId}/update_stage`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error updating approval stage');
    }
    return response.json();
})
.then(data => {
    console.log('Approval stage updated:', data);
    alert(`Event ${data.event_id} approval stage updated to ${data.new_approval_stage}`);
})
.catch(error => {
    console.error('Error:', error);
    alert('Failed to update approval stage.');
});




const eventId = 1;  // 假设这是用户选择的 Event ID
const reviewData = {
    review: "This is the financial review for the event.",
    date: {
        year: 2024,
        month: 11,
        day: 5
    }
};

fetch(`/api/events/${eventId}/financial_review`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error adding financial review');
    }
    return response.json();
})
.then(data => {
    console.log('Financial review added and approval stage updated:', data);
    alert(`Financial review added for event ${data.event_id}, and approval stage updated to ${data.new_approval_stage}`);
})
.catch(error => {
    console.error('Error:', error);
    alert('Failed to add financial review and update approval stage.');
});






fetch('/api/events/senior_customer_request')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to retrieve senior customer requests');
        }
        return response.json();
    })
    .then(data => {
        console.log('Approval Stage 01 Event IDs:', data.approval_stage_01_event_ids);
        alert(`Event IDs with approval stage 01: ${data.approval_stage_01_event_ids.join(', ')}`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error retrieving senior customer requests');
    });