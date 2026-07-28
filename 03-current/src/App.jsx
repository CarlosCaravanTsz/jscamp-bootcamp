import { lazy, Suspense} from 'react'
import { Routes, Route } from 'react-router'
import { Header } from './components/Header'
import { Footer } from "./components/Footer";
import ProtectedRoute from './components/ProtectedRoute.jsx';
const HomePage = lazy(() => import("./pages/Home.jsx"));
const SearchPage = lazy(() => import("./pages/Search.jsx"));
const NotFoundPage = lazy(() => import("./pages/404.jsx"));
const JobDetail = lazy(() => import("./pages/Detail.jsx"));
const ProfilePage = lazy(() => import("./pages/Profile.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));


function App() {
  
  return (
    <>
      <Header />
      <Suspense fallback={<p>Cargando pagina...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="jobs/:jobId" element={<JobDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute redirectTo="/login">
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
export default App;