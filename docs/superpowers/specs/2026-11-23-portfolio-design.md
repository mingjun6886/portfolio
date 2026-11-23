# Portfolio cá nhân — Minh Quan Nguyen

Ngày: 2026-11-23 · Trạng thái: đã duyệt (2026-11-23)

## 1. Mục đích và lý do

Quan (Minh Quan Nguyen, sinh viên Monash University, Melbourne) cần một website cá nhân để gửi kèm hồ sơ xin việc **graduate/junior Cloud & ML Engineer** ở Úc. Người xem là HR và kỹ sư phỏng vấn. Họ chỉ dành vài chục giây cho trang chủ, nên site phải trả lời ngay: người này là ai, làm được gì, có bằng chứng (số liệu thật) không, tải CV ở đâu.

Site của Kyle Tran (kt23-portfolio.vercel.app) chỉ là nguồn tham khảo, không sao chép code hay giao diện.

## 2. Mục tiêu

- Mở link là thấy **ảnh đại diện + lời giới thiệu** trước tiên (yêu cầu của Quan).
- Trong ~30 giây nhà tuyển dụng nắm được: chức danh, 3 project nổi bật, mỗi project có số liệu đo được, nút tải CV.
- **Thêm project = thêm 1 file nội dung**, không sửa code giao diện. Quan sẽ thêm project dần về sau.
- Tải nhanh, đọc tốt trên điện thoại.

## 3. Không làm (bản đầu)

- Không có cảnh 3D, không hiệu ứng nặng.
- Không có form liên hệ (chỉ email + LinkedIn).
- Không có chế độ tối (gọi của Claude, có thể thêm sau).
- Không có blog.
- Không mua tên miền riêng lúc đầu; dùng `*.vercel.app`.

## 4. Điều phải tránh (làm vậy là hỏng dù site chạy được)

- **Bịa số liệu hay thành tích.** Mọi con số trên site phải lấy từ repo/README thật (nguồn ở mục 9).
- **Công khai code bài tập đang chấm điểm.** Bài FIT5222 chỉ đăng bài viết, không gắn link code.
- **Nhận công của nhóm.** Project nhóm phải ghi rõ quy mô nhóm và phần Quan làm.
- Gọi Quan là "software engineer". Chức danh đúng: **Cloud & ML Engineer**.
- Trông giống template phổ biến (craftzdog) hoặc giống site của Kyle.

## 5. Những gì Quan đã quyết

- **Hướng giao diện B "Tạp chí"**: nền sáng, nhiều khoảng trắng, tiêu đề chữ có chân (serif), ảnh project lớn, số liệu hiện thành 3 con số to dưới mỗi project.
  - Bảng màu trong bản phác: nền `#fafaf7`, chữ `#1c1c1a`, chữ phụ `#6b6b66`, màu nhấn xanh `#1d4ed8`, đường kẻ `#e7e5df`.
- **Phần đầu trang kiểu 1**: ảnh tròn ~150px bên trái; bên phải là "Hi, I'm Quan." + câu chủ đề in nghiêng màu nhấn *"I build cloud systems and ship ML models — and I measure them."*, đoạn giới thiệu ~3 câu, dòng thông tin nhanh (Melbourne · Monash University · Available [tháng/năm] · [quyền làm việc — tùy Quan]), nút **Download CV** (nổi bật) + GitHub + LinkedIn + Copy email.
- **Chức danh**: Cloud & ML Engineer, nhắm vị trí graduate/junior.
- **Thứ tự trang chủ**: Phần đầu → Selected work (3 project nổi bật) → More projects & coursework (lưới thẻ, lọc theo chủ đề) → Experience & education → Contact ("Let's talk." + email, GitHub, LinkedIn).
- **Trang chi tiết project**: Vấn đề → Cách làm (ghi rõ vai trò của Quan) → Sơ đồ kiến trúc → Kết quả (số liệu) → Bài học, kèm link demo/GitHub.
- Quan để Claude chọn công nghệ.
- Không đưa project RAG (CFA) vào lúc này vì chưa xong.

Bản phác đã duyệt (tham khảo bố cục, lời giới thiệu nháp, nhãn menu): `docs/superpowers/specs/2026-11-23-portfolio-home-mockup.html`. File này là một đoạn HTML lấy ra từ công cụ phác thảo, nên mở trực tiếp sẽ thiếu phần khung và theme. Phần `.B` bên trong tự đủ style.

## 6. Cách dựng (gọi của Claude)

- **Astro**, xuất trang tĩnh. Lý do: Astro sinh trang gần như không có JavaScript nên tải nhanh, và có sẵn "content collections" cho nội dung markdown. Quan quen Vue (dùng trong FIREBREAK) nên nếu cần tương tác có thể dùng component Vue.
- **CSS thường** viết trong component Astro, không thêm Tailwind hay UI library.
- **Font**: serif cho tiêu đề, sans cho chữ thường, dùng font hệ thống (Georgia / system-ui) để không tải font ngoài.
- **Hosting**: Vercel bản miễn phí, repo GitHub trên tài khoản `mingjun6886`. Mỗi lần đẩy lên `main`, Vercel tự build lại.
- **Không push và không deploy khi Quan chưa đồng ý.**
- Vercel Web Analytics (miễn phí) để biết có ai xem site.

### Mô hình nội dung

Mỗi project là **một file markdown** trong `src/content/projects/`. Phần đầu file (frontmatter) có các trường:

| Trường | Ý nghĩa |
|---|---|
| `title`, `summary` | Tên và mô tả 1 câu |
| `kind` | `personal` / `team` / `coursework` |
| `course` | Mã môn (vd `FIT5225`), bỏ trống nếu không phải bài môn học |
| `team_size`, `role` | Bắt buộc với project nhóm |
| `period` | Thời gian làm |
| `tags` | Dùng cho bộ lọc: Cloud, AI/ML, Planning, Data, Web |
| `stack` | Công nghệ dùng |
| `metrics` | Tối đa 3 cặp {giá trị, nhãn} |
| `links` | demo, github, diagram (bất kỳ, có thể trống) |
| `code_public` | `false` thì không hiện link code dù có |
| `cover` | Ảnh đại diện project |
| `featured`, `order` | `featured: true` thì vào mục nổi bật, `order` để sắp thứ tự |

Phần thân file là bài viết theo khuôn ở mục 5. File không có phần thân thì chỉ hiện thẻ trên lưới, không có trang chi tiết.

Thông tin cá nhân (tên, giới thiệu, học vấn, link) nằm trong **một file cấu hình** để Quan sửa không cần đụng code. Trong đó có thêm danh sách kinh nghiệm làm việc, để trống thì mục này không hiện (gọi của Claude, vì hiện chưa có dữ liệu).

## 7. Chất lượng

- Lighthouse (mobile) ≥ 95 cho Performance và Accessibility.
- Trên màn hình hẹp, ảnh đại diện nằm trên lời giới thiệu; lưới thẻ còn 1 cột.
- Có thẻ chia sẻ (Open Graph): link dán lên LinkedIn hiện tiêu đề, mô tả và ảnh.
- Mọi link ngoài mở được (kiểm tra lúc build hoặc trước khi deploy).
- Nút "Copy email" có phản hồi khi đã copy; vẫn có link `mailto:` để dự phòng.

## 8. Nội dung bản đầu

**Nổi bật (featured):**
1. **WildLens** — cá nhân. Hệ thống serverless trên AWS gắn nhãn loài cho ảnh/video từ bẫy ảnh: S3 → SQS (+DLQ) → container Lambda chạy MegaDetector rồi SpeciesNet → API có Cognito. Toàn bộ Terraform, CI dùng OIDC. Số liệu: chặn chi phí xấu nhất ~$4 (thay vì ~$80), 100% Terraform, 13 bước trong luồng xử lý. Có demo thật và trang giải thích kiến trúc tương tác.
2. **FIREBREAK** — nhóm 5 người (FIT5120). App chuẩn bị cho cháy rừng, có trợ lý giọng nói. Vue 3 + FastAPI. Vai trò của Quan: frontend, UI/UX, backend, điều khiển bằng giọng nói. Số liệu: 128/301 commit (nhiều nhất nhóm), 3 bản chạy thật, cubesix.me.
3. **CloudEco** — cá nhân (FIT5225). API nhận diện động vật YOLOv8 (ONNX) với FastAPI, Docker, Kubernetes kubeadm 3 node trên Oracle Cloud. Đo tải với 1/2/4/8 pod; README có bảng throughput, p95 và scaling efficiency, nên 3 con số lấy từ bảng đó. Cụm đã tắt nên không có demo.

Repo FIREBREAK (`zhan0042-gif/FIT5120-Assignment-TP03`) đang công khai, nên được gắn link.

**Lưới "More projects & coursework":**
- Aussie EcoLens (FIT5225, nhóm 4 người): nền tảng quan sát động vật serverless chạy trên nhiều cloud. Vai trò của Quan: Member A, phụ trách Auth, Cloud Foundation & Data Management. Không gắn link code vì repo là của bạn cùng nhóm (`code_public: false`, gọi của Claude).
- Too Many Chefs (FIT5222): bộ điều khiển lập kế hoạch PDDL. Chỉ đăng bài viết ở mức tổng quan: không có mã giả, không có số liệu không truy được nguồn (gọi của Claude).
- Piglet path-finding (FIT5222 A1): thuật toán tìm đường. Cùng quy tắc như trên.
- Các môn Macquarie: COMP2200 Data Science, COMP3210 Big Data, COMP1350 Database. Cần mô tả từ Quan, nếu không có thì bỏ.

## 9. Nguồn sự thật cho số liệu

- WildLens: `~/Projects/wildlens/README.md`, README profile `mingjun6886/mingjun6886`.
- FIREBREAK: `~/FIT5120-Assignment-TP03` (git log, README).
- CloudEco: `~/Monash Sem 1:2026/Cloud Computing/wildlife-yolo-detector-public/README.md`.
- Aussie EcoLens: `~/Monash Sem 1:2026/Cloud Computing/FIT5225_Assignment2_Group132/README.md` (vai trò Member A ở dòng ~236).

## 10. Quan cần cung cấp

- Ảnh đại diện.
- CV (PDF).
- Link LinkedIn.
- Tên bằng và năm học ở Monash và Macquarie.
- Thời điểm bắt đầu đi làm được.
- Có ghi quyền làm việc lên site không (tùy Quan).
- Tên muốn được gọi: hiện đang dùng "Quan".
- 1–2 câu "bài học" cho mỗi project nổi bật (Claude có thể viết nháp để Quan sửa).

Ảnh chụp màn hình WildLens và FIREBREAK, Claude có thể tự chụp từ site đang chạy.

## 11. Để builder quyết

Cấu trúc thư mục, tên component, cách làm bộ lọc (CSS/JS nhỏ), cách tạo ảnh Open Graph, cách nhúng sơ đồ kiến trúc (ảnh tĩnh hoặc link tới bản tương tác), cách kiểm tra link.

## 12. Việc liên quan nằm ngoài site

- README GitHub của Quan còn ghi tìm "internship". Nên sửa cho khớp với graduate/junior.
- Repo `mingjun6886/too-many-chefs` (bài FIT5222) đang công khai. Khuyên Quan chuyển sang private. Việc này Quan tự quyết.
