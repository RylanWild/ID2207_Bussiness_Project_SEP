from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 主类 Event
class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)  # Event ID
    title = db.Column(db.String(80), nullable=False, default="Unavailable")  # Title
    status = db.Column(db.String(2), nullable=False, default='-1')  # Status (00, 01, 10, 11)
    approval_stage = db.Column(db.String(2), nullable=False, default="00")  # Approval stage

    # 关联子类的外键
    main_info_id = db.Column(db.Integer, db.ForeignKey('main_information.id'))
    financial_feedback_id = db.Column(db.Integer, db.ForeignKey('financial_feedback.id'))
    tasks_assignment_id = db.Column(db.Integer, db.ForeignKey('tasks_assignment.id'))

    # 定义关系
    main_information = db.relationship('MainInformation', backref='event', lazy=True)
    financial_feedback = db.relationship('FinancialFeedback', backref='event', lazy=True)
    tasks_assignment = db.relationship('TasksAssignment', backref='event', lazy=True)

    def __repr__(self):
        return f"<Event {self.id} - {self.title} - Status: {self.status}>"

# 子类 1: Main Information
class MainInformation(db.Model):
    __tablename__ = 'main_information'
    id = db.Column(db.Integer, primary_key=True)  # Info ID

    client_name = db.Column(db.String(30), nullable=False, default="Unavailable")  # 客户名称
    event_type = db.Column(db.String(30), nullable=False, default="Unavailable")  # 事件类型

    # 日期范围
    from_date_year = db.Column(db.Integer, nullable=False, default=-1)  # 开始日期 - 年
    from_date_month = db.Column(db.Integer, nullable=False, default=-1)  # 开始日期 - 月
    from_date_day = db.Column(db.Integer, nullable=False, default=-1)  # 开始日期 - 日
    to_date_year = db.Column(db.Integer, nullable=False, default=-1)  # 结束日期 - 年
    to_date_month = db.Column(db.Integer, nullable=False, default=-1)  # 结束日期 - 月
    to_date_day = db.Column(db.Integer, nullable=False, default=-1)  # 结束日期 - 日

    expected_attendees = db.Column(db.Integer, nullable=False, default=-1)  # 预计参与人数
    expected_budget = db.Column(db.Integer, nullable=False, default=-1)  # 预计预算

    # 偏好设置
    decoration_preference = db.Column(db.Boolean, nullable=False, default=False)  # 装饰偏好
    parties_preference = db.Column(db.Boolean, nullable=False, default=False)  # 聚会偏好
    photos_videos_preference = db.Column(db.Boolean, nullable=False, default=False)  # 照片/视频偏好
    foods_preference = db.Column(db.Boolean, nullable=False, default=False)  # 食物偏好
    drinks_preference = db.Column(db.Boolean, nullable=False, default=False)  # 饮料偏好

    def __repr__(self):
        return f"<MainInformation {self.client_name} - {self.event_type}>"

# 子类 2: Financial Feedback
class FinancialFeedback(db.Model):
    __tablename__ = 'financial_feedback'
    id = db.Column(db.Integer, primary_key=True)  # Review ID

    review = db.Column(db.String(255), nullable=False, default="unavailable")  # 反馈内容
    date_year = db.Column(db.Integer, nullable=False, default=-1)  # 反馈日期 - 年
    date_month = db.Column(db.Integer, nullable=False, default=-1)  # 反馈日期 - 月
    date_day = db.Column(db.Integer, nullable=False, default=-1)  # 反馈日期 - 日

    def __repr__(self):
        return f"<FinancialFeedback {self.review} on {self.date_year}-{self.date_month}-{self.date_day}>"

# 子类 3: Tasks Assignment
class TasksAssignment(db.Model):
    __tablename__ = 'tasks_assignment'
    id = db.Column(db.Integer, primary_key=True)  # Task ID

    title = db.Column(db.String(100), nullable=False)  # 任务标题
    assignee = db.Column(db.String(25), nullable=False)  # 负责人
    department = db.Column(db.String(25), nullable=False)  # 部门
    budget = db.Column(db.Integer, nullable=False, default=-1)  # 预算
    description = db.Column(db.String(255), nullable=True, default="unavailable")  # 描述
    status = db.Column(db.String(2), nullable=False, default="00")  # 任务状态 (00 Waiting 01 Received 10 Reject 11 Approval)

    detail_plan = db.Column(db.String(255), nullable=True, default="unavailable")  # 详细计划
    need_more_money = db.Column(db.Boolean, nullable=False, default=False)  # 是否需要额外资金
    amount = db.Column(db.Integer, nullable=True, default=-1)  # 需要的资金金额
    reason = db.Column(db.String(255), nullable=True, default="unavailable")  # 申请额外资金的理由
    financial_request_stage = db.Column(db.String(2), nullable=False, default="00")   # 申请额外资金的审批部门 (00 Production 01 Financial)
    financial_request_status = db.Column(db.String(2), nullable=False, default="00")  # 申请额外资金的任务状态 (00 Submited 01 Under Review 10 Approval 11 Reject)

    def __repr__(self):
        return f"<TasksAssignment {self.title} - Due: {self.due_date_year}-{self.due_date_month}-{self.due_date_day}>"
    

