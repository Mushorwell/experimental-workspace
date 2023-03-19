import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FirstSolution, SecondSolution } from './solutions';

function App() {
  return (
    <main className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SecondSolution />} />
          <Route path="/take-one" element={<FirstSolution />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
