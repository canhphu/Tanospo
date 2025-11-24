# Tanospo Backend Template

Repository-pattern oriented Node.js + Express + PostgreSQL backend for the Tanospo project.

## Tech Stack

- Node.js 20+
- TypeScript
- Express
- PostgreSQL + PostGIS
- tsyringe for DI / repository wiring
- pg for database access

## Project Structure

```
src/
  application/       // use cases
  config/            // environment helpers
  container.ts       // DI registrations
  domain/            // entities, value objects, repository interfaces
  infrastructure/    // db pool, repository implementations, external APIs
  presentation/      // Express routes & middleware
```

## Getting Started

```bash
cd backend
npm install
npm run setup:env   # Tạo file .env từ template
# Chỉnh sửa file .env và điền thông tin database
npm run dev
```

Sau khi server chạy, truy cập **http://localhost:3000/api-docs** để xem Swagger UI.

### Database

1. Ensure PostgreSQL has the `uuid-ossp` and `postgis` extensions.
2. Create a database `tanospo` (or match `.env` values).
3. Run migrations:
   ```bash
   npm run migrate
   ```

### API Documentation (Swagger UI)

Sau khi cài đặt dependencies và chạy server, truy cập:

**http://localhost:3000/api-docs**

Tại đây bạn có thể:
- Xem tất cả API endpoints
- Test API trực tiếp trên giao diện web
- Xem request/response examples
- Thử các parameters khác nhau

### API Examples

- `POST /api/users` – register user
  ```json
  {
    "name": "Yamada",
    "email": "yamada@example.com",
    "language": "ja",
    "homeLat": 21.0285,
    "homeLng": 105.8542
  }
  ```
- `GET /api/locations/nearby?userId=<uuid>` – fetch recommended outdoor locations.

## Next Steps

- Implement auth (JWT/Firebase).
- Add repositories for videos, posts, comments, and integrate AQI/Weather services.
- Create automated tests for use cases and repositories.

