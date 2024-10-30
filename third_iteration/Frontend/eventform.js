document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.querySelector('.eventform');

    if (eventForm) {
        eventForm.addEventListener('submit', function(event) {
            event.preventDefault();

            function parseDate(dateString) {
                const [year, month, day] = dateString.split('-').map(Number);
                return { year, month, day };
            }

            const defaultPreferences = {
                decoration: false,
                parties: false,
                photos_videos: false,
                foods: false,
                drinks: false
            };
            
            const selectedPreferences = Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(el => el.value);
            
            // 将默认对象与选中的选项合并
            const preferences = selectedPreferences.reduce((prefs, key) => {
                prefs[key] = true;
                return prefs;
            }, { ...defaultPreferences });
            
            const formData = {
                title: document.getElementById('Title').value,
                client_name: document.getElementById('clientName').value,
                event_type: document.getElementById('eventType').value,
                from_date: parseDate(document.getElementById('fromDate').value),
                to_date: parseDate(document.getElementById('toDate').value),
                expected_attendees: parseInt(document.getElementById('expectedNumAttendees').value, 10),
                expected_budget: parseInt(document.getElementById('expectedBudget').value, 10),
                preferences: preferences
            };

            // 发送数据到后端
            fetch('http://127.0.0.1:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'},
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
