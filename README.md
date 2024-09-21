# IMS (Information Management System)

## Project Overview
This is the repository for the minor project for the 6th Semester, submitted to Forbes College under the supervision of ER Raj Kumar Sapkota. The IMS is a comprehensive student information management system designed to handle student records, certifications, employments, and projects.

## Features
- Student Registration
- Student Information Update
- Student Search and Filtering
- Certification Management
- Employment History Tracking
- Project Portfolio
- Photo Upload for Student Profiles

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js (Express.js framework)
- Database: MongoDB

## Key Components

### Frontend
1. **Student Details Page**
   - Displays comprehensive student information
   - Handles certifications, employments, and projects display

2. **Update/Delete Page**
   - Multi-step form for updating student information
   - Handles photo upload and preview
   - Manages certifications, employments, and projects

### Backend
1. **Student Controller**
   - Handles CRUD operations for student data
   - Manages related data like certifications, employments, and projects

## Setup and Installation

### Prerequisites
- Node.js
- MongoDB

### Installation Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/ims.git
    cd ims
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Register a Student
1. Navigate to the registration page.
2. Fill in the student details.
3. Click on the "Register" button.

### Update Student Information
1. Search for the student using the search functionality.
2. Click on the student to view details.
3. Click on the "Update" button.
4. Update the necessary information and click "Save".

### Delete a Student
1. Search for the student using the search functionality.
2. Click on the student to view details.
3. Click on the "Delete" button.

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student by ID
- `DELETE /api/students/:id` - Delete a student by ID

### Certifications
- `GET /api/students/:id/certifications` - Get certifications for a student
- `POST /api/students/:id/certifications` - Add a certification for a student

### Employments
- `GET /api/students/:id/employments` - Get employments for a student
- `POST /api/students/:id/employments` - Add an employment for a student

### Projects
- `GET /api/students/:id/projects` - Get projects for a student
- `POST /api/students/:id/projects` - Add a project for a student

### Skills
- `GET /api/students/:id/skills` - Get skills for a student
- `POST /api/students/:id/skills` - Add a skill for a student

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License
This project is licensed under the MIT License.

## Acknowledgements
- ER Raj Kumar Sapkota (Project Supervisor)
- Forbes College

## Contact
For any inquiries, please contact the project maintainers at [ranjanmarasini123@gmail.com].
