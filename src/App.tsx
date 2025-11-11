// import { Routes, Route } from 'react-router-dom'
import Header from './shared/Header'
import Footer from './shared/Footer'

// export default function App() {
//   return (
//     <>
//       <Header />
//       <main>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/destinations" element={<Destinations />} />
//         </Routes>
//       </main>
//       <Footer />
//     </>
//   )
// }


import TestComponentsPage from './pages/TestComponentsPage'

const App = () => {
  return (
    <div>
      <Header />
        <TestComponentsPage />
      <Footer />
    </div>
  )
}

export default App
