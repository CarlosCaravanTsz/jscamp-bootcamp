import { HomePage } from "./pages/Home";
import { SearchPage } from "./pages/Search";
import { Header } from './components/Header'
import { Footer } from "./components/Footer";
import { NotFoundPage } from "./pages/404";


function App() {

  const currentPath = window.location.pathname;

  let page = <NotFoundPage />
  if (currentPath === '/') {
    page = <HomePage />
  } else if (currentPath === '/search') {
    page = <SearchPage />
  } 
  
  return (
    <>
      <Header />
      {page}
      <Footer />
    </>
  );
}
export default App;