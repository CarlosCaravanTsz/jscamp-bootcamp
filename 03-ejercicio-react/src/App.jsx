import { HomePage } from "./pages/Home";
import { SearchPage } from "./pages/Search";
import { Header } from './components/Header'
import { Footer } from "./components/Footer";
//import { NotFoundPage } from "./pages/404";
import { Route } from "./components/Route";


function App() {
  
  
  return (
    <>
      <Header />
      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Footer />
    </>
  );
}
export default App;