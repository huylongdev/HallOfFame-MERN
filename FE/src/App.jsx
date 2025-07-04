import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PlayerDetailPage from "./pages/PlayerDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import PlayersAdminPage from "./pages/admin/PlayersAdminPage";
import TeamsAdminPage from "./pages/admin/TeamsAdminPage";
import AccountsAdminPage from "./pages/admin/AccountsAdminPage";

export default function AppRoutes() {
  const { token, isAdmin } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />
        <Route
          path="/login"
          element={!token ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <RegisterPage /> : <Navigate to="/" />}
        />

        {token && !isAdmin && (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </>
        )}
        {token && isAdmin && (
          <>
            <Route path="/admin/players" element={<PlayersAdminPage />} />
            <Route path="/admin/teams" element={<TeamsAdminPage />} />
            <Route path="/admin/accounts" element={<AccountsAdminPage />} />
          </>
        )}
        <Route
          path="*"
          element={
            <div className="text-center text-2xl mt-10">
              404 - Page not found
              </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
