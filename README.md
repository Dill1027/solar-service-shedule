# Solar On-Grid Installation & Service Tracker

A comprehensive MERN stack application for managing solar on-grid system installations and service tracking.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete solar installations
- **Smart Service Scheduling**: Auto-calculate next service dates (6 months from installation/last service)
- **Advanced Search & Filter**: Search by customer name, location, and filter by capacity/location
- **Responsive Design**: Mobile-friendly interface
- **Sri Lankan Districts**: Complete dropdown of all Sri Lankan districts
- **System Capacity Management**: Predefined options with custom input capability
- **Service History Tracking**: Track installation and service dates

## 🛠️ Tech Stack

- **Frontend**: React.js with Bootstrap for styling
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (supports both local and Atlas)
- **Additional**: Moment.js for date handling, Axios for API calls

## 📋 Data Fields

### Installation Records

- Customer Name
- System Capacity (5kW, 10kW, 20kW, 30kW, 40kW, Other)
- Inverter Model (Huawei, Solis, Other)
- Location (Sri Lankan districts + custom address)
- Installation Date
- Last Service Date (optional)
- Notes

### Display Information

- Customer Name
- Location
- Capacity
- Installation Date
- Next Service Date (auto-calculated)
- Last Service Date ("Not yet" if no service)

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd solar-service-tracker
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/solar-tracker
   NODE_ENV=development
   ```

4. **Start the application**
   
   **Development mode (both client and server):**

   ```bash
   npm run dev
   ```
   
   **Or run separately:**

   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

5. **Access the application**

   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:5000>

## 🌐 API Endpoints

- `GET /api/installations` - Get all installations
- `POST /api/installations` - Create new installation
- `GET /api/installations/:id` - Get specific installation
- `PUT /api/installations/:id` - Update installation
- `DELETE /api/installations/:id` - Delete installation
- `GET /api/installations/search?q=query` - Search installations

## 📱 Key Features

### Search & Filter

- Real-time search by customer name and location
- Filter by system capacity and location
- Combined search and filter functionality

### Service Date Management

- Automatic calculation of next service date
- 6-month intervals from last service or installation
- Clear display of service status

### Data Validation

- Required field validation
- Date validation
- Capacity input validation
- Location verification

## 🏗️ Project Structure

```text
solar-service-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── utils/          # Utility functions
│   │   └── App.js         # Main App component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── server.js          # Server entry point
└── package.json           # Root package.json
```

## 🔄 Development Workflow

1. **Backend Development**: Start with API endpoints and database models
2. **Frontend Development**: Build React components and integrate with API
3. **Testing**: Test all CRUD operations and search functionality
4. **Styling**: Apply responsive design with Bootstrap

## 📦 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables (Production)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solar-tracker
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please create an issue in the repository.
