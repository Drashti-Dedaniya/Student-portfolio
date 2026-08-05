import Header from "./Header";

function Home() {
  return (
    <main className="page compact-page">
      <Header
        name="Drashti Dedaniya"
        title="Front-End Developer"
        summary="Creating small, polished web interfaces with React, Vite, and clean design."
      />
      <section className="section page-intro">
        <div className="section-header">
          <span className="section-label">Home</span>
          <h2>front-end work</h2>
        </div>
        <p>
          Welcome to my portfolio. Here you can review my selected projects and contact me directly through the secure form.
        </p>
      </section>
      <section className="section skills-section">
        <div className="section-header">
          <span className="section-label">Skills</span>
          <h2>strengths</h2>
        </div>
        <div className="tag-list">
          <span className="tag">React</span>
          <span className="tag">Vite</span>
          <span className="tag">JavaScript</span>
          <span className="tag">HTML</span>
          <span className="tag">CSS</span>
        </div>
      </section>
      <section className="section home-footer-section">
        <div className="section-header">
          <span className="section-label">Footer</span>
          <h2>Thank you for visiting</h2>
        </div>
        <p>
          I’m available for front-end projects and internships. Reach out through the contact page when you’re ready to connect.
        </p>
      </section>
    </main>
  );
}

export default Home;
