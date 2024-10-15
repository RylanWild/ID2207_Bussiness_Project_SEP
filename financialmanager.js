document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-header');
    const eventItems = document.querySelectorAll('.event-item');
    const eventFormDisplay = document.getElementById('eventFormDisplay');

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
                status: 'Unreviewed'
            },
            '002': {
                clientName: 'Tech Innovations Inc.',
                eventType: 'Corporate Meeting',
                fromDate: '2023-09-10',
                toDate: '2023-09-11',
                expectedNumAttendees: 75,
                expectedBudget: 15000,
                preferences: ['Meals', 'Drinks'],
                status: 'Unreviewed'
            },
            '003': {
                clientName: 'Emily Johnson',
                eventType: 'Birthday Party',
                fromDate: '2023-07-20',
                toDate: '2023-07-20',
                expectedNumAttendees: 50,
                expectedBudget: 5000,
                preferences: ['Decoration', 'Meals', 'Drinks'],
                status: 'Reviewed'
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

            if (form.status === 'Unreviewed') {
                formHtml += `
                    <div class="form-actions">
                        <button class="write-feedback-btn">Write Feedback</button>
                    </div>
                    <div class="feedback-container" style="display: none;">
                        <textarea id="feedbackText" rows="4" cols="50" placeholder="Enter your feedback here..."></textarea>
                        <button class="submit-feedback-btn" disabled>Submit</button>
                    </div>
                `;
            }

            eventFormDisplay.innerHTML = formHtml;

            // Add event listener to the button
            const writeFeedbackBtn = eventFormDisplay.querySelector('.write-feedback-btn');
            const feedbackContainer = eventFormDisplay.querySelector('.feedback-container');
            const submitFeedbackBtn = eventFormDisplay.querySelector('.submit-feedback-btn');
            const feedbackText = eventFormDisplay.querySelector('#feedbackText');

            if (writeFeedbackBtn && feedbackContainer && submitFeedbackBtn && feedbackText) {
                writeFeedbackBtn.addEventListener('click', () => {
                    feedbackContainer.style.display = 'block';
                    writeFeedbackBtn.style.display = 'none';
                });

                feedbackText.addEventListener('input', () => {
                    submitFeedbackBtn.disabled = feedbackText.value.trim() === '';
                });

                submitFeedbackBtn.addEventListener('click', () => {
                    handleSubmitFeedback(recordNumber, feedbackText.value);
                });
            }
        } else {
            eventFormDisplay.innerHTML = '<p>Event form not found.</p>';
        }
    }

    function handleSubmitFeedback(recordNumber, feedbackText) {
        // Here you can implement the logic for submitting feedback
        console.log(`Feedback for Form ${recordNumber}: ${feedbackText}`);
        // You might want to send this feedback to a server or update the local data
        alert('Feedback submitted successfully!');
    }
});
