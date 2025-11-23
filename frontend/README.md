# TanoSpo - Sports Location Finder

A modern React application for finding and exploring sports locations with real-time weather information and interactive maps.

## 🚀 Features

- **User Authentication**: Login and registration system with Google OAuth support
- **Sports Selection**: Browse different sports categories
- **Real-time Weather**: Get current weather conditions based on your location
- **Location Discovery**: Find nearby sports facilities with detailed information
- **Interactive Maps**: Full-screen map integration with location details
- **Responsive Design**: Modern UI that works on all devices
- **Japanese Language Support**: Localized interface in Japanese

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Routing**: React Router DOM 7.9.6
- **Authentication**: React Google Login
- **Maps**: OpenStreetMap integration
- **Weather**: OpenWeatherMap API integration
- **Styling**: Modern CSS with gradients and animations
- **Build Tool**: Create React App

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/canhphu/Tanospo.git
cd Tanospo/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file in the frontend directory
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
```

## 🏃‍♂️ Usage

### Development Mode
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build for Production
```bash
npm run build
```
Builds the app for production to the `build` folder.

### Running Tests
```bash
npm test
```
Launches the test runner in the interactive watch mode.

## 📱 App Flow

1. **Login/Register**: User authentication with email/password or Google OAuth
2. **Sports Selection**: Choose your preferred sport category
3. **Weather Check**: View current weather conditions for your location
4. **Location Discovery**: Browse nearby sports facilities with detailed information
5. **Map View**: Interactive map showing selected locations with navigation options

## 🌐 Key Features Explained

### Authentication System
- Email/password login
- Google OAuth integration
- Secure session management
- Password reset functionality

### Weather Integration
- Real-time weather data based on user's location
- Temperature, humidity, and wind speed
- Air quality indicators
- Weather-appropriate recommendations

### Location Services
- Detailed facility information
- Operating hours and ratings
- Available amenities
- Distance from current location
- Interactive map integration

### UI/UX Features
- Modern gradient designs
- Smooth animations and transitions
- Mobile-responsive layout
- Interactive modals and overlays
- Consistent color scheme

## 🎨 Design System

- **Primary Colors**: Purple to blue gradients (#667eea to #764ba2)
- **Secondary Colors**: Orange to yellow gradients (#eac066 to #ee8331)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Animations**: Subtle hover effects and smooth transitions
- **Layout**: Card-based design with proper spacing

## 🔧 Configuration

### Environment Variables
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `REACT_APP_OPENWEATHER_API_KEY`: OpenWeatherMap API key

### API Integration
- **OpenWeatherMap**: For real-time weather data
- **OpenStreetMap**: For interactive map functionality
- **Google OAuth**: For user authentication

## 📂 Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── context/     # React context (Auth)
│   ├── pages/       # Page components
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Sports.js
│   │   ├── Weather.js
│   │   └── Map.js
│   └── styles/      # CSS stylesheets
├── package.json
└── README.md
```

## 🚀 Deployment

The app is ready for deployment to various platforms:
- **Netlify**: Static site hosting
- **Vercel**: Serverless deployment
- **GitHub Pages**: Free static hosting
- **AWS S3**: Cloud storage hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- OpenWeatherMap for weather API
- OpenStreetMap for map integration
- React team for the amazing framework
- Create React App for the project setup
