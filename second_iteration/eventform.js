document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.querySelector('.eventform');

    if (eventForm) {
        eventForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // 获取表单数据
            const formData = {
                recordNumber: document.getElementById('recordNumber').value,
                clientName: document.getElementById('clientName').value,
                eventType: document.getElementById('eventType').value,
                fromDate: document.getElementById('fromDate').value,
                toDate: document.getElementById('toDate').value,
                expectedNumAttendees: document.getElementById('expectedNumAttendees').value,
                expectedBudget: document.getElementById('expectedBudget').value,
                preferences: Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(el => el.value)
            };

            // 发送数据到后端
            fetch('/api/eventform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert('Event form submitted successfully!');
                // 可在此添加进一步处理逻辑
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert('Failed to submit event form. Please try again later.');
            });
        });
    }
});
