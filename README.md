# TPGIT Hostel Mess Bill Management System - Frontend

A modern, responsive React (Vite) frontend application for managing hostel mess bills, student attendance, and administrative tasks.

## 🚀 Features

### Public Pages
- **Home**: Hero section with hostel information, vision/mission, features, and guidelines
- **About**: Detailed information about boys' and girls' hostels
- **Contact**: Contact form and information
- **Registration**: Student hostel registration form with file upload
- **Login**: Role-based authentication (Student/Admin/Mess Manager)

### Student Dashboard
- View current mess bill (default: ₹2000)
- Track attendance (Days Present/Absent)
- Submit feedback and queries
- View student profile information

### Admin Dashboard
- Manage hostel students list
- Filter students by department and year
- View and update mess bills
- Calculate bills based on attendance
- Remove students
- Approve new registrations

### Mess Users Dashboard
- Manage groceries inventory
- Track stock levels with status indicators
- View analytics and trends (chart placeholders)
- Add/Edit/Delete inventory items

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Fonts**: Inter, Roboto Condensed (Google Fonts)

## 📁 Project Structure

```
src/
├── app/                          # Page Routing Components
│   ├── home.tsx
│   ├── about.tsx
│   ├── contact.tsx
│   ├── registration.tsx
│   ├── login.tsx
│   ├── student-dashboard.tsx
│   ├── admin-dashboard.tsx
│   └── mess-users-dashboard.tsx
├── components/                   # UI Components
│   ├── Layout/
│   │   ├── Navbar.tsx           # Responsive navbar with active state
│   │   └── Footer.tsx           # Footer with links and contact info
│   ├── Dashboard/
│   │   ├── StudentDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── MessUsersDashboard.tsx
│   ├── HomeContent.tsx
│   ├── AboutContent.tsx
│   ├── ContactContent.tsx
│   └── RegistrationForm.tsx
├── api/                          # API Configuration
│   └── apiClient.ts             # Axios instance with interceptors
├── App.tsx                       # Main app with routing
├── main.tsx                      # Entry point
└── index.css                     # Tailwind + Custom styles
```

## 🎨 Design Features

- **Premium Aesthetics**: Modern gradients, glassmorphism effects, and smooth animations
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Color Scheme**: Professional Blue/White/Gray palette (Primary: #007bff)
- **Animations**: Fade-in, slide-in, and hover effects for enhanced UX
- **Accessibility**: Semantic HTML, proper heading hierarchy, and ARIA labels

## 🔧 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 🔐 Authentication & Authorization

The application implements role-based access control (RBAC):

- **Public Routes**: Home, About, Contact, Registration, Login
- **Student Routes**: Student Dashboard (requires student role)
- **Admin Routes**: Admin Dashboard (requires admin role)
- **Mess Routes**: Mess Users Dashboard (requires mess role)

Authentication tokens are stored in localStorage and automatically included in API requests via Axios interceptors.

## 📡 API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login

### Student
- `GET /api/student/dashboard` - Get student dashboard data
- `POST /api/student/feedback` - Submit feedback/query

### Admin
- `GET /api/admin/students` - Get all students
- `PUT /api/admin/students/:id/update-bill` - Update student bill
- `DELETE /api/admin/students/:id` - Remove student

### Mess
- `GET /api/mess/groceries` - Get groceries list
- `GET /api/mess/stocks` - Get stock data

### Contact
- `POST /api/contact/submit` - Submit contact form

## 🎯 Key Features Implementation

### Mess Bill Calculation
The admin dashboard calculates mess bills based on attendance:
```typescript
const calculateMessBill = (daysPresent: number, daysAbsent: number) => {
  const baseBill = 2000;
  const totalDays = daysPresent + daysAbsent;
  if (totalDays === 0) return baseBill;
  return Math.round((baseBill * daysPresent) / totalDays);
};
```

### Protected Routes
Routes are protected using a custom `ProtectedRoute` component that checks for authentication tokens and user roles.

### Responsive Navbar
The navbar automatically highlights the active page and includes a mobile menu with smooth animations.

## 🎨 Custom Styling

The application uses Tailwind CSS with custom utilities defined in `index.css`:

- **Animations**: `animate-fade-in`, `animate-slide-in`
- **Components**: `card-hover`, `feature-box`, `btn-primary`, `btn-secondary`
- **Forms**: `form-input`, `form-label`
- **Tables**: `table-container`, `table-header`, `table-row`
- **Gradients**: `gradient-primary`, `gradient-secondary`
- **Effects**: `glass-effect` (glassmorphism)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables on your hosting platform

Recommended platforms:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📝 License

This project is part of the TPGIT Hostel Mess Management System.

## 👥 Support

For support and queries, contact: hostel@tpgit.edu.in
