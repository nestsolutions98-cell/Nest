# 🏋️‍♂️ Sports Club Management System

A modern, responsive web application for managing sports club courses, students, and communications.

## ✨ Features

### 📅 Calendar View
- **Weekly Calendar**: View all courses in a Microsoft Outlook-style calendar
- **Daily View**: Focus on specific days
- **Course Details**: Click on any course to see enrolled students and coach information
- **Navigation**: Easy week-to-week navigation with "Today" button

### 👥 Student Management
- **Student Profiles**: Complete student information including:
  - First Name and Father's Name
  - Phone Number
  - Date of Birth (with auto-calculated age)
  - National ID Number
- **Payment Tracking**: Record and view monthly payments
- **Course Enrollments**: See all courses a student is enrolled in
- **Search Functionality**: Find students by name, phone, or ID

### 🏃‍♂️ Course Management
- **Course Creation**: Add new courses with:
  - Course name and coach
  - Start date and time
  - Number of sessions and frequency per week
  - Automatic end date calculation
- **Course Deletion**: Remove courses from the system
- **Student Enrollment**: Add/remove students from courses

### 💬 WhatsApp Integration
- **Bulk Messaging**: Send WhatsApp messages to all students in a course
- **Individual Messaging**: Send direct messages to specific students
- **Custom Messages**: Enter your own message content before sending

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Local Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

### 🚂 Railway Deployment

This application is configured to work with Railway for easy cloud deployment:

1. **Fork or clone this repository**

2. **Connect to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL Database**:
   - In your Railway project, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set the `DATABASE_URL` environment variable

4. **Set Environment Variables** (optional):
   - `SECRET_KEY`: A secure random string for Flask sessions
   - `ADMIN_USERNAME`: Admin username (default: admin)
   - `ADMIN_PASSWORD`: Admin password (default: admin123)

5. **Deploy**:
   - Railway will automatically detect the Python app and deploy it
   - Your app will be available at the provided Railway URL

6. **Access your app**:
   - Click on the deployed service to get your app URL
   - Login with your admin credentials

## 📁 Project Structure

```
nest/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── instance/
│   ├── sport_courses.db      # SQLite database
│   ├── sport_courses_backup.db 
│   └── sport_courses_test.db
└── static/
    ├── css/
    │   ├── course.css
    │   └── style.css 
    └── js/
        ├── student.js
        ├── course.js
        ├── course_profile.js
        └── app.js        # JavaScript functionality
```

## 🗄️ Database Schema

The application uses SQLite with the following tables:

- **courses**: Course information (name, teacher, dates, sessions)
- **students**: Student information (name, phone, ID, etc.)
- **course_enrollments**: Many-to-many relationship between courses and students
- **payments**: Monthly payment records for students

## 🎨 Design Features

- **Modern UI**: Clean, professional design using Tailwind CSS
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Intuitive Navigation**: Easy-to-use tab-based interface
- **Real-time Updates**: Dynamic content loading without page refreshes

## 🔧 API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `DELETE /api/courses/<id>` - Delete course
- `GET /api/courses/<id>/students` - Get students in course

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/<id>` - Get student details
- `DELETE /api/students/<id>` - Delete student
- `GET /api/students/<id>/payments` - Get student payments
- `POST /api/students/<id>/payments` - Add payment

### Calendar
- `GET /api/calendar/weekly` - Get weekly calendar data

### WhatsApp
- `GET /api/whatsapp/send` - Generate WhatsApp URL

## 🎯 Usage Guide

### Adding a Course
1. Click on the "Courses" tab
2. Click "Add Course" button
3. Fill in the required information:
   - Course name
   - Coach name
   - Start date
   - Time
   - Number of sessions
   - Sessions per week
4. Click "Create Course"

### Adding a Student
1. Click on the "Students" tab
2. Click "Add Student" button
3. Fill in all required fields:
   - First Name
   - Father's Name
   - Phone Number
   - Date of Birth
   - National ID
4. Click "Add Student"

### Managing Course Enrollments
1. Click on any course in the calendar or courses list
2. View enrolled students
3. Use "Add Student" to enroll new students
4. Use the "×" button to remove students

### Sending WhatsApp Messages
1. Open a course modal
2. Click "Send WhatsApp Message to All Students"
3. Enter your message
4. Click "Send Message" - this will open WhatsApp for each student

### Viewing Student Profiles
1. Click on any student's "Profile" button
2. View student information, payment history, and enrolled courses
3. Add payments or send individual WhatsApp messages

## 🔒 Data Migration

The application automatically migrates data from the existing `sport_courses.db` file if it exists. The migration process:
- Converts old "participants" to new "students" structure
- Preserves course and enrollment data
- Maintains payment records

## 🛠️ Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the appearance by:
- Modifying the CSS classes in `templates/index.html`
- Adding custom CSS in the `<style>` section
- Updating the Tailwind configuration

### Features
To add new features:
- Add new routes in `app.py`
- Create corresponding JavaScript functions in `static/js/app.js`
- Update the HTML template as needed

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the port by setting the `PORT` environment variable: `PORT=5001 python app.py`

2. **Database errors**:
   - Delete `sport_courses.db` and restart the application to create a fresh database

3. **WhatsApp not opening**:
   - Ensure WhatsApp is installed on your device
   - Check that phone numbers are in the correct format (country code + number)

### Getting Help

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the terminal for Python errors
3. Ensure all dependencies are installed correctly

## 📱 Mobile Usage

The application is fully responsive and works great on mobile devices:
- Touch-friendly interface
- Optimized for small screens
- Easy navigation with thumb-friendly buttons
- WhatsApp integration works seamlessly on mobile

## 🔄 Updates and Maintenance

To update the application:
1. Stop the current server (Ctrl+C)
2. Update the code files
3. Restart the application: `python app.py`

The database will be preserved between updates.

## 🚚 Exporting & Onboarding for New Developers

To share or continue development on this project:

1. **Clone or unzip the project folder** on your machine.
2. **(Recommended) Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Initialize the database:**
   - For a fresh database:
     ```bash
     python app.py
     ```
   - To populate with Arabic test/demo data:
     ```bash
     python app.py --populate-test-db
     ```
5. **Run the app:**
   ```bash
   python app.py
   ```
   The app will be available at [http://localhost:5000](http://localhost:5000).

6. **Database files:**
   - Default database is `sport_courses.db` in the `instance/` folder.
   - For test/demo data, use `--populate-test-db` (creates `sport_courses_test.db`).

7. **Collaboration:**
   - Use Git for version control and collaboration.
   - Avoid committing large or sensitive database files unless needed for demo/testing.

---

**Enjoy managing your sports club! 🏆** 