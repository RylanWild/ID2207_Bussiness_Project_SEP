document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-header');
    const eventFormDisplay = document.getElementById('eventFormDisplay');
    const newBtn = document.querySelector('.new-btn');
    const dropdownContent = document.querySelector('.top-bar .dropdown-content');
    const clientRequestFormBtn = document.getElementById('clientRequestForm');
    const recruitmentRequestFormBtn = document.getElementById('recruitmentRequestForm');
    const financialRequestFormBtn = document.getElementById('financialRequestForm');

    // 模拟收到的各种请求
    const inboxItems = [
        { id: 'EF001', type: 'Event Form', title: 'Wedding' },
        { id: 'EF002', type: 'Event Form', title: 'Corporate Meeting' },
        { id: 'FR001', type: 'Financial Request', title: 'Budget Increase' },
        { id: 'RR001', type: 'Recruitment Request', title: 'New Waiter Position' }
    ];

    const sentItems = [
        { id: 'EF003', type: 'Event Form', title: 'Birthday Party' },
        { id: 'FR002', type: 'Financial Request', title: 'Equipment Purchase' }
    ];

    function displayInboxItems() {
        const inboxContent = document.querySelector('.sidebar .dropdown-content');
        inboxContent.innerHTML = inboxItems.map(item => `
            <div class="event-item" data-record="${item.id}">
                <div class="record-number">${item.type} #${item.id.slice(-3)}</div>
                <div class="event-type">${item.title}</div>
            </div>
        `).join('');

        const sentContent = document.querySelectorAll('.sidebar .dropdown-content')[1];
        sentContent.innerHTML = sentItems.map(item => `
            <div class="event-item" data-record="${item.id}">
                <div class="record-number">${item.type} #${item.id.slice(-3)}</div>
                <div class="event-type">${item.title}</div>
            </div>
        `).join('');

        // 为每个请求项添加点击事件
        document.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', () => displayItemDetails(item.dataset.record));
        });
    }

    function displayItemDetails(itemId) {
        // 这里添加显示详细信息的逻辑
        console.log(`Displaying details for item ${itemId}`);
        // 可以根据不同的表格类型显示不同的详细信息
    }

    // ... 保留之前的其他代码 ...

    // 初始化显示 Inbox 内容
    displayInboxItems();
});
