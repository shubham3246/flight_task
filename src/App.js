import './App.css';
import Filter from './components/filter/Filter';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route  path='/' element={<Filter/>}>
        </Route>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
