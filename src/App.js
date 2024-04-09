import './App.css';
import { Routes, Route } from 'react-router-dom';

import Login from './Pages/Login';
import DidList from './Pages/DidList';
import Customer from './Pages/Customer';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/did-list" element={<DidList />} />
          <Route path="/customer" element={<Customer />} />

        </Routes>
      </header>
    </div>
  );
}

export default App;
