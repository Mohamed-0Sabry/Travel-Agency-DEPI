// import { Routes, Route } from 'react-router-dom'
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Flights from "./pages/Flights";

export default function App() {
  return (
    <>
      <Header />
      {/* <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
        </Routes>
      </main> */}
      <Flights />
      <Footer />
    </>
  );

  // import TestComponentsPage from './pages/TestComponentsPage'

  // const App = () => {
  //   return (
  //     <div>
  //       {/* <Header /> */}
  //         <TestComponentsPage />
  //       {/* <Footer /> */}
  //     </div>
  //   )
  // }

  // export default App;
}
