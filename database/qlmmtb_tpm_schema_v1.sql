-- =========================================================
-- DATABASE SCHEMA SQL
-- QL MMTB WEB THEO TPM + OEE + DIEN/NUOC + ANNUAL PLAN
-- Version: v1
-- Notes:
-- - Designed for PostgreSQL
-- - Can be adapted to MySQL with minor syntax changes
-- =========================================================

-- =========================================================
-- 1. MASTER TABLES
-- =========================================================

CREATE TABLE departments (
    department_id BIGSERIAL PRIMARY KEY,
    department_code VARCHAR(50) UNIQUE NOT NULL,
    department_name_vi VARCHAR(255) NOT NULL,
    department_name_en VARCHAR(255),
    manager_user_id BIGINT,
    status VARCHAR(30) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name_vi VARCHAR(255) NOT NULL,
    role_name_en VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    permission_id BIGSERIAL PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name_vi VARCHAR(255) NOT NULL,
    permission_name_en VARCHAR(255),
    module_name VARCHAR(100),
    action_name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_permission_id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (role_id, permission_id)
);

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    user_code VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    department_id BIGINT REFERENCES departments(department_id),
    role_id BIGINT REFERENCES roles(role_id),
    language_preference VARCHAR(10) DEFAULT 'vi',
    avatar_url TEXT,
    status VARCHAR(30) DEFAULT 'active',
    last_login_at TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE departments
ADD CONSTRAINT fk_departments_manager_user
FOREIGN KEY (manager_user_id) REFERENCES users(user_id);

CREATE TABLE user_data_scopes (
    scope_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    scope_type VARCHAR(50) NOT NULL, -- factory / area / line / department / equipment
    scope_ref_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_sessions (
    session_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    ip_address VARCHAR(100),
    device_info TEXT,
    token TEXT,
    refresh_token TEXT,
    status VARCHAR(30) DEFAULT 'active'
);

CREATE TABLE login_audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    username VARCHAR(100),
    login_result VARCHAR(30),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100),
    user_agent TEXT,
    fail_reason TEXT
);

CREATE TABLE areas (
    area_id BIGSERIAL PRIMARY KEY,
    area_code VARCHAR(50) UNIQUE NOT NULL,
    area_name_vi VARCHAR(255) NOT NULL,
    area_name_en VARCHAR(255),
    area_type VARCHAR(50), -- factory / workshop / zone / line / utility
    parent_area_id BIGINT REFERENCES areas(area_id),
    factory_name VARCHAR(255),
    department_id BIGINT REFERENCES departments(department_id),
    line_code VARCHAR(50),
    status VARCHAR(30) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment_categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name_vi VARCHAR(255) NOT NULL,
    category_name_en VARCHAR(255),
    notes TEXT,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipments (
    equipment_id BIGSERIAL PRIMARY KEY,
    equipment_code VARCHAR(50) UNIQUE NOT NULL,
    equipment_name_vi VARCHAR(255) NOT NULL,
    equipment_name_en VARCHAR(255),
    category_id BIGINT REFERENCES equipment_categories(category_id),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    manufacturer VARCHAR(255),
    area_id BIGINT REFERENCES areas(area_id),
    line_name VARCHAR(100),
    department_id BIGINT REFERENCES departments(department_id),
    criticality_level VARCHAR(30),
    commission_date DATE,
    status VARCHAR(30) DEFAULT 'active',
    owner_team VARCHAR(255),
    maintenance_team VARCHAR(255),
    standard_run_hours_per_day NUMERIC(10,2),
    power_rated_kw NUMERIC(12,3),
    water_required_flag BOOLEAN DEFAULT FALSE,
    estimated_water_use_per_hour NUMERIC(12,3),
    qr_code VARCHAR(255),
    image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment_hierarchy (
    hierarchy_id BIGSERIAL PRIMARY KEY,
    parent_equipment_id BIGINT NOT NULL REFERENCES equipments(equipment_id) ON DELETE CASCADE,
    child_equipment_id BIGINT NOT NULL REFERENCES equipments(equipment_id) ON DELETE CASCADE,
    component_type VARCHAR(100),
    notes TEXT,
    UNIQUE (parent_equipment_id, child_equipment_id)
);

CREATE TABLE ticket_types (
    ticket_type_id BIGSERIAL PRIMARY KEY,
    ticket_type_code VARCHAR(50) UNIQUE NOT NULL, -- PM/BM/CM/INSP/CAL/OVH/LUBE/UTILITY
    ticket_type_name_vi VARCHAR(255) NOT NULL,
    ticket_type_name_en VARCHAR(255),
    description TEXT,
    status VARCHAR(30) DEFAULT 'active'
);

CREATE TABLE meters (
    meter_id BIGSERIAL PRIMARY KEY,
    meter_code VARCHAR(50) UNIQUE NOT NULL,
    meter_name_vi VARCHAR(255) NOT NULL,
    meter_name_en VARCHAR(255),
    meter_type VARCHAR(30) NOT NULL, -- electric / water
    install_scope VARCHAR(30) NOT NULL, -- area / equipment / line
    area_id BIGINT REFERENCES areas(area_id),
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    serial_number VARCHAR(255),
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    unit VARCHAR(30) NOT NULL, -- kWh / m3
    reading_mode VARCHAR(30), -- manual / auto / import
    multiplier NUMERIC(12,4) DEFAULT 1,
    install_date DATE,
    status VARCHAR(30) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. DOCUMENT MANAGEMENT
-- =========================================================

CREATE TABLE equipment_documents (
    document_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT REFERENCES equipments(equipment_id) ON DELETE CASCADE,
    document_code VARCHAR(100),
    document_name_vi VARCHAR(255) NOT NULL,
    document_name_en VARCHAR(255),
    document_type VARCHAR(100), -- manual / drawing / wiring / catalog / photo / video / report
    version_no VARCHAR(50),
    issue_date DATE,
    effective_date DATE,
    source VARCHAR(255),
    file_name VARCHAR(255),
    file_path TEXT,
    file_size BIGINT,
    file_extension VARCHAR(20),
    uploaded_by BIGINT REFERENCES users(user_id),
    approved_by BIGINT REFERENCES users(user_id),
    approval_status VARCHAR(30) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attachments (
    attachment_id BIGSERIAL PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL,
    ref_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_extension VARCHAR(20),
    uploaded_by BIGINT REFERENCES users(user_id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- =========================================================
-- 3. MAINTENANCE PLANS AND CHECKLISTS
-- =========================================================

CREATE TABLE checklist_templates (
    template_id BIGSERIAL PRIMARY KEY,
    template_name_vi VARCHAR(255) NOT NULL,
    template_name_en VARCHAR(255),
    equipment_category_id BIGINT REFERENCES equipment_categories(category_id),
    maintenance_type VARCHAR(50),
    version_no VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checklist_template_items (
    item_id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL REFERENCES checklist_templates(template_id) ON DELETE CASCADE,
    item_order INT NOT NULL,
    item_name_vi VARCHAR(255) NOT NULL,
    item_name_en VARCHAR(255),
    standard_value VARCHAR(255),
    unit VARCHAR(50),
    inspection_method VARCHAR(255),
    upper_limit NUMERIC(18,4),
    lower_limit NUMERIC(18,4),
    required_photo BOOLEAN DEFAULT FALSE,
    required_comment BOOLEAN DEFAULT FALSE
);

CREATE TABLE maintenance_plans (
    plan_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES equipments(equipment_id) ON DELETE CASCADE,
    plan_type VARCHAR(50), -- routine / periodic / annual
    maintenance_type VARCHAR(50), -- PM / lubrication / calibration / overhaul
    job_name_vi VARCHAR(255) NOT NULL,
    job_name_en VARCHAR(255),
    description_vi TEXT,
    description_en TEXT,
    frequency_value INT NOT NULL,
    frequency_unit VARCHAR(30) NOT NULL, -- day / week / month / quarter / year / run_hour
    estimated_duration_min INT,
    assigned_team VARCHAR(255),
    assigned_person BIGINT REFERENCES users(user_id),
    checklist_template_id BIGINT REFERENCES checklist_templates(template_id),
    last_done_date DATE,
    next_due_date DATE,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE work_orders (
    ticket_id BIGSERIAL PRIMARY KEY,
    ticket_no VARCHAR(100) UNIQUE NOT NULL,
    ticket_type_id BIGINT NOT NULL REFERENCES ticket_types(ticket_type_id),
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    area_id BIGINT REFERENCES areas(area_id),
    plan_id BIGINT REFERENCES maintenance_plans(plan_id),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    downtime_min INT DEFAULT 0,
    symptom TEXT,
    problem_description TEXT,
    root_cause TEXT,
    action_taken TEXT,
    recommendation TEXT,
    priority VARCHAR(30) DEFAULT 'normal',
    status VARCHAR(30) DEFAULT 'open',
    requested_by BIGINT REFERENCES users(user_id),
    assigned_to BIGINT REFERENCES users(user_id),
    verified_by BIGINT REFERENCES users(user_id),
    approved_by BIGINT REFERENCES users(user_id),
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checklist_results (
    result_id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES work_orders(ticket_id) ON DELETE CASCADE,
    template_id BIGINT NOT NULL REFERENCES checklist_templates(template_id),
    item_id BIGINT NOT NULL REFERENCES checklist_template_items(item_id),
    measured_value VARCHAR(255),
    result_status VARCHAR(30), -- pass / fail / warning
    comment TEXT,
    photo_url TEXT,
    checked_by BIGINT REFERENCES users(user_id),
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inspections (
    inspection_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    area_id BIGINT REFERENCES areas(area_id),
    inspection_date TIMESTAMP NOT NULL,
    inspection_type VARCHAR(100),
    parameter_name_vi VARCHAR(255),
    parameter_name_en VARCHAR(255),
    measured_value NUMERIC(18,4),
    unit VARCHAR(50),
    standard_min NUMERIC(18,4),
    standard_max NUMERIC(18,4),
    result_status VARCHAR(30),
    inspector BIGINT REFERENCES users(user_id),
    remark TEXT,
    photo_url TEXT,
    related_ticket_id BIGINT REFERENCES work_orders(ticket_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE downtime_logs (
    downtime_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES equipments(equipment_id),
    ticket_id BIGINT REFERENCES work_orders(ticket_id),
    failure_start_time TIMESTAMP NOT NULL,
    failure_end_time TIMESTAMP,
    downtime_min INT NOT NULL,
    failure_mode VARCHAR(255),
    failure_category VARCHAR(255),
    impact_level VARCHAR(30),
    production_loss NUMERIC(18,4),
    root_cause_group VARCHAR(255),
    temporary_action TEXT,
    permanent_action TEXT,
    is_repeat_failure BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 4. SPARE PARTS
-- =========================================================

CREATE TABLE spare_parts (
    spare_id BIGSERIAL PRIMARY KEY,
    spare_code VARCHAR(100) UNIQUE NOT NULL,
    spare_name_vi VARCHAR(255) NOT NULL,
    spare_name_en VARCHAR(255),
    part_category VARCHAR(100),
    brand VARCHAR(255),
    model VARCHAR(255),
    original_part_no VARCHAR(255),
    alternate_part_no VARCHAR(255),
    specification TEXT,
    unit VARCHAR(30),
    stock_qty NUMERIC(18,4) DEFAULT 0,
    min_qty NUMERIC(18,4) DEFAULT 0,
    max_qty NUMERIC(18,4),
    warehouse_location VARCHAR(255),
    reorder_point NUMERIC(18,4) DEFAULT 0,
    safety_stock NUMERIC(18,4) DEFAULT 0,
    supplier VARCHAR(255),
    lead_time_day INT,
    last_purchase_price NUMERIC(18,2),
    currency VARCHAR(10) DEFAULT 'VND',
    photo_url TEXT,
    status VARCHAR(30) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment_spare_parts (
    mapping_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES equipments(equipment_id) ON DELETE CASCADE,
    spare_id BIGINT NOT NULL REFERENCES spare_parts(spare_id) ON DELETE CASCADE,
    usage_position VARCHAR(255),
    quantity_per_equipment NUMERIC(18,4),
    critical_spare_flag BOOLEAN DEFAULT FALSE,
    replacement_cycle_day INT,
    replacement_cycle_run_hour INT,
    notes TEXT,
    UNIQUE (equipment_id, spare_id, usage_position)
);

CREATE TABLE spare_part_transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    spare_id BIGINT NOT NULL REFERENCES spare_parts(spare_id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- IN / OUT / ADJUST / RETURN
    ref_ticket_id BIGINT REFERENCES work_orders(ticket_id),
    quantity NUMERIC(18,4) NOT NULL,
    unit_cost NUMERIC(18,2),
    total_cost NUMERIC(18,2),
    warehouse_before_qty NUMERIC(18,4),
    warehouse_after_qty NUMERIC(18,4),
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performed_by BIGINT REFERENCES users(user_id),
    approved_by BIGINT REFERENCES users(user_id),
    note TEXT
);

-- =========================================================
-- 5. UTILITIES (ELECTRIC / WATER)
-- =========================================================

CREATE TABLE utility_readings (
    reading_id BIGSERIAL PRIMARY KEY,
    meter_id BIGINT NOT NULL REFERENCES meters(meter_id) ON DELETE CASCADE,
    meter_type VARCHAR(30) NOT NULL,
    area_id BIGINT REFERENCES areas(area_id),
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    reading_datetime TIMESTAMP NOT NULL,
    reading_value NUMERIC(18,4) NOT NULL,
    consumption_value NUMERIC(18,4),
    unit VARCHAR(30) NOT NULL,
    source_type VARCHAR(30), -- manual / auto_meter / imported_file
    recorded_by BIGINT REFERENCES users(user_id),
    verified_by BIGINT REFERENCES users(user_id),
    status VARCHAR(30) DEFAULT 'draft',
    note TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE utility_targets (
    target_id BIGSERIAL PRIMARY KEY,
    target_scope VARCHAR(30) NOT NULL, -- factory / area / line / equipment
    area_id BIGINT REFERENCES areas(area_id),
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    meter_type VARCHAR(30) NOT NULL,
    target_period VARCHAR(30) NOT NULL, -- day / week / month / year
    target_value NUMERIC(18,4) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    basis_type VARCHAR(30), -- fixed / per_ton / per_hour / per_batch
    basis_value NUMERIC(18,4),
    effective_from DATE,
    effective_to DATE,
    status VARCHAR(30) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE utility_alerts (
    alert_id BIGSERIAL PRIMARY KEY,
    meter_id BIGINT REFERENCES meters(meter_id),
    area_id BIGINT REFERENCES areas(area_id),
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    alert_type VARCHAR(50) NOT NULL, -- over_target / sudden_increase / abnormal_baseload
    alert_time TIMESTAMP NOT NULL,
    actual_value NUMERIC(18,4),
    target_value NUMERIC(18,4),
    deviation_percent NUMERIC(10,2),
    severity VARCHAR(20), -- low / medium / high / critical
    status VARCHAR(30) DEFAULT 'open',
    assigned_to BIGINT REFERENCES users(user_id),
    action_taken TEXT,
    closed_at TIMESTAMP,
    root_cause TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 6. OEE / PRODUCTION KPI
-- =========================================================

CREATE TABLE production_logs (
    production_log_id BIGSERIAL PRIMARY KEY,
    area_id BIGINT REFERENCES areas(area_id),
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    shift_code VARCHAR(30),
    production_date DATE NOT NULL,
    planned_run_time_min INT,
    actual_run_time_min INT,
    downtime_min INT,
    ideal_cycle_time_sec NUMERIC(18,4),
    total_output_qty NUMERIC(18,4),
    good_output_qty NUMERIC(18,4),
    reject_output_qty NUMERIC(18,4),
    performance_percent NUMERIC(10,4),
    availability_percent NUMERIC(10,4),
    quality_percent NUMERIC(10,4),
    oee_percent NUMERIC(10,4),
    created_by BIGINT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 7. ANNUAL PLAN
-- =========================================================

CREATE TABLE annual_plans (
    annual_plan_id BIGSERIAL PRIMARY KEY,
    plan_year INT NOT NULL,
    plan_type VARCHAR(30) NOT NULL, -- PM / UTILITY / OEE / TPM
    area_id BIGINT REFERENCES areas(area_id),
    equipment_id BIGINT REFERENCES equipments(equipment_id),
    title_vi VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_vi TEXT,
    description_en TEXT,
    owner_user_id BIGINT REFERENCES users(user_id),
    status VARCHAR(30) DEFAULT 'draft',
    approved_by BIGINT REFERENCES users(user_id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE annual_plan_details (
    annual_plan_detail_id BIGSERIAL PRIMARY KEY,
    annual_plan_id BIGINT NOT NULL REFERENCES annual_plans(annual_plan_id) ON DELETE CASCADE,
    target_month INT NOT NULL CHECK (target_month BETWEEN 1 AND 12),
    target_metric VARCHAR(100) NOT NULL, -- pm_count / oee / electricity / water / downtime / mtbf / mttr
    target_value NUMERIC(18,4) NOT NULL,
    actual_value NUMERIC(18,4),
    unit VARCHAR(30),
    status VARCHAR(30) DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 8. AUDIT LOGS
-- =========================================================

CREATE TABLE audit_logs (
    audit_log_id BIGSERIAL PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL,
    action_name VARCHAR(50) NOT NULL, -- create / update / delete / approve / close / assign / login
    ref_id BIGINT,
    old_data JSONB,
    new_data JSONB,
    action_by BIGINT REFERENCES users(user_id),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100),
    note TEXT
);

-- =========================================================
-- 9. USEFUL INDEXES
-- =========================================================

CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_equipments_area_id ON equipments(area_id);
CREATE INDEX idx_equipments_department_id ON equipments(department_id);
CREATE INDEX idx_work_orders_equipment_id ON work_orders(equipment_id);
CREATE INDEX idx_work_orders_area_id ON work_orders(area_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_ticket_type_id ON work_orders(ticket_type_id);
CREATE INDEX idx_downtime_logs_equipment_id ON downtime_logs(equipment_id);
CREATE INDEX idx_downtime_logs_ticket_id ON downtime_logs(ticket_id);
CREATE INDEX idx_inspections_equipment_id ON inspections(equipment_id);
CREATE INDEX idx_utility_readings_meter_id ON utility_readings(meter_id);
CREATE INDEX idx_utility_readings_area_id ON utility_readings(area_id);
CREATE INDEX idx_utility_readings_equipment_id ON utility_readings(equipment_id);
CREATE INDEX idx_utility_readings_datetime ON utility_readings(reading_datetime);
CREATE INDEX idx_utility_alerts_status ON utility_alerts(status);
CREATE INDEX idx_production_logs_equipment_date ON production_logs(equipment_id, production_date);
CREATE INDEX idx_annual_plans_year_type ON annual_plans(plan_year, plan_type);

-- =========================================================
-- 10. SEED DATA - TICKET TYPES
-- =========================================================

INSERT INTO ticket_types (ticket_type_code, ticket_type_name_vi, ticket_type_name_en, description) VALUES
('PM', 'Bảo trì phòng ngừa', 'Preventive Maintenance', 'Bảo trì định kỳ theo kế hoạch'),
('BM', 'Sửa chữa sự cố', 'Breakdown Maintenance', 'Máy hỏng đột xuất mới sửa'),
('CM', 'Bảo trì khắc phục', 'Corrective Maintenance', 'Khắc phục bất thường hoặc lỗi tồn tại'),
('INSP', 'Kiểm tra tình trạng', 'Inspection', 'Kiểm tra tình trạng thiết bị'),
('CAL', 'Hiệu chuẩn', 'Calibration', 'Hiệu chuẩn thiết bị đo lường'),
('OVH', 'Đại tu', 'Overhaul', 'Đại tu thiết bị'),
('LUBE', 'Bôi trơn', 'Lubrication', 'Công việc bôi trơn định kỳ'),
('UTILITY', 'Kiểm tra điện nước', 'Utility Check', 'Kiểm tra điện / nước / utility');

-- =========================================================
-- 11. SEED DATA - BASIC ROLES
-- =========================================================

INSERT INTO roles (role_code, role_name_vi, role_name_en, description) VALUES
('ADMIN', 'Quản trị hệ thống', 'System Administrator', 'Toàn quyền hệ thống'),
('DIRECTOR', 'Lãnh đạo', 'Director', 'Xem dashboard và báo cáo'),
('MANAGER', 'Quản lý', 'Manager', 'Quản lý và duyệt công việc'),
('MT_SUP', 'Trưởng nhóm bảo trì', 'Maintenance Supervisor', 'Điều phối công việc bảo trì'),
('MT_TECH', 'Kỹ thuật bảo trì', 'Maintenance Technician', 'Nhận và xử lý phiếu'),
('PRD_SUP', 'Trưởng ca sản xuất', 'Production Supervisor', 'Tạo yêu cầu và xác nhận sự cố'),
('OPERATOR', 'Vận hành', 'Operator', 'Báo sự cố và kiểm tra cơ bản'),
('STORE', 'Thủ kho phụ tùng', 'Spare Part Keeper', 'Quản lý kho phụ tùng'),
('UTILITY_SUP', 'Phụ trách điện nước', 'Utility Supervisor', 'Theo dõi utility'),
('VIEWER', 'Người xem báo cáo', 'Viewer', 'Chỉ xem báo cáo');

-- =========================================================
-- 12. SEED DATA - BASIC PERMISSIONS
-- =========================================================

INSERT INTO permissions (permission_code, permission_name_vi, permission_name_en, module_name, action_name) VALUES
('user.view', 'Xem người dùng', 'View Users', 'users', 'view'),
('user.create', 'Tạo người dùng', 'Create Users', 'users', 'create'),
('user.update', 'Sửa người dùng', 'Update Users', 'users', 'update'),
('user.delete', 'Xóa người dùng', 'Delete Users', 'users', 'delete'),
('equipment.view', 'Xem thiết bị', 'View Equipment', 'equipments', 'view'),
('equipment.create', 'Tạo thiết bị', 'Create Equipment', 'equipments', 'create'),
('equipment.update', 'Sửa thiết bị', 'Update Equipment', 'equipments', 'update'),
('equipment.delete', 'Xóa thiết bị', 'Delete Equipment', 'equipments', 'delete'),
('work_order.view', 'Xem phiếu công việc', 'View Work Orders', 'work_orders', 'view'),
('work_order.create', 'Tạo phiếu công việc', 'Create Work Orders', 'work_orders', 'create'),
('work_order.assign', 'Giao việc', 'Assign Work Orders', 'work_orders', 'assign'),
('work_order.close', 'Đóng phiếu', 'Close Work Orders', 'work_orders', 'close'),
('downtime.confirm', 'Xác nhận downtime', 'Confirm Downtime', 'downtime', 'confirm'),
('inspection.create', 'Tạo inspection', 'Create Inspection', 'inspections', 'create'),
('utility.reading.create', 'Nhập chỉ số điện nước', 'Create Utility Reading', 'utilities', 'create'),
('utility.alert.process', 'Xử lý cảnh báo điện nước', 'Process Utility Alerts', 'utilities', 'process'),
('dashboard.view', 'Xem dashboard', 'View Dashboard', 'dashboard', 'view'),
('annual_plan.view', 'Xem kế hoạch năm', 'View Annual Plan', 'annual_plan', 'view'),
('annual_plan.update', 'Cập nhật kế hoạch năm', 'Update Annual Plan', 'annual_plan', 'update'),
('report.export', 'Xuất báo cáo', 'Export Report', 'reports', 'export');

ALTER TABLE equipments
ADD COLUMN IF NOT EXISTS csv_power_spec TEXT,
ADD COLUMN IF NOT EXISTS csv_department VARCHAR(255),
ADD COLUMN IF NOT EXISTS csv_area VARCHAR(255),
ADD COLUMN IF NOT EXISTS csv_unit VARCHAR(100),
ADD COLUMN IF NOT EXISTS csv_quantity NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS csv_owner_name VARCHAR(255);

-- =========================================================
-- END OF FILE
-- =========================================================
