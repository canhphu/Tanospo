# Tanospo Backend Template

Repository-pattern oriented Node.js + Express + MongoDB backend for the Tanospo project.

## Tech Stack

- Node.js 20+
- TypeScript
- Express
- MongoDB
- tsyringe for DI / repository wiring
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
src/
  application/       // use cases & services
  config/            // environment helpers
  container.ts       // DI registrations
  domain/            // entities, value objects, repository interfaces
  infrastructure/    // MongoDB connection, repository implementations, external APIs
  presentation/      // Express routes & middleware
```

## Getting Started

```bash
cd backend
npm install
npm run setup:env   # Tạo file .env từ template
# Chỉnh sửa file .env và điền thông tin MongoDB connection string
npm run dev
```

Sau khi server chạy, truy cập **http://localhost:5000/api-docs** để xem Swagger UI.

### Database

1. Ensure MongoDB is running (local or MongoDB Atlas).
2. Set `MONGO_URI` in your `.env` file:
   - Local: `mongodb://localhost:27017`
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net`
3. Set `MONGO_DB` (default: `tanospo`).
4. MongoDB will automatically create collections and indexes when needed.

### Environment Variables

Required environment variables (see `config/env.sample`):

- `MONGO_URI` - MongoDB connection string
- `MONGO_DB` - Database name (default: `tanospo`)
- `JWT_SECRET` - Secret key for JWT tokens
- `GMAPS_KEY` - Google Maps API key
- `AQI_KEY` - Air Quality Index API key
- `OPENWEATHER_KEY` - OpenWeather API key
- `PORT` - Server port (default: 5000)

### API Documentation (Swagger UI)

Sau khi cài đặt dependencies và chạy server, truy cập:

**http://localhost:5000/api-docs**

Tại đây bạn có thể:
- Xem tất cả API endpoints
- Test API trực tiếp trên giao diện web
- Xem request/response examples
- Thử các parameters khác nhau

### API Examples

#### Authentication

- `POST /api/auth/register` – register user
  ```json
  {
    "name": "Yamada",
    "email": "yamada@example.com",
    "password": "password123",
    "language": "ja",
    "homeLat": 21.0285,
    "homeLng": 105.8542
  }
  ```

- `POST /api/auth/login` – login user
  ```json
  {
    "email": "yamada@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/profile` – get user profile (requires Bearer token)
  ```
  Authorization: Bearer <token>
  ```

#### Locations

- `GET /api/locations/nearby?userId=<id>` – fetch recommended outdoor locations
- `GET /api/locations/nearby?lat=21.0285&lng=105.8542&radius=2000` – find locations by coordinates

## Entities

The following entities are available:

- **User** - User accounts with authentication
- **Location** - Outdoor locations with geospatial data
- **Post** - User posts/check-ins
- **Comment** - Comments on posts
- **Video** - Exercise videos
- **VideoReview** - User reviews for videos
- **WatchHistory** - Video watch history
- **Favorite** - User favorites (locations, videos, posts)
- **GoogleAccount** - Google OAuth integration
- **AQIReading** - Air quality readings for locations
- **WeatherForecast** - Weather forecasts for locations
- **LocationImage** - Images for locations

## Next Steps

- Implement additional use cases for posts, comments, and videos
- Add repositories for all entities
- Integrate AQI/Weather services
- Create automated tests for use cases and repositories

