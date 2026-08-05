function Skills({ skillList }) {
  return (
    <section id="skills" className="section skills">
      <div className="section-header">
        <span className="section-label">Skills</span>
        <h2>Technical Strengths</h2>
      </div>
      <div className="skills-grid">
        {skillList.map((skill) => (
          <span key={skill} className="skill-pill">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Skills;
