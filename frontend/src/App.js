import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

function Home() {
  return <h2>DungeonQuill — генератор сюжетних арок для D&D</h2>;
}

function App() {
  return (
    <Router>
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;