# Tanospo API Documentation

## Swagger/OpenAPI Documentation

File `swagger.json` chứa OpenAPI 3.0 specification cho Tanospo API.

### Cách sử dụng

#### 1. Sử dụng Swagger UI Online

Truy cập [Swagger Editor](https://editor.swagger.io/) và paste nội dung file `swagger.json` để xem và test API.

#### 2. Sử dụng Swagger UI Local (Recommended)

Cài đặt Swagger UI để chạy local:

```bash
# Cài đặt swagger-ui-express (nếu chưa có)
npm install --save-dev swagger-ui-express

# Hoặc sử dụng Docker
docker run -p 8080:8080 -e SWAGGER_JSON=/docs/swagger.json -v $(pwd)/docs:/docs swaggerapi/swagger-ui
```

Sau đó truy cập: `http://localhost:8080`

#### 3. Sử dụng Postman

1. Mở Postman
2. Import → File → Chọn `swagger.json`
3. Postman sẽ tự động tạo collection với tất cả endpoints

#### 4. Sử dụng Insomnia

1. Mở Insomnia
2. Import → From File → Chọn `swagger.json`
3. Test API trực tiếp trong Insomnia

### API Endpoints

#### Health Check
- `GET /health` - Kiểm tra trạng thái API

#### Users
- `POST /api/users` - Đăng ký user mới

#### Locations
- `GET /api/locations/nearby` - Tìm địa điểm gần nhất

### Testing với cURL

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Register User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yamada Taro",
    "email": "yamada@example.com",
    "language": "ja",
    "homeLat": 21.0285,
    "homeLng": 105.8542
  }'
```

#### Get Nearby Locations
```bash
# Sử dụng coordinates
curl "http://localhost:5000/api/locations/nearby?lat=21.0285&lng=105.8542&radius=2000"

# Sử dụng userId
curl "http://localhost:5000/api/locations/nearby?userId=123e4567-e89b-12d3-a456-426614174000"
```

### Lưu ý

- Đảm bảo server đang chạy (`npm run dev`)
- Database đã được migrate (`npm run migrate`)
- File `.env` đã được cấu hình đúng

