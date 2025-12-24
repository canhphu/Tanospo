# API Service Documentation

## Setup

Backend và Frontend đã được kết nối:

### Backend
- URL: `http://localhost:5000`
- CORS enabled cho `http://localhost:3000`
- Routes: `/api/auth`, `/api/locations`

### Frontend
- API Service: `src/services/api.js`
- Base URL: `http://localhost:5000/api`
- Auto-attach JWT token từ localStorage

## Cách sử dụng

### 1. Authentication

```javascript
import { authAPI } from '../services/api';

// Register
const registerUser = async () => {
  try {
    const response = await authAPI.register({
      name: 'Yamada',
      email: 'yamada@example.com',
      password: 'password123',
      language: 'ja',
      homeLat: 21.0285,
      homeLng: 105.8542
    });
    console.log(response.data);
  } catch (error) {
    console.error('Registration failed:', error.response?.data);
  }
};

// Login
const loginUser = async () => {
  try {
    const response = await authAPI.login({
      email: 'yamada@example.com',
      password: 'password123'
    });
    
    // Save token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  } catch (error) {
    console.error('Login failed:', error.response?.data);
  }
};

// Get Profile (requires token)
const getProfile = async () => {
  try {
    const response = await authAPI.getProfile();
    console.log(response.data);
  } catch (error) {
    console.error('Get profile failed:', error.response?.data);
  }
};
```

### 2. Locations

```javascript
import { locationsAPI } from '../services/api';

// Get all locations
const getLocations = async () => {
  try {
    const response = await locationsAPI.getAll({
      page: 1,
      limit: 10,
      search: 'park'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Get locations failed:', error);
  }
};

// Get location by ID
const getLocation = async (id) => {
  try {
    const response = await locationsAPI.getById(id);
    console.log(response.data);
  } catch (error) {
    console.error('Get location failed:', error);
  }
};

// Create location
const createLocation = async () => {
  try {
    const response = await locationsAPI.create({
      name: 'Central Park',
      address: '123 Main St',
      lat: 21.0285,
      lng: 105.8542,
      sport: 'tennis'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Create location failed:', error);
  }
};
```

### 3. Custom API Calls

```javascript
import api from '../services/api';

// Custom GET request
const customGet = async () => {
  try {
    const response = await api.get('/custom/endpoint');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

// Custom POST request
const customPost = async () => {
  try {
    const response = await api.post('/custom/endpoint', {
      data: 'value'
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

## Features

### Auto Token Management
- Token tự động được attach vào mỗi request
- Token được lưu trong localStorage
- Auto redirect về /login khi token hết hạn (401)

### Error Handling
- Global error handling trong interceptor
- Automatically handle 401 errors
- Custom error handling cho từng request

### Environment Variables
Tất cả config trong `.env`:
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `REACT_APP_OPENWEATHER_API_KEY` - OpenWeather API Key

## Khởi động

### Terminal 1: Backend
```bash
cd d:\workspace\itss\backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd d:\workspace\itss\frontend
npm start
```

Backend: http://localhost:5000
Frontend: http://localhost:3000
API Docs: http://localhost:5000/api-docs
