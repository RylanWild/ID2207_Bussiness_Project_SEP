
// 获取所有按钮
const getEventsBtn = document.getElementById('get-events-btn');
const addEventBtn = document.getElementById('add-event-btn');
const updateEventBtn = document.getElementById('update-event-btn');
const financialReviewBtn = document.getElementById('financial-review-btn');
const rejectEventBtn = document.getElementById('reject-event-btn');
const deleteEventBtn = document.getElementById('delete-event-btn');
const ResetBtn = document.getElementById('reset_database');

// 获取输出区域
const output = document.getElementById('output');

// 获取所有事件
getEventsBtn.addEventListener('click', () => {
    fetch('http://127.0.0.1:5000/api/events')
        .then(response => response.json())
        .then(data => {
            output.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            output.innerHTML = `Error: ${error.message}`;
        });
});

// 添加新事件
addEventBtn.addEventListener('click', () => {
    const eventData = {
        title: "xxx",
        client_name: "xxx",
        event_type: "xxx",
        from_date: { year: 0, month: 0, day: 0 },
        to_date: { year: 0, month: 0, day: 0 },
        expected_attendees: 111,
        expected_budget: 111,
        preferences: {
            decoration: false,
            parties: false,
            photos_videos: true,
            foods: false,
            drinks: false
        }
    };

    fetch('http://127.0.0.1:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `Event added: ${JSON.stringify(data, null, 2)}`;
    })
    .catch(error => {
        output.innerHTML = `Error: ${error.message}`;
    });
});

// 更新事件阶段
updateEventBtn.addEventListener('click', () => {
    const eventId = 3;

    fetch(`http://127.0.0.1:5000/api/events/${eventId}/update_stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `Event updated: ${JSON.stringify(data, null, 2)}`;
    })
    .catch(error => {
        output.innerHTML = `Error: ${error.message}`;
    });
});

// 添加财务审核
financialReviewBtn.addEventListener('click', () => {
    const eventId = 4;
    const reviewData = {
        review: "xxx",
        date: { year: 2024, month: 1, day: 1 }
    };

    fetch(`http://127.0.0.1:5000/api/events/${eventId}/financial_review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `Financial review added: ${JSON.stringify(data, null, 2)}`;
    })
    .catch(error => {
        output.innerHTML = `Error: ${error.message}`;
    });
});

// 拒绝事件
rejectEventBtn.addEventListener('click', () => {
    const eventId = 4;

    fetch(`http://127.0.0.1:5000/api/events/${eventId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `Event rejected: ${JSON.stringify(data, null, 2)}`;
    })
    .catch(error => {
        output.innerHTML = `Error: ${error.message}`;
    });
});

// 删除事件
ResetBtn.addEventListener('click', () => {
    const eventId = 2;

    fetch(`http://127.0.0.1:5000/reset_database`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `Database Reset: ${JSON.stringify(data, null, 2)}`;
    })
    .catch(error => {
        output.innerHTML = `Error: ${error.message}`;
    });
});

// 重置数据库
deleteEventBtn.addEventListener('click', () => {
    const eventId = 2;

    fetch(`http://127.0.0.1:5000/api/events/${eventId}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `Event deleted: ${JSON.stringify(data, null, 2)}`;
    })
    .catch(error => {
        output.innerHTML = `Error: ${error.message}`;
    });
});