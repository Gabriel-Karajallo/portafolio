import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/proyectos/:projectId" element={<ProjectDetail />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
