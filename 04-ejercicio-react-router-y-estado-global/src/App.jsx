import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const SearchPage = lazy(() => import("./pages/Search.jsx"));
const NotFoundPage = lazy(() => import("./pages/404.jsx"));
const JobDetail = lazy(() => import("./pages/Detail.jsx"));
//const ProfilePage = lazy(() => import("./pages/Profile.jsx"));
//const Login = lazy(() => import("./pages/Login.jsx"));
//const Register = lazy(() => import("./pages/Register.jsx"));

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<p>Cargando pagina...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="job/:jobId" element={<JobDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
