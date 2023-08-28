import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Register from "./register/Register";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Modal from "./register/modal/Modal";
import DashBoard from "./dashboard/DashBoard";
import { Confirmation } from "./dashboard/components/Confirmation";
import AdminLogin from "./admin/Login";
import AdminDashboard from "./admin_dashboard/AdminDashboard";
import TraderProfile from "./admin_dashboard/components/TraderProfile";

function App() {

  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/modal" element={<Modal />}/>
        <Route path="/dashboard" element={<DashBoard />}/>
        <Route path="/confirmation" element={<Confirmation />}/>
        <Route path="/admin" element={<AdminLogin />}/>
        <Route path="/admin_dashboard" element={<AdminDashboard />}/>
        <Route path="/profile" element={<TraderProfile isAdmin={true} />}/>
      </Routes>
    </BrowserRouter>
  </div>

}

export default App;
