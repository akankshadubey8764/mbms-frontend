# Quick Start Guide - TPGIT Hostel Mess Management System

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies (Already Done ✅)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
**The app is now running at:** http://localhost:5173/

### 3. Access the Application
Open your browser and navigate to: **http://localhost:5173/**

---

## 📱 Available Pages

### Public Pages (No Login Required):
- **Home:** http://localhost:5173/
- **About:** http://localhost:5173/about
- **Contact:** http://localhost:5173/contact
- **Registration:** http://localhost:5173/registration
- **Login:** http://localhost:5173/login

### Protected Pages (Login Required):
- **Student Dashboard:** http://localhost:5173/student-dashboard
- **Admin Dashboard:** http://localhost:5173/admin-dashboard
- **Mess Users Dashboard:** http://localhost:5173/mess-users-dashboard

---

## 🔐 Test Login Credentials

Since the backend is not yet connected, you can test the UI by:

1. Go to http://localhost:5173/login
2. Select a role (Student/Admin/Mess Manager)
3. Enter any email and password
4. Click "Sign In"

**Note:** The login will fail until the backend API is connected. To test the dashboards directly, you can manually set localStorage:

```javascript
// Open browser console (F12) and run:
localStorage.setItem('authToken', 'test-token');
localStorage.setItem('userRole', 'student'); // or 'admin' or 'mess'
// Then navigate to the respective dashboard
```

---

## 🎨 Key Features to Explore

### 1. **Responsive Design**
- Resize your browser window to see mobile/tablet/desktop views
- Try the hamburger menu on mobile view

### 2. **Navigation**
- Click through all pages to see the active state highlighting
- Notice smooth transitions and animations

### 3. **Forms**
- Registration form with file upload
- Contact form with validation
- Feedback submission in student dashboard

### 4. **Dashboards**
- **Student:** View mess bill, attendance, submit feedback
- **Admin:** Manage students, filter by department/year, update bills
- **Mess:** Manage groceries and stock with status indicators

### 5. **Design Elements**
- Gradient backgrounds
- Hover effects on cards and buttons
- Smooth animations
- Professional color scheme

---

## 🔧 Configuration

### Environment Variables (.env):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**To change the backend URL:**
1. Edit the `.env` file
2. Update `VITE_API_BASE_URL` to your backend URL
3. Restart the dev server

---

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The production build will be in the `dist/` folder.

---

## 🐛 Troubleshooting

### Issue: Dev server won't start
**Solution:** Make sure no other process is using port 5173
```bash
# Kill process on port 5173 (Mac/Linux)
lsof -ti:5173 | xargs kill -9
```

### Issue: Styles not loading
**Solution:** Clear browser cache and restart dev server
```bash
# Stop server (Ctrl+C)
# Clear node_modules/.vite cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

### Issue: TypeScript errors
**Solution:** Run type checking
```bash
npx tsc --noEmit
```

---

## 📚 Project Structure

```
src/
├── app/              → Page components (routing)
├── components/       → Reusable UI components
│   ├── Layout/      → Navbar, Footer
│   └── Dashboard/   → Dashboard components
├── api/             → API configuration
├── App.tsx          → Main app with routes
├── main.tsx         → Entry point
└── index.css        → Global styles
```

---

## 🎯 Next Steps

1. **Connect Backend:**
   - Set up backend API at `http://localhost:3000/api`
   - Implement authentication endpoints
   - Test API integration

2. **Test Features:**
   - Register a new student
   - Login with different roles
   - Test all CRUD operations

3. **Customize:**
   - Update colors in `tailwind.config.js`
   - Modify content in component files
   - Add new features as needed

---

## 💡 Tips

- **Hot Reload:** Changes to files automatically reload the browser
- **Console:** Check browser console (F12) for errors
- **Network Tab:** Monitor API calls in browser DevTools
- **React DevTools:** Install React DevTools extension for debugging

---

## 📞 Support

For questions or issues:
- Check the README.md for detailed documentation
- Review PROJECT_SUMMARY.md for complete feature list
- Contact: hostel@tpgit.edu.in

---

**Happy Coding! 🚀**
