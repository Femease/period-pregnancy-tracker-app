# Period & Pregnancy Tracker API

## Overview
A TypeScript-based REST API for period tracking and prediction using machine learning algorithms. Built with Express.js and PostgreSQL, featuring advanced caching and queuing mechanisms for efficient predictions.

## File Structure
period-pregnancy-tracker/
├── src/
│ ├── app.ts # Express application setup
│ ├── config/
│ │ └── database.ts # PostgreSQL configuration
│ ├── models/
│ │ ├── User.ts # User interface
│ │ └── UserModel.ts # User database operations
│ ├── repositories/
│ │ └── postgres/
│ │ └── BaseRepository.ts # Base database operations
│ ├── services/
│ │ ├── PredictionService.ts # Basic prediction service
│ │ └── EnhancedPredictionService.ts # Advanced prediction service
│ └── scripts/
│ └── trainModel.ts # ML model training script

## Core Components

### Database (PostgreSQL)
- Connection pooling with configurable settings
- Base repository pattern for consistent database operations
- Transaction support
- Prepared statements for security

typescript
// Database Configuration Example
const dbConfig = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT || '5432'),
database: process.env.DB_NAME
};

### Services

#### PredictionService
Basic prediction service with core functionality:
typescript
class PredictionService {
async getPrediction(userId: string, data: InputData): Promise<Prediction>;
}

#### EnhancedPredictionService
Advanced prediction service with additional features:
- Caching layer
- Queue system
- Rate limiting
- Enhanced error handling

### Models

#### User Model
typescript
interface User {
id: string;
email: string;
password_hash: string;
created_at: Date;
updated_at: Date;
}

## API Endpoints

### Authentication

#### Register
http
POST /auth/register
Content-Type: application/json
{
"email": "user@example.com",
"password": "securePassword123"
}

#### Login
http
POST /auth/login
Content-Type: application/json
{
"email": "user@example.com",
"password": "securePassword123"
}

### Predictions

#### Get Period Prediction
http
POST /period-tracker/predict
Authorization: Bearer <token>
Content-Type: application/json
{
"lastPeriodDate": "2024-02-01",
"cycleHistory": [
{
"startDate": "2024-01-01",
"endDate": "2024-01-05",
"length": 28
}
],
"averageCycleLength": 28
}

## Setup & Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Environment Variables
env
Server
PORT=3000
NODE_ENV=development
Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=period_tracker_dev
Logging
LOG_LEVEL=info

### Installation Steps

1. Clone the repository:
bash
git clone https://github.com/yourusername/period-pregnancy-tracker.git
cd period-pregnancy-tracker

2. Install dependencies:
bash
npm install

3. Initialize database:
bash
npm run init-db

4. Start development server:
bash
npm run dev

## Error Handling

### Standard Error Response
json
{
"error": "Error message",
"details": "Additional error details"
}

### HTTP Status Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 429: Too Many Requests
- 500: Internal Server Error

## Development Commands

bash
Run tests
npm test
Lint code
npm run lint
Build project
npm run build
Start production server
npm start

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License
MIT License
This updated README:
Focuses on the actual implemented files and features
Provides clear code examples
Shows the exact file structure
Includes detailed setup instructions
Documents all API endpoints
Includes error handling information
Lists development commands
Maintains a clean, organized structure 