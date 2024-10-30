import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from models import db,Event, MainInformation, FinancialFeedback, TasksAssignment

app = Flask(__name__)
CORS(app) # 允许所有来源访问（不推荐在生产环境中使用）解决阻止跨源请求（CORS）问题
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'events.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


@app.route('/api/events', methods=['POST'])
def add_event():
    data = request.get_json()
    
    # 提取前端数据
    title = data.get('title', 'Unavailable')  # 如果没有提供标题，使用默认标题
    client_name = data.get('client_name', 'Unavailable')
    event_type = data.get('event_type', 'Unavailable')
    from_date = data.get('from_date', {'year': -1, 'month': -1, 'day': -1})
    to_date = data.get('to_date', {'year': -1, 'month': -1, 'day': -1})
    expected_attendees = data.get('expected_attendees', -1)
    expected_budget = data.get('expected_budget', -1)

    # 偏好设置
    preferences = data.get('preferences', {})
    decoration = preferences.get('decoration', False)
    parties = preferences.get('parties', False)
    photos_videos = preferences.get('photos_videos', False)
    foods = preferences.get('foods', False)
    drinks = preferences.get('drinks', False)

    # 设置事件的状态和审批阶段
    status = '00'  # Submitted 00
    approval_stage = '01'  # Senior Customer Service 01

    # 创建新的事件实例
    new_event = Event(title=title, status=status, approval_stage=approval_stage)
    db.session.add(new_event)
    db.session.commit()  # 提交以生成唯一的 Event ID

    # 创建 MainInformation 实例并关联到事件
    main_info = MainInformation(
        client_name=client_name,
        event_type=event_type,
        from_date_year=from_date['year'],
        from_date_month=from_date['month'],
        from_date_day=from_date['day'],
        to_date_year=to_date['year'],
        to_date_month=to_date['month'],
        to_date_day=to_date['day'],
        expected_attendees=expected_attendees,
        expected_budget=expected_budget,
        decoration_preference=decoration,
        parties_preference=parties,
        photos_videos_preference=photos_videos,
        foods_preference=foods,
        drinks_preference=drinks
    )
    
    # 将 main_info 关联到事件
    new_event.main_information = main_info
    
    # 将 MainInformation 对象添加到数据库
    db.session.add(main_info)
    db.session.commit()

    # 返回响应，包含新创建的事件 ID 和其他信息
    return jsonify({
        'message': f'Event {new_event.title} created successfully',
        'event_id': new_event.id,
        'status': new_event.status,
        'approval_stage': new_event.approval_stage
    }), 201



@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event_details(event_id):
    # 查找对应的 Event 对象
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404

    # 查找关联的子类信息
    main_info = event.main_information
    financial_feedback = event.financial_feedback
    tasks_assignment = event.tasks_assignment

    # 组织返回的数据
    event_details = {
        "id": event.id,
        "title": event.title,
        "status": event.status,
        "approval_stage": event.approval_stage,
        "main_information": {
            "client_name": main_info.client_name if main_info else "N/A",
            "event_type": main_info.event_type if main_info else "N/A",
            "from_date": {
                "year": main_info.from_date_year if main_info else -1,
                "month": main_info.from_date_month if main_info else -1,
                "day": main_info.from_date_day if main_info else -1
            },
            "to_date": {
                "year": main_info.to_date_year if main_info else -1,
                "month": main_info.to_date_month if main_info else -1,
                "day": main_info.to_date_day if main_info else -1
            },
            "expected_attendees": main_info.expected_attendees if main_info else -1,
            "expected_budget": main_info.expected_budget if main_info else -1,
            "preferences": {
                "decoration": main_info.decoration_preference if main_info else False,
                "parties": main_info.parties_preference if main_info else False,
                "photos_videos": main_info.photos_videos_preference if main_info else False,
                "foods": main_info.foods_preference if main_info else False,
                "drinks": main_info.drinks_preference if main_info else False
            }
        },
        "financial_feedback": {
            "review": financial_feedback.review if financial_feedback else "N/A",
        },
        "tasks_assignment": {
            "task_id": tasks_assignment.id if tasks_assignment else None,
            "title": tasks_assignment.title if tasks_assignment else "N/A",
            "due_date": {
                "year": tasks_assignment.due_date_year if tasks_assignment else None,
                "month": tasks_assignment.due_date_month if tasks_assignment else None,
                "day": tasks_assignment.due_date_day if tasks_assignment else None
            },
            "assignee": tasks_assignment.assignee if tasks_assignment else "N/A",
            "department": tasks_assignment.department if tasks_assignment else "N/A",
            "description": tasks_assignment.description if tasks_assignment else "N/A",
            "status": tasks_assignment.status if tasks_assignment else "N/A",
            "detail_plan": tasks_assignment.detail_plan if tasks_assignment else "N/A",
            "need_more_money": tasks_assignment.need_more_money if tasks_assignment else False,
            "amount": tasks_assignment.amount if tasks_assignment else None,
            "reason": tasks_assignment.reason if tasks_assignment else "N/A"
        }
    }

    # 返回事件详情的 JSON 响应
    return jsonify(event_details), 200



@app.route('/api/events/<int:event_id>/update_stage', methods=['PUT'])
def update_event(event_id):
    # 查找对应的 Event 对象
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404

    # 当前的审批阶段
    current_stage = event.approval_stage

    # 定义阶段转换的逻辑
    stage_transitions = {
        "01": "02", #Senior Customer Service - Financial Manager
        "02": "03", #Financial Manager - Administration Manager
        "03": "04", #Administration Manager - Business Meeting(Senior Customer Service)
        "04": "05"  #Business Meeting - Assign Task(Production Manager)
    }

    # 判断是否有下一个阶段
    if current_stage in stage_transitions:
        new_stage = stage_transitions[current_stage]
        event.approval_stage = new_stage
        
        #审批开始后更新事件状态为Under Review
        if event.approval_stage == "02":
            event.status = "01"

        #审批完成后更新事件状态为Approved
        if event.approval_stage == "05":
            event.status = "11"

        db.session.commit()
        return jsonify({
            'message': f'Event {event.id} approval stage updated successfully',
            'event_id': event.id,
            'new_approval_stage': new_stage
        }), 200
    elif current_stage == "05":
        return jsonify({
            'message': f'Event {event.id} is waiting for assignment.',
            'event_id': event.id,
            'current_approval_stage': current_stage
        }), 400
    else:
        return jsonify({
            'error': f'Invalid or unrecognized approval stage: {current_stage}'
        }), 400



@app.route('/api/events/<int:event_id>/financial_review', methods=['POST'])
def financial_review(event_id):
    # 获取前端发送的数据
    data = request.get_json()
    review_content = data.get('review')

    if not review_content:
        return jsonify({'error': 'Review content and date are required'}), 400

    # 查找对应的 Event 对象
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404

    # 查找或创建 FinancialFeedback 对象
    if event.financial_feedback:
        financial_feedback = event.financial_feedback
        financial_feedback.review = review_content
    else:
        financial_feedback = FinancialFeedback(
            review=review_content,
        )
        event.financial_feedback = financial_feedback
        db.session.add(financial_feedback)

    # 提交更改
    db.session.commit()

    # 调用 update_event 函数更新审批阶段
    update_event(event_id)

    return jsonify({
        'message': f'Financial review added for event {event.id} and approval stage updated.',
        'event_id': event.id,
        'financial_review': review_content,
        'new_approval_stage': event.approval_stage
    }), 200



@app.route('/api/events/<int:event_id>/reject', methods=['PUT'])
def reject_event(event_id):
    # 查找对应的 Event 对象
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404

    # 将事件的状态设置为 '10' (Rejected)
    event.status = '10'
    db.session.commit()

    return jsonify({
        'message': f'Event {event.id} has been rejected',
        'event_id': event.id,
        'new_status': event.status
    }), 200

@app.route('/api/events/<int:event_id>/delete', methods=['DELETE'])
def delete_event(event_id):
    # 查找对应的 Event 对象
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404

    # 删除事件
    db.session.delete(event)
    db.session.commit()

    return jsonify({
        'message': f'Event {event.id} has been deleted successfully',
        'event_id': event.id
    }), 200



# 重置数据库 有bug但能用
@app.route('/reset_database', methods=['POST'])
def reset_database():
    with app.app_context():
        # 删除所有事件
        MainInformation.query.delete()
        FinancialFeedback.query.delete()
        TasksAssignment.query.delete()
        Event.query.delete()
        db.session.commit()

        # 重置自增 ID
        db.engine.execute("DELETE FROM sqlite_sequence WHERE name='events'")
        db.session.commit()

    return jsonify({"message": "Database reset successfully"}), 200




@app.route('/api/events/<int:event_id>/assign_task', methods=['POST'])
def assign_task(event_id):
    # 获取前端发送的数据
    data = request.get_json()
    title = data.get('title')
    assignee = data.get('assignee')
    department = data.get('department')
    budget = data.get('budget')
    description = data.get('description')

    # 检查是否所有必需字段都存在
    if not title or not assignee or not department or budget is None or not description:
        return jsonify({'error': 'All fields are required'}), 400

    # 查找对应的 Event 对象
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404
    event.approval_stage = '06'  # 05-06 Production Manager(Assign Task) - Subteam (Respond Task)

    # 查找或创建 TasksAssignment 对象
    if event.tasks_assignment:
        task = event.tasks_assignment
        task.title = title
        task.assignee = assignee
        task.department = department
        task.budget = budget
        task.description = description
        task.status = '00'  # 设置任务状态为 "00"
    else:
        task = TasksAssignment(
            title=title,
            assignee=assignee,
            department=department,
            budget=budget,
            description=description,
            status='00'  # 设置任务状态为 "00"
        )
        event.tasks_assignment = task
        db.session.add(task)


    # 提交更改
    db.session.commit()

    return jsonify({
        'message': f'Task assigned for event {event.id}',
        'event_id': event.id,
        'task_title': task.title,
        'status': task.status
    }), 200



@app.route('/api/events/<int:event_id>/response_task', methods=['POST'])
def response_task(event_id):
    # 获取前端发送的数据
    data = request.get_json()
    detail_plan = data.get('detail_plan')
    need_more_money = data.get('need_more_money')
    amount = data.get('amount')
    reason = data.get('reason')

    # 检查是否有必需字段
    if detail_plan is None or need_more_money is None:
        return jsonify({'error': 'Detail plan and need_more_money are required'}), 400

    # 查找对应的 Event 对象
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404
    event.approval_stage = '07'  # 06-07 Subteam (Respond Task) - Production Manager(Review Task)

    # 查找或更新 TasksAssignment 对象
    if event.tasks_assignment:
        task = event.tasks_assignment
        task.detail_plan = detail_plan
        task.need_more_money = need_more_money
        task.status = '01'  # 设置任务状态为 "01" Recevied

        if need_more_money:
            if amount is None or not reason:
                return jsonify({'error': 'Amount and reason are required when need_more_money is true'}), 400
            task.amount = amount
            task.reason = reason
        else:
            task.amount = -1
            task.reason = "unavailable"
    else:
        return jsonify({'error': 'TasksAssignment not found for this event'}), 404

    # 提交更改
    db.session.commit()

    return jsonify({
        'message': f'Task response updated for event {event.id}',
        'event_id': event.id,
        'detail_plan': task.detail_plan,
        'need_more_money': task.need_more_money,
        'amount': task.amount,
        'reason': task.reason
    }), 200



@app.route('/api/events/<int:event_id>/approve_task', methods=['PUT'])
def approve_task(event_id):
    # 查找指定 Event 的 Task Assignment
    event = Event.query.get(event_id)
    if not event or not event.tasks_assignment:
        return jsonify({'error': 'Event or TaskAssignment not found'}), 404
    
    # 根据 need_more_money 值更新 approval_stage
    if event.task_assignment.need_more_money:
        event.approval_stage = "08"  # 如果需要更多资金，设置为 08
    else:
        event.approval_stage = "09"  # 如果不需要更多资金，设置为 09    

    # 更新 TaskAssignment 状态
    event.tasks_assignment.status = '11'  # 设置状态为 "11" Approval
    db.session.commit()

    return jsonify({
        'message': f'Task for event {event_id} approved successfully',
        'event_id': event_id,
        'task_status': event.tasks_assignment.status
    }), 200



@app.route('/api/events/<int:event_id>/reject_task', methods=['PUT'])
def reject_task(event_id):
    # 查找指定 Event 的 Task Assignment
    event = Event.query.get(event_id)
    if not event or not event.tasks_assignment:
        return jsonify({'error': 'Event or TaskAssignment not found'}), 404

    # 更新 TaskAssignment 状态
    event.status = '10'  # 设置event状态为 "10" Rejected
    event.tasks_assignment.status = '10'  # 设置task状态为 "10" Rejected
    db.session.commit()

    return jsonify({
        'message': f'Task for event {event_id} rejected successfully',
        'event_id': event_id,
        'task_status': event.tasks_assignment.status
    }), 200

@app.route('/api/events/<int:event_id>/assignment_done', methods=['PUT'])
def assignment_done(event_id):
    # 查找指定 Event 的 Task Assignment
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event or TaskAssignment not found'}), 404

    # 更新 TaskAssignment 状态
    event.approval_stage = '06'  # 分配任务至Subteam
    db.session.commit()

    return jsonify({
        'message': f'Task for event {event_id} rejected successfully',
        'event_id': event_id,
        'task_status': event.tasks_assignment.status
    }), 200

# 请求查找01 SeniorCustomer需要处理的Request
@app.route('/api/events/senior_customer_request', methods=['GET'])
def get_SeniorCustomerRequest():
    # 查询所有 approval_stage 为 "01" 的事件，包含 id 和 status 字段
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="01").all()

    # 构建包含事件 ID 和 status 的列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_01_event_ids': event_ids
    }), 200

# 请求查找02 Financial Manager需要处理的Request
@app.route('/api/events/financial_manager_request', methods=['GET'])
def get_FinancialManagerRequest():
    # 查询所有 approval_stage 为 "02" 的事件
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="02").all()

    # 提取事件 ID 列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_02_event_ids': event_ids
    }), 200

# 请求查找03 Administration Manager需要处理的Request
@app.route('/api/events/administration_manager_request', methods=['GET'])
def get_AdministrationManagerRequest():
    # 查询所有 approval_stage 为 "03" 的事件
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="03").all()

    # 提取事件 ID 列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_03_event_ids': event_ids
    }), 200

# 请求查找04 Business Meeting需要处理的Request
@app.route('/api/events/business_meeting_request', methods=['GET'])
def get_BusinessMeetingRequest():
    # 查询所有 approval_stage 为 "04" 的事件
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="04").all()

    # 提取事件 ID 列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_04_event_ids': event_ids
    }), 200

# 请求查找05 Production Manager需要处理的Request
@app.route('/api/events/production_manager_request', methods=['GET'])
def get_ProductionManagerRequest():
    # 查询所有 approval_stage 为 "05" 的事件
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="05").all()

    # 提取事件 ID 列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_05_event_ids': event_ids
    }), 200

# 请求查找07 Production Manager需要处理的Plan Review
@app.route('/api/events/plan_review', methods=['GET'])
def get_PlanReview():
    # 查询所有 approval_stage 为 "07" 的事件
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="07").all()

    # 提取事件 ID 列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_07_event_ids': event_ids
    }), 200

# 请求查找08 Financial Increase需要处理的Request
@app.route('/api/events/financial_increase_request', methods=['GET'])
def get_FinancialIncreaseRequest():
    # 查询所有 approval_stage 为 "08" 的事件
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="08").all()

    # 提取事件 ID 列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_08_event_ids': event_ids
    }), 200

# 请求查找09 Done Request
@app.route('/api/events/done', methods=['GET'])
def get_DoneRequest():
    # 查询所有 approval_stage 为 "09" 的事件
    events = Event.query.with_entities(Event.id, Event.status).filter_by(approval_stage="09").all()

    # 提取事件 ID 列表
    event_ids = [{"id": event.id, "status": event.status} for event in events]

    return jsonify({
        'approval_stage_09_event_ids': event_ids
    }), 200

@app.route('/api/events/<int:event_id>/review_plan', methods=['PUT'])


@app.route('/')
def home():
    # 获取事件总数
    event_count = Event.query.count()

    # 获取所有事件的主要信息，包括日期
    events = db.session.query(
        Event.id,
        Event.title,
        Event.status,
        Event.approval_stage,
    ).join(MainInformation, Event.id == MainInformation.id).all()

    # 渲染模板并传递数据
    return render_template('home.html', event_count=event_count, events=events)

# 运行应用
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # 创建所有表
    app.run(debug=True)