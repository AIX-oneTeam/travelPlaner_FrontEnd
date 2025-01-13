import { BrowserRouter, Routes, Route } from 'react-router-dom';

import WebTest from './pages/main/WebTest';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WebTest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;