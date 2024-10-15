document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-header');
    const taskItems = document.querySelectorAll('.task-item');
    const taskDisplay = document.getElementById('taskDisplay');

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

    taskItems.forEach(item => {
        item.addEventListener('click', function() {
            const recordNumber = this.getAttribute('data-record');
            displayTaskDetails(recordNumber);
        });
    });

    function displayTaskDetails(recordNumber) {
        const tasks = {
            '001': {
                title: 'Wedding Service',
                client: 'John & Sarah Smith',
                date: '2023-08-15',
                description: 'Full day wedding service',
                status: 'Pending'
            },
            '002': {
                title: 'Corporate Event Service',
                client: 'Tech Innovations Inc.',
                date: '2023-09-10',
                description: 'Half day corporate event service',
                status: 'Pending'
            },
            '003': {
                title: 'Birthday Party Service',
                client: 'Emily Johnson',
                date: '2023-07-20',
                description: 'Evening birthday party service',
                status: 'Completed'
            }
        };

        const task = tasks[recordNumber];
        if (task) {
            let taskHtml = `
                <h3>${task.title}</h3>
                <p><strong>Client:</strong> ${task.client}</p>
                <p><strong>Date:</strong> ${task.date}</p>
                <p><strong>Description:</strong> ${task.description}</p>
                <p><strong>Status:</strong> ${task.status}</p>
            `;

            if (task.status === 'Pending') {
                taskHtml += `
                    <button class="action-btn" onclick="showDetailedPlanForm('${recordNumber}')">Receive</button>
                `;
            }

            taskDisplay.innerHTML = taskHtml;
        } else {
            taskDisplay.innerHTML = '<p>Task not found.</p>';
        }
    }

    window.showDetailedPlanForm = function(recordNumber) {
        const formHtml = `
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
            <button onclick="submitDetailedPlan('${recordNumber}')">Submit</button>
        `;
        taskDisplay.innerHTML += formHtml;
    }

    window.toggleAmountReason = function(show) {
        const container = document.getElementById('amountReasonContainer');
        container.style.display = show ? 'block' : 'none';
    }

    window.submitDetailedPlan = function(recordNumber) {
        const detailedPlan = document.getElementById('detailedPlan').value;
        const needMoney = document.querySelector('input[name="needMoney"]:checked').value;
        let amount = '';
        let reason = '';
        if (needMoney === 'yes') {
            amount = document.getElementById('amount').value;
            reason = document.getElementById('reason').value;
        }
        console.log(`Detailed plan for task ${recordNumber} submitted. Need more money: ${needMoney}`);
        console.log(`Plan: ${detailedPlan}`);
        if (needMoney === 'yes') {
            console.log(`Amount: ${amount}`);
            console.log(`Reason: ${reason}`);
        }
        alert('Detailed plan submitted successfully!');
        // Here you would typically send this data to a server
    }
});
