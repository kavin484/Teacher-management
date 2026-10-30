# TeacherHub — React Frontend

A modern, responsive React interface for the Teacher Management Spring Boot REST API.

---

## 🚀 Features

- **Full CRUD Operations**:
  - **Create**: Add new faculty profiles with validated fields (`name`, `dob`, `ph`).
  - **Read**: View list of faculty records in a table or card grid layout.
  - **Update**: Edit existing teacher records via interactive modal dialog.
  - **Delete**: Safe delete with confirmation prompt.
- **Search & Filter**: Real-time filtering by teacher name, phone number, or date of birth.
- **Quick Statistics**: Real-time summary cards for total faculty, average age, and active contacts.
- **Backend Status Monitor**: Live connectivity badge showing whether the Spring Boot API is reachable.
- **Toast Notifications**: Feedback messages for all user actions.
- **Vite Proxy**: Built-in proxy to `http://localhost:8080/api` so you don't encounter CORS issues during development.

---

## 🛠️ How to Run

### 1. Start the Spring Boot Backend
From the `Teacher` directory (or inside IntelliJ):
```bash
cd Teacher
./mvnw spring-boot:run
```
The backend starts at `http://localhost:8080`.

### 2. Start the React Frontend
From the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Scripts

- `npm run dev`: Runs the development server at `http://localhost:5173`
- `npm run build`: Bundles the production build to `dist/`
- `npm run preview`: Previews the production build locally
