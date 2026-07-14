import { Nav } from '../components/Nav';
import { SectionNav } from '../components/SectionNav';
import { Hero } from '../components/sections/Hero';
import { Experience } from '../components/sections/Experience';
import { Projects } from '../components/sections/Projects';
import { Skills } from '../components/sections/Skills';
import { Education } from '../components/sections/Education';
import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';
import { useScrollToHash } from '../hooks/useScrollToHash';

export function Home() {
  useScrollToHash();

  return (
    <div className="page">
      <Nav />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <About />
      <Contact />
      <SectionNav />
    </div>
  );
}
