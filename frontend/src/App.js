import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StoryArcsPage from './pages/StoryArcsPage';
import StoryArcEditorPage from './pages/StoryArcEditorPage';

function Home() {
  return <h2>DungeonQuill — генератор сюжетних арок для D&D</h2>;
}

function App() {
  return (
    <Router>
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/story-arcs" element={<StoryArcsPage />} />
          <Route path="/story-arcs/:id/edit" element={<StoryArcEditorPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
