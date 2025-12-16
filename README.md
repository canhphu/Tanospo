# Tanospo - Hướng dẫn Chạy Dự Án

Dự án Tanospo là một ứng dụng tìm kiếm địa điểm thể thao với frontend React và backend Node.js/Express kết nối MongoDB.

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: phiên bản 20 trở lên
- **npm**: đi kèm với Node.js
- **Docker** và **Docker Compose**: để chạy MongoDB (hoặc MongoDB đã cài đặt sẵn)
- **Git**: để clone repository

## 🏗️ Cấu Trúc Dự Án

```
Tanospo/
├── backend/          # Backend API (Node.js + Express + MongoDB)
├── frontend/         # Frontend (React)
├── docker-compose.yml # Cấu hình Docker cho MongoDB
└── README.md         # File này
```

## 🚀 Hướng Dẫn Chạy Dự Án

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd Tanospo
```

### Bước 2: Chạy Database (MongoDB)

Có 2 cách để chạy MongoDB:

#### Cách 1: Sử dụng Docker Compose (Khuyến nghị)

Từ thư mục gốc của dự án:

```bash
docker-compose up -d
```

Lệnh này sẽ:
- Tải và chạy MongoDB container
- Expose MongoDB trên port `27017`
- Lưu dữ liệu vào `./backend/mongodbdata`

Để dừng MongoDB:
```bash
docker-compose down
```

#### Cách 2: Sử dụng MongoDB đã cài đặt

Nếu bạn đã cài MongoDB trên máy, đảm bảo MongoDB đang chạy:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# hoặc
mongod
```

### Bước 3: Cấu Hình và Chạy Backend

1. **Cài đặt dependencies:**
```bash
cd backend
npm install
```

2. **Thiết lập file môi trường:**
```bash
npm run setup:env
```

3. **Chỉnh sửa file `.env`** (được tạo trong thư mục `backend`):
```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB=tanospo
JWT_SECRET=your-secret-key-here
GMAPS_KEY=your-google-maps-api-key
AQI_KEY=your-air-quality-api-key
OPENWEATHER_KEY=your-openweather-api-key
PORT=5000
```

4. **Chạy backend:**
```bash
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

API Documentation (Swagger UI): **http://localhost:5000/api-docs**

### Bước 4: Cấu Hình và Chạy Frontend

Mở terminal mới (giữ backend đang chạy):

1. **Cài đặt dependencies:**
```bash
cd frontend
npm install
```

2. **Tạo file `.env`** trong thư mục `frontend`:
```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_OPENWEATHER_API_KEY=your-openweather-api-key
```

3. **Chạy frontend:**
```bash
npm start
```

Frontend sẽ tự động mở tại: **http://localhost:3000**

## 📝 Tóm Tắt Các Lệnh Chạy Nhanh

Từ thư mục gốc `Tanospo`:

### Terminal 1 - Database:
```bash
docker-compose up -d
```

### Terminal 2 - Backend:
```bash
cd backend
npm install
npm run setup:env
# Chỉnh sửa file .env
npm run dev
```

### Terminal 3 - Frontend:
```bash
cd frontend
npm install
# Tạo file .env với các biến môi trường cần thiết
npm start
```

## 🔧 Các Port Mặc Định

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Swagger UI**: http://localhost:5000/api-docs

## 📚 Tài Liệu Chi Tiết

- [Backend README](./backend/README.md) - Chi tiết về backend API, entities, và endpoints
- [Frontend README](./frontend/README.md) - Chi tiết về frontend, components, và features

## 🛠️ Các Lệnh Hữu Ích

### Backend
```bash
cd backend
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production build
npm run setup:env    # Tạo file .env từ template
```

### Frontend
```bash
cd frontend
npm start            # Chạy development server
npm run build        # Build production
npm test             # Chạy tests
```

### Docker
```bash
docker-compose up -d     # Chạy MongoDB
docker-compose down      # Dừng MongoDB
docker-compose logs      # Xem logs
docker-compose ps        # Kiểm tra trạng thái
```

## ⚠️ Lưu Ý Quan Trọng

1. **MongoDB phải chạy trước khi start backend** - Backend sẽ không kết nối được nếu MongoDB chưa sẵn sàng
2. **File .env** - Đảm bảo đã cấu hình đầy đủ các biến môi trường trong cả `backend/.env` và `frontend/.env`
3. **API Keys** - Bạn cần có các API keys sau:
   - Google Maps API key
   - OpenWeather API key
   - Air Quality Index API key (nếu có)
   - Google OAuth Client ID (cho frontend)

## 🐛 Xử Lý Lỗi Thường Gặp

### MongoDB không kết nối được
- Kiểm tra MongoDB đã chạy: `docker-compose ps`
- Kiểm tra port 27017 có bị chiếm không
- Xem logs: `docker-compose logs mongodb`

### Backend không start được
- Kiểm tra file `.env` đã tồn tại và đúng format
- Kiểm tra MongoDB đã chạy
- Xem logs trong terminal để biết lỗi cụ thể

### Frontend không kết nối được với Backend
- Kiểm tra backend đã chạy tại port 5000
- Kiểm tra CORS settings trong backend
- Kiểm tra API endpoint trong frontend code

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs của từng service
2. Xem tài liệu chi tiết trong các thư mục `backend/README.md` và `frontend/README.md`
3. Tạo issue trên repository

