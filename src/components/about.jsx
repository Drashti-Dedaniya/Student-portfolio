function About() {
  return (
    <section id="about" className="section about">
      <div className="section-header">
        <span className="section-label">About Me</span>
        <h2>Hi, I’m Drashti</h2>
      </div>
      <p>
        I am a student creating polished web experiences with React, Vite, and modern CSS.
        My focus is on building responsive sites that are easy to use, visually strong, and
        professionally presented.
      </p>
      <div className="about-grid">
        <div className="about-card">
          <strong>Experience</strong>
          <p>Learning modern frontend development through real projects and coursework.</p>
        </div>
        <div className="about-card">
          <strong>Goal</strong>
          <p>Design attractive portfolio websites that communicate ideas clearly.</p>
        </div>
        <div className="about-card">
          <strong>Tools</strong>
          <p>React, Vite, HTML, CSS, JavaScript, and responsive design patterns.</p>
        </div>
      </div>
    </section>
  );
}

export default About;
