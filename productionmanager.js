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
                status: 'Inbox',
                detailedPlan: 'We will need to set up a professional photography studio on-site. This will require additional lighting equipment and backdrops.',
                needMoreMoney: true,
                additionalAmount: 2000,
                reason: 'The client has requested a more elaborate photo setup than initially planned.'
            },
            '002': {
                clientName: 'Tech Innovations Inc.',
                eventType: 'Corporate Meeting',
                fromDate: '2023-09-10',
                toDate: '2023-09-11',
                expectedNumAttendees: 75,
                expectedBudget: 15000,
                preferences: ['Meals', 'Drinks'],
                status: 'Inbox',
                detailedPlan: 'Standard corporate event photography setup will be sufficient. We will focus on capturing key moments and group photos.',
                needMoreMoney: false
            },
            '003': {
                clientName: 'Emily Johnson',
                eventType: 'Birthday Party',
                fromDate: '2023-07-20',
                toDate: '2023-07-20',
                expectedNumAttendees: 50,
                expectedBudget: 5000,
                preferences: ['Decoration', 'Meals', 'Drinks'],
                status: 'Sent'
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

            if (form.status === 'Inbox' && form.detailedPlan) {
                formHtml += `
                    <div class="detailed-plan">
                        <h4>Detailed Plan from Photography Team:</h4>
                        <p>${form.detailedPlan}</p>
                        <p><strong>Needs More Money:</strong> ${form.needMoreMoney ? 'Yes' : 'No'}</p>
                    `;
                
                if (form.needMoreMoney) {
                    formHtml += `
                        <p><strong>Additional Amount Requested:</strong> $${form.additionalAmount}</p>
                        <p><strong>Reason:</strong> ${form.reason}</p>
                    `;
                }

                formHtml += `</div>`;
            }

            if (form.status === 'Inbox') {
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
        console.log(`Form ${recordNumber} ${action}ed`);
        alert(`Form ${recordNumber} has been ${action}ed.`);
    }

    // 处理 "+ New" 按钮的点击事件
    const newBtn = document.querySelector('.new-btn');
    if (newBtn) {
        newBtn.addEventListener('click', function() {
            displayNewForm();
        });
    }

    function displayNewForm() {
        const formHtml = `
            <h3>New Client Request Form - Production Department</h3>
            <form id="newClientRequestForm">
                <div class="form-group">
                    <label for="recordNumber">Record Number:</label>
                    <input type="text" id="recordNumber" name="recordNumber" required>
                </div>
                <div class="form-group">
                    <label for="clientName">Client Name:</label>
                    <input type="text" id="clientName" name="clientName" required>
                </div>
                <div class="form-group">
                    <label for="eventType">Event Type:</label>
                    <input type="text" id="eventType" name="eventType" required>
                </div>
                <div class="form-group">
                    <label for="fromDate">From Date:</label>
                    <input type="date" id="fromDate" name="fromDate" required>
                </div>
                <div class="form-group">
                    <label for="toDate">To Date:</label>
                    <input type="date" id="toDate" name="toDate" required>
                </div>
                <div class="form-group">
                    <label for="expectedAttendees">Expected Number of Attendees:</label>
                    <input type="number" id="expectedAttendees" name="expectedAttendees" required>
                </div>
                <div class="form-group">
                    <label for="expectedBudget">Expected Budget:</label>
                    <input type="number" id="expectedBudget" name="expectedBudget" required>
                </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" name="description" rows="4" required></textarea>
                </div>
                <div class="department-budget-container">
                    <div class="department-budget">
                        <label for="photography">Photography:</label>
                        <textarea id="photography" name="photography" rows="3"></textarea>
                        <div class="budget-input">
                            <label for="photographyBudget">Budget:</label>
                            <input type="number" id="photographyBudget" name="photographyBudget">
                        </div>
                    </div>
                </div>
                <div class="department-budget-container">
                    <div class="department-budget">
                        <label for="music">Music:</label>
                        <textarea id="music" name="music" rows="3"></textarea>
                        <div class="budget-input">
                            <label for="musicBudget">Budget:</label>
                            <input type="number" id="musicBudget" name="musicBudget">
                        </div>
                    </div>
                </div>
                <div class="department-budget-container">
                    <div class="department-budget">
                        <label for="graphicDesign">Graphic Design:</label>
                        <textarea id="graphicDesign" name="graphicDesign" rows="3"></textarea>
                        <div class="budget-input">
                            <label for="graphicDesignBudget">Budget:</label>
                            <input type="number" id="graphicDesignBudget" name="graphicDesignBudget">
                        </div>
                    </div>
                </div>
                <div class="department-budget-container">
                    <div class="department-budget">
                        <label for="decoration">Decoration:</label>
                        <textarea id="decoration" name="decoration" rows="3"></textarea>
                        <div class="budget-input">
                            <label for="decorationBudget">Budget:</label>
                            <input type="number" id="decorationBudget" name="decorationBudget">
                        </div>
                    </div>
                </div>
                <div class="department-budget-container">
                    <div class="department-budget">
                        <label for="networkSupport">Network Support:</label>
                        <textarea id="networkSupport" name="networkSupport" rows="3"></textarea>
                        <div class="budget-input">
                            <label for="networkSupportBudget">Budget:</label>
                            <input type="number" id="networkSupportBudget" name="networkSupportBudget">
                        </div>
                    </div>
                </div>
                <button type="submit" class="submit-btn">Send</button>
            </form>
        `;

        const eventFormDisplay = document.getElementById('eventFormDisplay');
        eventFormDisplay.innerHTML = formHtml;

        // 添加表单提交事件监听器
        const form = document.getElementById('newClientRequestForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单提交的逻辑
            console.log('Form sent');
            alert('Form sent successfully!');
        });
    }
});
