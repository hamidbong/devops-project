import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Products from './pages/Products/Products';
import Register from './pages/Register/Register';
import logo from './logo.svg';
import Header from './pages/Header/header'; // Adaptez le chemin si besoin
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/Login" element={<Login></Login>}></Route>
        <Route path="/Dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path="/Products" element={<Products />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      <body>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1><strong>Bienvenue à mon React</strong></h1>
        </div>
      </body>
    </>
    
  );
}

export default App;
