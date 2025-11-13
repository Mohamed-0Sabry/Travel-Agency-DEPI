import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./shared/Layout";
import Flights from "./pages/Flights";
import AccountPage from "./pages/AccountPage";
import AboutUsPage from "./pages/AboutUsPage";
import Discover from "./Components/Discover";
function ComingSoon({ title }: { title: string }) {
  return (
    <section className="py-5">
      <div className="container text-center">
        <h1 className="display-5 fw-bold mb-3">{title}</h1>
        <p className="lead text-muted">
          We&apos;re working hard to bring you this page. Check back soon!
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Flights />} />
        <Route path="flights" element={<Flights />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="hotels" element={<ComingSoon title="Hotels" />} />
        <Route path="discover" element={<Discover />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="contact" element={<ComingSoon title="Contact" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
