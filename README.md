# 🛍️ ShaqaWear – E-Commerce Web Application

---

## 📌 Source Code

The full source code and SQL scripts are available on GitHub:
👉 https://github.com/Shaqayeq6/e-commerce-project

### **How to Download**

```bash
git clone https://github.com/Shaqayeq6/e-commerce-project.git
cd e-commerce-project
```

Submitted on eClass.

### **Cloud Deployment**

**Frontend URL:** https://e-commerce-project-ctdz.vercel.app?_vercel_share=332yQQ5y4Nyrjj7d9u7sBlTnYCJq3VXx

**Backend URL:** https://e-commerce-project-63vb.onrender.com

---

### **Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and add the following:

```env
DB_MODE=postgres
DATABASE_URL=postgresql://neondb_owner:npg_QEnbhPj78uAO@ep-round-hill-ajnl56mm-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=stepstyle.store.team@gmail.com
SMTP_PASS=pkmrfkzoorfyleps
SMTP_FROM="StepStyle <stepstyle.store.team@gmail.com>"
```

**Seed the database:**
```bash
npm run seed:postgres
```

**Start the backend:**
```bash
npx nodemon server.js
```

Backend runs on: `http://localhost:5001`

---

### **Local PostgreSQL Setup**
If you want to run the project using a database on your local machine instead of the hosted online database, install PostgreSQL locally and create a database.

Example local connection string for the `backend/.env` file:

```env
DB_MODE=postgres
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/shaqawear

**Run the seed script:**
npm run seed:postgres

This will create the tables and populate the local PostgreSQL database using the project seed data.

**Start backend normally:**
npx nodemon server.js

---

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

---

### **SQL Scripts**

The SQL schema file is included in the repository at:
`backend/schema.sql`

The PostgreSQL seed script is included at:
`backend/seed-postgres.js`

---

### **Admin Credentials**

**Admin Email:** admin@example.com

**Admin Password:** password123
