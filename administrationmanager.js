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
                status: 'Unreviewed',
                financialManagerFeedback: 'The budget seems reasonable for a wedding of this size. However, we might need to allocate more funds for the decoration as per client preferences.'
            },
            '002': {
                clientName: 'Tech Innovations Inc.',
                eventType: 'Corporate Meeting',
                fromDate: '2023-09-10',
                toDate: '2023-09-11',
                expectedNumAttendees: 75,
                expectedBudget: 15000,
                preferences: ['Meals', 'Drinks'],
                status: 'Unreviewed',
                financialManagerFeedback: 'The budget is appropriate for a corporate meeting of this scale. We should focus on high-quality catering services as per client preferences.'
            },
            '003': {
                clientName: 'Emily Johnson',
                eventType: 'Birthday Party',
                fromDate: '2023-07-20',
                toDate: '2023-07-20',
                expectedNumAttendees: 50,
                expectedBudget: 5000,
                preferences: ['Decoration', 'Meals', 'Drinks'],
                status: 'Reviewed',
                financialManagerFeedback: 'The budget is tight considering the number of attendees and preferences. We might need to suggest some cost-saving options to the client.'
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
                <div class="financial-feedback">
                    <h4>Feedback from Financial Manager:</h4>
                    <p>${form.financialManagerFeedback}</p>
                </div>
            `;

            if (form.status === 'Unreviewed') {
                formHtml += `
                    <div class="form-actions">
                        <button class="approve-btn">Approve</button>
                        <button class="reject-btn">Reject</button>
                    </div>
                `;
            }

            eventFormDisplay.innerHTML = formHtml;

            // Add event listeners to the buttons
            const approveBtn = eventFormDisplay.querySelector('.approve-btn');
            const rejectBtn = eventFormDisplay.querySelector('.reject-btn');

            if (approveBtn && rejectBtn) {
                approveBtn.addEventListener('click', () => handleFormAction(recordNumber, 'approve'));
                rejectBtn.addEventListener('click', () => handleFormAction(recordNumber, 'reject'));
            }
        } else {
            eventFormDisplay.innerHTML = '<p>Event form not found.</p>';
        }
    }

    function handleFormAction(recordNumber, action) {
        // Here you can implement the logic for approving or rejecting the form
        console.log(`Form ${recordNumber} ${action}ed`);
        // You might want to update the form status, move it to the Reviewed section, etc.
        alert(`Form ${recordNumber} has been ${action}ed.`);
    }
});
