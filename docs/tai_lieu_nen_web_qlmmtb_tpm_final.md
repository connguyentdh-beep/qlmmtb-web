# TÀI LIỆU NỀN TỔNG HỢP CUỐI CÙNG ĐỂ CODE WEB QL MMTB THEO TPM + OEE + ĐIỆN/NƯỚC

## 1. Mục đích tài liệu

Tài liệu này là bản tổng hợp cuối cùng từ các tài liệu nền TPM, workflow hệ thống, và dashboard KPI để dùng làm cơ sở thiết kế và code hệ thống WEB QL MMTB.

Hệ thống hướng tới các mục tiêu:
- Quản lý thiết bị tập trung
- Quản lý bảo trì theo TPM
- Theo dõi PM / BM / CM / Inspection
- Theo dõi downtime, MTBF, MTTR, OEE
- Theo dõi điện / nước theo khu vực, line, máy
- Theo dõi kế hoạch năm và thực hiện thực tế
- Hỗ trợ đăng nhập, phân quyền và chuyển đổi ngôn ngữ Anh / Việt

---

## 2. Phạm vi hệ thống

Hệ thống WEB nên bao gồm các phân hệ chính:

1. Đăng nhập và quản lý người dùng
2. Phân quyền truy cập theo vai trò
3. Danh mục thiết bị
4. Cấu trúc nhà máy / khu vực / line / máy
5. Kế hoạch bảo trì PM
6. Phiếu công việc PM / BM / CM / Inspection / Overhaul / Calibration
7. Checklist và kết quả kiểm tra
8. Nhật ký downtime và breakdown
9. Dashboard TPM
10. Dashboard OEE
11. Module điện / nước
12. Dashboard điện / nước
13. Kế hoạch năm
14. Báo cáo và xuất dữ liệu
15. Chuyển đổi ngôn ngữ Anh / Việt

---

## 3. Khái niệm cốt lõi

## 3.1 TPM là gì
TPM (Total Productive Maintenance) là bảo trì năng suất toàn diện.

TPM không chỉ là một loại bảo trì, mà là khung quản trị tổng thể để theo dõi:
- hiệu suất thiết bị
- độ ổn định của máy
- bảo trì phòng ngừa
- sửa chữa sự cố
- kiểm tra tình trạng
- tổn thất sản xuất
- điện / nước tiêu thụ
- hiệu quả cải tiến

## 3.2 Các nhóm hoạt động trong TPM

### PM - Preventive Maintenance
Bảo trì phòng ngừa theo kế hoạch:
- vệ sinh
- bôi trơn
- siết điện
- thay thế định kỳ
- kiểm tra định kỳ

### BM - Breakdown Maintenance
Bảo trì khi máy hỏng:
- máy lỗi mới sửa
- thường có downtime
- là sự cố đột xuất

### CM - Corrective Maintenance
Bảo trì khắc phục:
- xử lý lỗi đang tồn tại
- chỉnh sửa để máy ổn định hơn
- có thể xảy ra sau khi inspection phát hiện bất thường

### Inspection
Kiểm tra tình trạng:
- kiểm tra rung
- kiểm tra nhiệt độ
- kiểm tra dòng điện
- kiểm tra điện áp
- kiểm tra rò rỉ
- kiểm tra áp suất
- kiểm tra nước / điện bất thường

### Autonomous Maintenance
Bảo trì tự quản bởi vận hành:
- vệ sinh máy
- kiểm tra cơ bản
- báo bất thường sớm

### Focused Improvement
Cải tiến trọng điểm:
- giảm lỗi lặp lại
- giảm downtime
- giảm điện / nước bất thường
- nâng cao OEE

---

## 4. Nguyên tắc phân loại dữ liệu

Đây là nguyên tắc rất quan trọng khi code web.

### 4.1 PM
- là bảo trì phòng ngừa
- làm theo kế hoạch
- không tính là downtime sự cố
- dùng để tính PM compliance

### 4.2 BM
- là sửa chữa do hỏng đột xuất
- nếu có dừng máy thì phải ghi downtime
- không tính vào PM
- có tính vào TPM và OEE

### 4.3 CM
- là xử lý bất thường, chỉnh sửa, khắc phục
- có thể có hoặc không có downtime
- nên tách với BM để phân tích chính xác

### 4.4 Inspection
- là kiểm tra tình trạng
- có thể không phát sinh sửa chữa
- có thể sinh phiếu CM hoặc BM nếu phát hiện bất thường

### 4.5 Điện / nước
- là dữ liệu vận hành
- không phải PM hoặc BM
- dùng để phân tích bất thường
- có thể tạo cảnh báo
- có thể làm cơ sở sinh inspection hoặc CM

### 4.6 OEE
OEE là chỉ số hiệu quả thiết bị tổng thể, gồm:
- Availability
- Performance
- Quality

---

## 5. Mô hình quản lý dữ liệu tổng thể

Hệ thống nên quản lý theo chuỗi:

**Nhà máy → Khu vực → Line → Máy → Phiếu công việc → Downtime / Checklist / Inspection / Điện nước → KPI / Dashboard**

Điều này giúp:
- thống kê theo khu vực
- thống kê theo line
- thống kê theo máy
- liên kết bảo trì với điện / nước
- liên kết bảo trì với OEE

---

## 6. Workflow tổng thể của hệ thống

## 6.1 Nguồn dữ liệu đầu vào
Có 4 nguồn chính:

### A. Báo sự cố từ vận hành
Ví dụ:
- máy dừng
- biến tần báo lỗi
- motor quá nhiệt
- bơm không lên áp

### B. Kế hoạch PM định kỳ
Ví dụ:
- bảo trì ngày
- bảo trì tuần
- bảo trì tháng
- thay dầu
- siết terminal
- kiểm tra bạc đạn

### C. Inspection kiểm tra tình trạng
Ví dụ:
- rung cao
- nhiệt độ cao
- dòng tải bất thường
- rò rỉ nước
- điện tiêu thụ nền cao

### D. Dữ liệu điện / nước
Nguồn có thể là:
- nhập tay
- import Excel / CSV
- công tơ / đồng hồ có truyền thông
- PLC / gateway / SCADA

## 6.2 Luồng xử lý nghiệp vụ
1. Nhận dữ liệu đầu vào
2. Phân loại dữ liệu
3. Tạo phiếu hoặc ghi chỉ số
4. Phân công người xử lý
5. Thực hiện công việc
6. Cập nhật kết quả
7. Đóng phiếu hoặc đóng cảnh báo
8. Tổng hợp dashboard TPM / OEE / điện nước
9. Ra quyết định cải tiến

## 6.3 Các trường hợp tiêu biểu

### Trường hợp 1: Máy hỏng đột xuất
1. Vận hành báo lỗi
2. Hệ thống tạo phiếu BM
3. Bảo trì nhận việc
4. Kiểm tra nguyên nhân
5. Sửa chữa
6. Chạy thử
7. Cập nhật downtime
8. Đóng phiếu
9. Đưa dữ liệu lên KPI TPM / OEE

### Trường hợp 2: PM định kỳ
1. Hệ thống đến hạn tự tạo phiếu PM
2. Kỹ thuật nhận việc
3. Thực hiện checklist
4. Cập nhật kết quả
5. Đóng phiếu
6. Tính PM compliance

### Trường hợp 3: Inspection phát hiện bất thường
1. Người kiểm tra nhập kết quả
2. Hệ thống đánh giá cảnh báo
3. Tạo đề nghị xử lý
4. Sinh phiếu CM nếu cần
5. Cập nhật kết quả
6. Lưu lịch sử phục vụ TPM

### Trường hợp 4: Điện / nước vượt định mức
1. Ghi hoặc đọc chỉ số
2. Hệ thống tính tiêu thụ
3. So sánh với định mức và lịch sử
4. Phát sinh cảnh báo bất thường
5. Giao người xử lý
6. Tạo inspection hoặc CM nếu cần

---

## 7. Danh mục master bắt buộc

## 7.1 Danh mục người dùng
- user_id
- user_code
- full_name
- username
- email
- phone
- password_hash
- department_id
- role_id
- language_preference
- avatar_url
- status
- last_login_at

## 7.2 Danh mục vai trò
- role_id
- role_code
- role_name_vi
- role_name_en
- description
- is_active

## 7.3 Danh mục phòng ban
- department_id
- department_code
- department_name_vi
- department_name_en
- manager_user_id
- status

## 7.4 Danh mục nhà máy / khu vực / line
- area_id
- area_code
- area_name_vi
- area_name_en
- area_type
- parent_area_id
- factory
- department_id
- line_code
- status
- notes

## 7.5 Danh mục thiết bị
- equipment_id
- equipment_code
- equipment_name_vi
- equipment_name_en
- category
- model
- serial_number
- manufacturer
- area_id
- line
- department_id
- criticality_level
- commission_date
- status
- owner_team
- maintenance_team
- standard_run_hours_per_day
- power_rated_kw
- water_required_flag
- estimated_water_use_per_hour
- notes

## 7.6 Cấu trúc thiết bị
- hierarchy_id
- parent_equipment_id
- child_equipment_id
- component_type
- notes

## 7.7 Danh mục công tơ / đồng hồ
- meter_id
- meter_code
- meter_name_vi
- meter_name_en
- meter_type
- install_scope
- area_id
- equipment_id
- serial_number
- manufacturer
- model
- unit
- reading_mode
- multiplier
- install_date
- status
- notes

---

## 8. Các bảng nghiệp vụ chính

## 8.1 Maintenance Plans
- plan_id
- equipment_id
- plan_type
- maintenance_type
- job_name_vi
- job_name_en
- description_vi
- description_en
- frequency_value
- frequency_unit
- estimated_duration_min
- assigned_team
- assigned_person
- checklist_template_id
- last_done_date
- next_due_date
- status

## 8.2 Work Orders / Tickets
- ticket_id
- ticket_no
- ticket_type
- equipment_id
- area_id
- request_date
- start_time
- end_time
- downtime_min
- symptom
- problem_description
- root_cause
- action_taken
- recommendation
- priority
- status
- requested_by
- assigned_to
- verified_by
- closed_at
- attachments

### Loại phiếu nên hỗ trợ
- PM
- BM
- CM
- Inspection
- Calibration
- Overhaul
- Lubrication
- Utility Check

## 8.3 Checklist Templates
- template_id
- template_name_vi
- template_name_en
- equipment_category
- maintenance_type
- version
- is_active

## 8.4 Checklist Template Items
- item_id
- template_id
- item_order
- item_name_vi
- item_name_en
- standard_value
- unit
- inspection_method
- upper_limit
- lower_limit
- required_photo
- required_comment

## 8.5 Checklist Results
- result_id
- ticket_id
- template_id
- item_id
- measured_value
- result_status
- comment
- photo_url
- checked_by
- checked_at

## 8.6 Inspection / Condition Monitoring
- inspection_id
- equipment_id
- area_id
- inspection_date
- inspection_type
- parameter_name_vi
- parameter_name_en
- measured_value
- unit
- standard_min
- standard_max
- result_status
- inspector
- remark
- photo_url

## 8.7 Downtime Logs
- downtime_id
- equipment_id
- ticket_id
- failure_start_time
- failure_end_time
- downtime_min
- failure_mode
- failure_category
- impact_level
- production_loss
- root_cause_group
- temporary_action
- permanent_action
- is_repeat_failure

## 8.8 Spare Parts
- spare_id
- spare_code
- spare_name_vi
- spare_name_en
- specification
- unit
- stock_qty
- min_qty
- max_qty
- location
- supplier
- lead_time_day
- used_for_equipment
- cost
- status

## 8.9 Utility Readings
- reading_id
- meter_id
- meter_type
- area_id
- equipment_id
- reading_datetime
- reading_value
- consumption_value
- unit
- source_type
- recorded_by
- verified_by
- status
- note
- attachment_url

## 8.10 Utility Targets
- target_id
- target_scope
- area_id
- equipment_id
- meter_type
- target_period
- target_value
- unit
- basis_type
- basis_value
- effective_from
- effective_to
- status
- notes

## 8.11 Utility Alerts
- alert_id
- meter_id
- area_id
- equipment_id
- alert_type
- alert_time
- actual_value
- target_value
- deviation_percent
- severity
- status
- assigned_to
- action_taken
- closed_at
- root_cause

---

## 9. Module đăng nhập và phân quyền

## 9.1 Mục tiêu
Hệ thống phải có cơ chế:
- đăng nhập an toàn
- phân quyền theo vai trò
- giới hạn màn hình, chức năng, dữ liệu
- lưu lịch sử thao tác
- hỗ trợ giao diện song ngữ

## 9.2 Đăng nhập
Nên hỗ trợ:
- đăng nhập bằng username + password
- đăng nhập bằng email + password
- tùy chọn nhớ đăng nhập
- quên mật khẩu
- đổi mật khẩu
- khóa tài khoản khi đăng nhập sai nhiều lần
- logout
- session timeout
- nhật ký đăng nhập

### Bảng bổ sung nên có
#### Auth Sessions
- session_id
- user_id
- login_time
- logout_time
- ip_address
- device_info
- token
- refresh_token
- status

#### Login Audit Logs
- audit_id
- user_id
- username
- login_result
- login_time
- ip_address
- user_agent
- fail_reason

## 9.3 Phân quyền đăng nhập
Nên dùng mô hình:
**User → Role → Permission**

### Các vai trò đề xuất
1. Admin
2. Director / Leadership
3. Manager
4. Maintenance Supervisor
5. Maintenance Technician
6. Production Supervisor
7. Operator
8. Warehouse / Spare Part Keeper
9. Utility / Energy Supervisor
10. Viewer / Guest Report

### Quyền đề xuất theo vai trò

#### Admin
- toàn quyền hệ thống
- quản lý user
- quản lý role
- quản lý cấu hình
- xem toàn bộ dữ liệu
- sửa dữ liệu master
- khóa / mở tài khoản
- phân quyền

#### Director / Leadership
- xem dashboard tổng
- xem OEE
- xem điện / nước
- xem kế hoạch năm
- xem báo cáo
- không sửa dữ liệu gốc

#### Manager
- xem dashboard
- duyệt phiếu
- giao việc
- xem kế hoạch
- xem và xác nhận báo cáo

#### Maintenance Supervisor
- tạo và điều phối phiếu
- xác nhận downtime
- đóng phiếu
- quản lý checklist
- theo dõi PM compliance

#### Maintenance Technician
- nhận việc
- cập nhật xử lý
- nhập checklist
- cập nhật downtime thực tế
- đính kèm hình ảnh

#### Production Supervisor
- tạo yêu cầu sửa chữa
- xác nhận dừng máy
- theo dõi thiết bị khu vực mình phụ trách

#### Operator
- báo sự cố
- nhập inspection cơ bản
- xem thông tin máy của khu vực được cấp quyền

#### Warehouse / Spare Part Keeper
- quản lý phụ tùng
- nhập xuất kho
- xem phiếu liên quan phụ tùng

#### Utility / Energy Supervisor
- quản lý điện / nước
- nhập chỉ số
- xác nhận cảnh báo utility
- xem dashboard điện / nước

#### Viewer / Guest Report
- chỉ xem dashboard và báo cáo được cấp quyền

## 9.4 Permission Matrix nên có
Nên tách quyền theo module:
- user.view
- user.create
- user.update
- user.delete
- equipment.view
- equipment.create
- equipment.update
- equipment.delete
- work_order.view
- work_order.create
- work_order.assign
- work_order.close
- downtime.confirm
- inspection.create
- utility.reading.create
- utility.alert.process
- dashboard.view
- annual_plan.view
- annual_plan.update
- report.export

## 9.5 Phân quyền theo phạm vi dữ liệu
Ngoài quyền chức năng, nên có quyền theo phạm vi:
- toàn nhà máy
- theo khu vực
- theo line
- theo phòng ban
- theo máy

Ví dụ:
- Operator khu sấy chỉ nhìn thấy máy khu sấy
- Utility supervisor chỉ xem khu vực utility được giao
- Director xem toàn bộ

---

## 10. Module chuyển đổi ngôn ngữ Anh / Việt

## 10.1 Mục tiêu
Vì lãnh đạo là người nước ngoài, hệ thống phải có nút chuyển:
- Tiếng Việt
- English

## 10.2 Cách triển khai
Nên có:
- nút chuyển ngôn ngữ trên header
- lưu lựa chọn ngôn ngữ theo user
- hỗ trợ đổi ngôn ngữ không cần đăng xuất
- toàn bộ label, menu, button, trạng thái, dashboard dùng i18n

## 10.3 Dữ liệu song ngữ cần chuẩn bị
Nên chuẩn hóa song ngữ cho:
- tên menu
- tên module
- tên vai trò
- tên khu vực
- tên máy
- tên loại phiếu
- tên checklist
- tên thông báo lỗi
- trạng thái hệ thống
- tiêu đề biểu đồ
- báo cáo PDF / Excel nếu cần

## 10.4 Cấu trúc dữ liệu đề xuất cho song ngữ
Cách đơn giản:
- lưu 2 cột: `name_vi`, `name_en`
- áp dụng cho master data quan trọng

Ví dụ:
- equipment_name_vi
- equipment_name_en
- area_name_vi
- area_name_en
- role_name_vi
- role_name_en

Cách chuyên nghiệp hơn:
- dùng bảng translation keys riêng
- frontend dùng thư viện i18n

## 10.5 Các vị trí bắt buộc phải song ngữ
- màn hình đăng nhập
- menu trái
- dashboard KPI
- form tạo phiếu
- trạng thái phiếu
- cảnh báo utility
- kế hoạch năm
- báo cáo xuất ra
- thông báo lỗi và thông báo thành công

---

## 11. Dashboard và biểu đồ nên có

## 11.1 Dashboard tổng quan TPM
KPI card:
- tổng số phiếu PM
- tổng số phiếu BM
- tổng số phiếu CM
- tổng downtime
- MTTR
- MTBF
- số máy có sự cố
- top nguyên nhân lỗi
- top máy downtime cao

## 11.2 Dashboard điện / nước
KPI card:
- tổng điện tiêu thụ kWh
- tổng nước tiêu thụ m3
- số cảnh báo utility
- khu vực vượt định mức

Biểu đồ:
1. Điện tiêu thụ theo ngày / tuần / tháng
2. Nước tiêu thụ theo ngày / tuần / tháng
3. Điện theo khu vực
4. Nước theo khu vực
5. Thực tế vs định mức
6. Chi phí điện / nước
7. Theo ca sản xuất
8. kWh / tấn, m3 / tấn

## 11.3 Dashboard OEE
KPI card:
- OEE tổng
- Availability
- Performance
- Quality

Biểu đồ:
1. OEE theo thời gian
2. OEE theo máy / line / khu vực
3. Availability / Performance / Quality theo thời gian
4. Downtime theo nguyên nhân
5. Downtime theo máy
6. MTBF / MTTR
7. Planned vs Unplanned downtime

## 11.4 Dashboard bảo trì TPM
Biểu đồ:
1. PM Plan vs Actual theo tháng
2. BM / CM theo tháng
3. Backlog bảo trì
4. Top máy lỗi nhiều
5. Top nguyên nhân lặp lại

## 11.5 Dashboard kế hoạch năm
Biểu đồ:
1. PM Plan vs Actual
2. Energy Plan vs Actual
3. Water Plan vs Actual
4. OEE target vs actual
5. Downtime target vs actual
6. MTBF / MTTR target vs actual
7. Backlog
8. Shutdown plan theo quý

---

## 12. KPI chính của hệ thống

## 12.1 PM Compliance
PM Compliance = số phiếu PM hoàn thành đúng hạn / tổng số phiếu PM đến hạn x 100%

## 12.2 Breakdown Count
Tổng số phiếu BM hoặc sửa chữa sự cố

## 12.3 Total Downtime
Tổng downtime của các phiếu sự cố

## 12.4 MTTR
MTTR = tổng thời gian sửa chữa / số lần sửa chữa

## 12.5 MTBF
MTBF = tổng thời gian vận hành / số lần hỏng

## 12.6 OEE
OEE = Availability x Performance x Quality

## 12.7 Utility KPI
- tổng điện theo ngày / tháng
- tổng nước theo ngày / tháng
- điện theo khu vực
- nước theo khu vực
- kWh / giờ chạy
- kWh / sản lượng
- m3 / giờ chạy
- m3 / sản lượng
- khu vượt định mức
- cảnh báo bất thường

## 12.8 Combined KPI
- downtime cao nhưng điện nền vẫn cao
- máy dừng nhưng vẫn tiêu thụ điện bất thường
- sau bảo trì điện có giảm không
- sau cải tiến nước có giảm không

---

## 13. Module kế hoạch năm

## 13.1 Mục tiêu
Module kế hoạch năm dùng để quản lý:
- kế hoạch PM năm
- kế hoạch điện / nước năm
- kế hoạch OEE / TPM năm
- so sánh thực tế với kế hoạch

## 13.2 Cấu trúc module
Gồm 4 tab:

### Tab 1: Kế hoạch PM năm
- danh sách máy
- chu kỳ PM
- lịch PM năm
- shutdown plan
- nguồn lực

### Tab 2: Kế hoạch điện / nước năm
- kế hoạch điện theo tháng
- kế hoạch nước theo tháng
- định mức theo khu vực
- intensity plan
- thực tế vs kế hoạch

### Tab 3: Kế hoạch OEE / TPM
- OEE target
- Availability target
- Performance target
- Quality target
- Downtime target
- MTBF target
- MTTR target

### Tab 4: Theo dõi thực hiện
- đã làm
- chưa làm
- quá hạn
- backlog
- % hoàn thành
- cảnh báo lệch kế hoạch

## 13.3 Quy trình làm kế hoạch năm

### A. Kế hoạch năm bảo trì
1. Chuẩn hóa danh mục máy
2. Xác định chu kỳ PM
3. Xây dựng checklist chuẩn
4. Lập lịch PM theo tháng / quý / năm
5. Dự trù nguồn lực
6. Theo dõi thực hiện trên web

### B. Kế hoạch năm điện / nước
1. Lấy số liệu nền năm trước
2. Căn cứ sản lượng kế hoạch
3. Đặt chỉ tiêu tiêu hao
4. Chia chỉ tiêu theo tháng / quý
5. Theo dõi thực tế so với kế hoạch

### C. Kế hoạch năm OEE / TPM
1. Xác định baseline năm trước
2. Đặt mục tiêu năm
3. Chia mục tiêu theo tháng / quý
4. Gắn với hành động cải tiến

---

## 14. API gợi ý

## 14.1 Xác thực và người dùng
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh-token
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /me
- GET /users
- POST /users
- PUT /users/{id}
- GET /roles
- GET /permissions

## 14.2 Danh mục thiết bị
- GET /equipments
- POST /equipments
- PUT /equipments/{id}
- GET /equipments/{id}
- GET /areas
- POST /areas
- PUT /areas/{id}

## 14.3 Kế hoạch bảo trì
- GET /maintenance-plans
- POST /maintenance-plans
- PUT /maintenance-plans/{id}
- POST /maintenance-plans/generate-work-orders

## 14.4 Phiếu công việc
- GET /work-orders
- POST /work-orders
- PUT /work-orders/{id}
- POST /work-orders/{id}/assign
- POST /work-orders/{id}/close
- POST /work-orders/{id}/verify

## 14.5 Checklist / Inspection
- GET /checklist-templates
- POST /checklist-templates
- POST /checklist-results
- GET /inspections
- POST /inspections

## 14.6 Downtime
- GET /downtime-logs
- POST /downtime-logs
- PUT /downtime-logs/{id}

## 14.7 Utility
- GET /utility-areas
- POST /utility-areas
- PUT /utility-areas/{id}
- GET /utility-meters
- POST /utility-meters
- PUT /utility-meters/{id}
- GET /utility-readings
- POST /utility-readings
- POST /utility-readings/import
- GET /utility-alerts
- POST /utility-alerts/{id}/process

## 14.8 Dashboard
- GET /dashboard/tpm/summary
- GET /dashboard/tpm/downtime-by-cause
- GET /dashboard/tpm/pm-plan-vs-actual
- GET /dashboard/oee/summary
- GET /dashboard/oee/trend
- GET /dashboard/utilities/summary
- GET /dashboard/utilities/by-area
- GET /dashboard/utilities/plan-vs-actual
- GET /dashboard/annual-plan/summary

## 14.9 Language / i18n
- GET /languages
- PUT /me/language
- GET /translations?lang=vi
- GET /translations?lang=en

---

## 15. Màn hình web nên có

## 15.1 Public / Authentication
- Login
- Forgot Password
- Reset Password

## 15.2 Main Modules
- Dashboard tổng quan
- Dashboard TPM
- Dashboard OEE
- Dashboard điện / nước
- Thiết bị
- Khu vực / line
- Kế hoạch PM
- Phiếu công việc
- Inspection
- Downtime
- Phụ tùng
- Kế hoạch năm
- Báo cáo
- Quản trị người dùng
- Cấu hình hệ thống

## 15.3 Màn hình điện / nước
- Danh mục khu vực
- Danh mục công tơ / đồng hồ
- Nhập chỉ số điện / nước
- Import Excel / CSV
- Danh sách cảnh báo
- Dashboard utility

## 15.4 Màn hình song ngữ
Header nên có:
- tên người dùng
- nút chuyển language: VI | EN
- logout

---

## 16. Bộ biểu đồ tối thiểu nên làm trước

Để làm phiên bản 1 nhanh và hiệu quả, nên ưu tiên:

1. Điện tiêu thụ theo tháng
2. Nước tiêu thụ theo tháng
3. Điện theo khu vực
4. Nước theo khu vực
5. Thực tế vs định mức điện / nước
6. OEE theo tháng
7. Availability / Performance / Quality theo tháng
8. Downtime theo nguyên nhân
9. Downtime theo máy
10. PM Plan vs Actual theo tháng

---

## 17. Lộ trình triển khai

## Giai đoạn 1: Chuẩn hóa dữ liệu nền
- user / role / permission
- area / line / equipment
- ticket type
- utility area / meter
- language data
- master checklist

## Giai đoạn 2: Chạy nghiệp vụ cơ bản
- login
- phân quyền
- danh mục thiết bị
- kế hoạch PM
- phiếu BM / CM / PM
- downtime
- nhập điện / nước

## Giai đoạn 3: Dashboard và KPI
- TPM dashboard
- OEE dashboard
- utility dashboard
- cảnh báo

## Giai đoạn 4: Kế hoạch năm
- PM annual plan
- utility annual plan
- OEE annual plan
- plan vs actual

## Giai đoạn 5: Nâng cấp
- import Excel / CSV
- kết nối công tơ tự động
- mobile inspection
- approval workflow
- báo cáo PDF / Excel song ngữ

---

## 18. Kết luận cuối cùng

Hệ thống WEB QL MMTB theo TPM nên được xây dựng như một nền tảng quản trị tổng thể gồm:

- thiết bị
- bảo trì
- downtime
- inspection
- OEE
- điện / nước
- kế hoạch năm
- người dùng và phân quyền
- giao diện song ngữ Việt / Anh

Điểm quan trọng nhất khi code:
- TPM là khung tổng thể
- PM, BM, CM, Inspection là các loại hoạt động
- điện / nước là dữ liệu vận hành hỗ trợ TPM
- downtime sự cố không được gộp vào PM
- toàn bộ dữ liệu phải liên kết theo khu vực → line → máy → phiếu → KPI
- phải có đăng nhập, phân quyền và chuyển đổi ngôn ngữ ngay từ thiết kế ban đầu để tránh sửa lại toàn hệ thống sau này


---

## 19. Module hồ sơ tài liệu máy

## 19.1 Mục tiêu
Mỗi thiết bị cần có một bộ hồ sơ tài liệu điện tử để phục vụ:
- tra cứu nhanh
- sửa chữa
- bảo trì định kỳ
- đào tạo nhân sự
- lưu lịch sử tài liệu
- kiểm soát phiên bản tài liệu

## 19.2 Các loại tài liệu máy nên lưu
- Hướng dẫn vận hành
- Hướng dẫn bảo trì
- Manual của hãng
- Bản vẽ cơ khí
- Sơ đồ điện
- Sơ đồ khí nén / thủy lực
- Catalog thiết bị
- Thông số kỹ thuật
- Biên bản nghiệm thu
- Hồ sơ lắp đặt
- Hình ảnh máy
- Video hướng dẫn
- Biên bản sửa chữa lớn
- Biên bản hiệu chuẩn
- Hồ sơ thay đổi / cải tiến máy

## 19.3 Bảng dữ liệu hồ sơ tài liệu máy
### Equipment Documents
- document_id
- equipment_id
- document_code
- document_name_vi
- document_name_en
- document_type
- version_no
- issue_date
- effective_date
- source
- file_name
- file_path
- file_size
- file_extension
- uploaded_by
- approved_by
- approval_status
- is_active
- notes
- created_at
- updated_at

## 19.4 Chức năng màn hình hồ sơ tài liệu máy
- Xem danh sách tài liệu theo máy
- Tìm kiếm theo mã tài liệu / tên tài liệu
- Lọc theo loại tài liệu
- Xem chi tiết tài liệu
- Tải lên file mới
- Cập nhật phiên bản tài liệu
- Tải file về máy
- Xem lịch sử phiên bản
- Khóa tài liệu cũ
- Gắn tài liệu với nhiều máy nếu cần

## 19.5 Quy tắc nghiệp vụ
- Mỗi tài liệu phải gắn ít nhất 1 máy hoặc 1 nhóm máy
- Tài liệu quan trọng nên có version
- Khi cập nhật version mới, version cũ không bị xóa mà chuyển inactive
- Chỉ người có quyền mới được xóa hoặc thay thế tài liệu
- Lãnh đạo và viewer có thể chỉ xem / tải xuống
- Có thể hỗ trợ xem PDF trực tiếp trên web

---

## 20. Module phụ tùng thay thế

## 20.1 Mục tiêu
Quản lý phụ tùng thay thế phải liên kết chặt với:
- thiết bị
- phiếu sửa chữa
- kế hoạch bảo trì
- mức tồn kho
- chi phí bảo trì

## 20.2 Danh mục phụ tùng nên quản lý
Ngoài bảng Spare Parts hiện có, nên bổ sung thêm các thông tin sau:
- part_category
- brand
- model
- original_part_no
- alternate_part_no
- compatible_equipment_ids
- warehouse_location
- reorder_point
- safety_stock
- last_purchase_price
- currency
- last_supplier
- photo_url

## 20.3 Bảng liên kết phụ tùng với thiết bị
### Equipment Spare Parts Mapping
- mapping_id
- equipment_id
- spare_id
- usage_position
- quantity_per_equipment
- critical_spare_flag
- replacement_cycle_day
- replacement_cycle_run_hour
- notes

## 20.4 Bảng xuất dùng phụ tùng
### Spare Part Transactions
- transaction_id
- spare_id
- transaction_type
- ref_ticket_id
- quantity
- unit_cost
- total_cost
- warehouse_before_qty
- warehouse_after_qty
- transaction_time
- performed_by
- approved_by
- note

### transaction_type nên có
- IN
- OUT
- ADJUST
- RETURN

## 20.5 Chức năng màn hình phụ tùng
- Xem danh sách phụ tùng
- Tìm kiếm theo mã phụ tùng / tên phụ tùng
- Lọc theo nhóm / hãng / kho / trạng thái
- Xem chi tiết phụ tùng
- Xem tồn kho hiện tại
- Xem máy nào đang sử dụng phụ tùng đó
- Xem lịch sử nhập xuất
- Thêm phụ tùng mới
- Chỉnh sửa phụ tùng
- Xóa hoặc ngưng sử dụng phụ tùng
- Nhập kho
- Xuất kho theo phiếu sửa chữa
- Cảnh báo tồn kho thấp
- Đính kèm hình ảnh / catalog phụ tùng

## 20.6 Quy tắc nghiệp vụ
- Phụ tùng critical phải có safety stock
- Xuất phụ tùng cho phiếu sửa chữa phải lưu ref_ticket_id
- Không nên xóa cứng phụ tùng đã phát sinh giao dịch
- Khi tồn kho xuống thấp hơn reorder_point, hệ thống phát cảnh báo
- Nên theo dõi cost phụ tùng để tính chi phí bảo trì theo máy / khu vực / line

---

## 21. Chuẩn hóa nút thao tác trên web

## 21.1 Mục tiêu
Mỗi màn hình trong web cần có bộ nút thao tác thống nhất để dễ dùng, dễ phân quyền và dễ code.

## 21.2 Các nút thao tác cơ bản nên có
- Thêm mới
- Nhập liệu
- Chỉnh sửa
- Xóa
- Xem chi tiết
- Lưu
- Hủy
- Làm mới
- Tìm kiếm
- Lọc
- Xuất Excel
- Xuất PDF
- Import Excel
- Tải mẫu import
- Đính kèm file
- Tải file
- In
- Gửi duyệt
- Duyệt
- Từ chối
- Đóng phiếu
- Mở lại
- Giao việc
- Xác nhận
- Xem lịch sử

## 21.3 Tên song ngữ cho nút thao tác
| VI | EN |
|---|---|
| Thêm mới | Add New |
| Nhập liệu | Input |
| Chỉnh sửa | Edit |
| Xóa | Delete |
| Chi tiết | Detail |
| Lưu | Save |
| Hủy | Cancel |
| Làm mới | Refresh |
| Tìm kiếm | Search |
| Lọc | Filter |
| Xuất Excel | Export Excel |
| Xuất PDF | Export PDF |
| Import Excel | Import Excel |
| Tải mẫu | Download Template |
| Đính kèm | Attach File |
| Tải xuống | Download |
| In | Print |
| Giao việc | Assign |
| Xác nhận | Confirm |
| Đóng phiếu | Close Ticket |
| Xem lịch sử | View History |

## 21.4 Quy tắc hiển thị nút thao tác
- Nút hiển thị theo permission của user
- Màn hình danh sách nên có: Thêm mới, Tìm kiếm, Lọc, Xuất Excel/PDF
- Màn hình chi tiết nên có: Chỉnh sửa, Xóa, In, Xem lịch sử, Đính kèm
- Màn hình nhập liệu nên có: Lưu, Hủy, Làm mới
- Màn hình phiếu nên có thêm: Giao việc, Xác nhận, Đóng phiếu
- Màn hình tài liệu nên có thêm: Tải lên, Tải xuống, Xem version
- Màn hình phụ tùng nên có thêm: Nhập kho, Xuất kho, Xem tồn, Xem giao dịch

## 21.5 Phân quyền nút thao tác
Ví dụ:
- Viewer: chỉ xem chi tiết, tải file, in báo cáo
- Operator: nhập liệu sự cố, xem chi tiết
- Technician: chỉnh sửa phiếu được giao, cập nhật xử lý
- Supervisor: giao việc, xác nhận, đóng phiếu
- Admin: toàn quyền thêm / sửa / xóa / phân quyền

---

## 22. Màn hình chi tiết nên có theo từng module

## 22.1 Màn hình thiết bị
Nên có các tab:
- Thông tin chung
- Hồ sơ tài liệu máy
- Kế hoạch PM
- Lịch sử phiếu
- Lịch sử downtime
- Inspection
- Phụ tùng liên quan
- Điện / nước liên quan
- Hình ảnh / file đính kèm

### Nút nên có
- Thêm mới
- Chỉnh sửa
- Xóa
- Chi tiết
- In mã máy / QR
- Tải lên tài liệu
- Xem lịch sử

## 22.2 Màn hình phụ tùng
Các tab nên có:
- Thông tin chung
- Tồn kho
- Máy sử dụng
- Lịch sử giao dịch
- Tài liệu / catalog
- Hình ảnh

### Nút nên có
- Thêm mới
- Chỉnh sửa
- Xóa
- Chi tiết
- Nhập kho
- Xuất kho
- Xem giao dịch
- Tải catalog

## 22.3 Màn hình tài liệu máy
Các tab nên có:
- Danh sách tài liệu
- Phiên bản tài liệu
- Máy liên quan
- Lịch sử cập nhật

### Nút nên có
- Tải lên
- Chỉnh sửa
- Xóa
- Chi tiết
- Tải xuống
- Xem file
- Xem lịch sử version

## 22.4 Màn hình phiếu công việc
Các tab nên có:
- Thông tin phiếu
- Checklist
- Downtime
- Phụ tùng đã dùng
- Hình ảnh
- File đính kèm
- Lịch sử xử lý

### Nút nên có
- Thêm mới
- Chỉnh sửa
- Chi tiết
- Giao việc
- Xác nhận
- Đóng phiếu
- In
- Xuất PDF

---

## 23. API gợi ý bổ sung

## 23.1 Hồ sơ tài liệu máy
- GET /equipment-documents
- POST /equipment-documents
- PUT /equipment-documents/{id}
- DELETE /equipment-documents/{id}
- GET /equipment-documents/{id}
- GET /equipments/{id}/documents
- POST /equipment-documents/{id}/upload
- GET /equipment-documents/{id}/download
- GET /equipment-documents/{id}/versions

## 23.2 Phụ tùng thay thế
- GET /spare-parts
- POST /spare-parts
- PUT /spare-parts/{id}
- DELETE /spare-parts/{id}
- GET /spare-parts/{id}
- GET /spare-parts/{id}/transactions
- POST /spare-parts/{id}/stock-in
- POST /spare-parts/{id}/stock-out
- GET /equipments/{id}/spare-parts

## 23.3 Thao tác chung
- GET /audit-logs
- GET /attachments
- POST /attachments
- DELETE /attachments/{id}

---

## 24. Bổ sung vào phạm vi hệ thống

Cần cập nhật phạm vi hệ thống thêm:
- Hồ sơ tài liệu máy
- Quản lý phụ tùng thay thế
- Quản lý file đính kèm
- Quản lý thao tác chuẩn trên màn hình
- Lịch sử chỉnh sửa / audit log

---

## 25. Kết luận bổ sung

Để hệ thống WEB QL MMTB hoàn chỉnh hơn khi code thực tế, ngoài TPM, OEE, điện / nước và kế hoạch năm, cần bổ sung thêm các module sau:
- Hồ sơ tài liệu máy
- Quản lý phụ tùng thay thế
- Chuẩn hóa các nút thao tác thêm / sửa / xóa / chi tiết / nhập liệu
- File đính kèm và lịch sử phiên bản
- Audit log cho các thao tác quan trọng

Các phần bổ sung này giúp hệ thống không chỉ dừng ở dashboard và phiếu công việc, mà trở thành nền tảng quản lý thiết bị đầy đủ để vận hành lâu dài.
