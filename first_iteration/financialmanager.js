document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-header');
    const formDisplay = document.getElementById('formDisplay');
    const unreviewedContent = document.querySelector('.dropdown-content');
    const reviewedContent = document.querySelectorAll('.dropdown-content')[1];

    // 模拟数据
    const forms = {
        unreviewed: [
            { id: 'EF001', type: 'Event Form', title: 'Wedding', clientName: 'John & Sarah Smith', eventDate: '2023-09-15', expectedBudget: 25000, numberOfGuests: 150, venue: 'Seaside Resort', cateringRequirements: 'Full course meal, vegetarian options' },
            { id: 'EF002', type: 'Event Form', title: 'Corporate Meeting', clientName: 'Tech Innovations Inc.', eventDate: '2023-10-20', expectedBudget: 15000, numberOfGuests: 75, venue: 'Downtown Conference Center', cateringRequirements: 'Breakfast and lunch buffet' },
            { id: 'FR001', type: 'Financial Request', title: 'Budget Increase for Photography', requestingDepartment: 'Production', requestedAmount: 5000, reason: 'Upgrade of camera equipment', projectReference: 'PRJ2023-001', expectedROI: '20% increase in bookings', timeline: 'Immediate' },
            { id: 'FR002', type: 'Financial Request', title: 'New Equipment Purchase', requestingDepartment: 'Service', requestedAmount: 10000, reason: 'Replacement of outdated catering equipment', projectReference: 'PRJ2023-002', expectedROI: '15% reduction in food preparation time', timeline: 'Within 3 months' }
        ],
        reviewed: [
            { id: 'EF003', type: 'Event Form', title: 'Birthday Party', clientName: 'Emily Johnson', eventDate: '2023-08-05', expectedBudget: 5000, numberOfGuests: 50, venue: 'City Park', cateringRequirements: 'Finger food and birthday cake' },
            { id: 'FR003', type: 'Financial Request', title: 'Staff Training Budget', requestingDepartment: 'HR', requestedAmount: 7500, reason: 'Customer service improvement program', projectReference: 'PRJ2023-003', expectedROI: '10% increase in customer satisfaction scores', timeline: 'Q4 2023' }
        ]
    };

    function displayForms() {
        unreviewedContent.innerHTML = forms.unreviewed.map(form => `
            <div class="form-item" data-id="${form.id}">
                <div class="form-number">${form.type} #${form.id}</div>
                <div class="form-title">${form.title}</div>
            </div>
        `).join('');

        reviewedContent.innerHTML = forms.reviewed.map(form => `
            <div class="form-item" data-id="${form.id}">
                <div class="form-number">${form.type} #${form.id}</div>
                <div class="form-title">${form.title}</div>
            </div>
        `).join('');

        // 为每个表单项添加点击事件
        document.querySelectorAll('.form-item').forEach(item => {
            item.addEventListener('click', () => displayFormDetails(item.dataset.id));
        });
    }

    function displayFormDetails(formId) {
        const form = [...forms.unreviewed, ...forms.reviewed].find(f => f.id === formId);
        if (form) {
            let formHtml = `
                <h3>${form.type} - ${form.title}</h3>
                <p><strong>Form ID:</strong> ${form.id}</p>
            `;

            if (form.type === 'Event Form') {
                formHtml += `
                    <p><strong>Client Name:</strong> ${form.clientName || 'N/A'}</p>
                    <p><strong>Event Date:</strong> ${form.eventDate || 'N/A'}</p>
                    <p><strong>Expected Budget:</strong> $${form.expectedBudget || 'N/A'}</p>
                    <p><strong>Number of Guests:</strong> ${form.numberOfGuests || 'N/A'}</p>
                    <p><strong>Venue:</strong> ${form.venue || 'N/A'}</p>
                    <p><strong>Catering Requirements:</strong> ${form.cateringRequirements || 'N/A'}</p>
                `;
            } else if (form.type === 'Financial Request') {
                formHtml += `
                    <p><strong>Requesting Department:</strong> ${form.requestingDepartment || 'N/A'}</p>
                    <p><strong>Requested Amount:</strong> $${form.requestedAmount || 'N/A'}</p>
                    <p><strong>Reason:</strong> ${form.reason || 'N/A'}</p>
                    <p><strong>Project Reference:</strong> ${form.projectReference || 'N/A'}</p>
                    <p><strong>Expected ROI:</strong> ${form.expectedROI || 'N/A'}</p>
                    <p><strong>Timeline:</strong> ${form.timeline || 'N/A'}</p>
                `;
            }

            if (!forms.reviewed.some(f => f.id === formId)) {
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

            formDisplay.innerHTML = formHtml;

            // 添加反馈功能
            const writeFeedbackBtn = formDisplay.querySelector('.write-feedback-btn');
            const feedbackContainer = formDisplay.querySelector('.feedback-container');
            const submitFeedbackBtn = formDisplay.querySelector('.submit-feedback-btn');
            const feedbackText = formDisplay.querySelector('#feedbackText');

            if (writeFeedbackBtn && feedbackContainer && submitFeedbackBtn && feedbackText) {
                writeFeedbackBtn.addEventListener('click', () => {
                    feedbackContainer.style.display = 'block';
                    writeFeedbackBtn.style.display = 'none';
                });

                feedbackText.addEventListener('input', () => {
                    submitFeedbackBtn.disabled = feedbackText.value.trim() === '';
                });

                submitFeedbackBtn.addEventListener('click', () => {
                    handleSubmitFeedback(formId, feedbackText.value);
                });
            }
        } else {
            formDisplay.innerHTML = '<p>Form not found.</p>';
        }
    }

    function handleSubmitFeedback(formId, feedbackText) {
        console.log(`Feedback for Form ${formId}: ${feedbackText}`);
        alert('Feedback submitted successfully!');
        // 这里可以添加将表单移动到 Reviewed 部分的逻辑
    }

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            this.classList.toggle('active');
            const dropdownContent = this.nextElementSibling;
            dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
        });
    });

    // 初始化显示表单
    displayForms();
});
