import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/shared/Layout";
import Flights from "@/pages/Flights";
import AccountPage from "@/pages/AccountPage";
import AboutUsPage from "@/pages/AboutUsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Flights />} />
        <Route path="flights" element={<Flights />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
