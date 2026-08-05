import React, { useEffect, useState } from "react";

function Spinner() {
  return (
    <div className="spinner" aria-live="polite">
      <div className="spinner-dot" />
      <style>{`
        .spinner{display:flex;align-items:center;justify-content:center;padding:2rem}
        .spinner-dot{width:36px;height:36px;border-radius:50%;border:4px solid #ddd;border-top-color:#333;animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert">
      <p>Failed to load repositories: {message}</p>
      <style>{`.error-message{color:#b00020;padding:1rem}`}</style>
    </div>
  );
}

function ProjectsPage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchRepos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://api.github.com/users/octocat/repos", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
    return () => controller.abort();
  }, []);

  return (
    <section className="page compact-page">
      <div className="section-header">
        <span className="section-label">Projects</span>
        <h2>Selected Work</h2>
      </div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="projects-grid">
          {repos.map((r) => (
            <article key={r.id} className="project-card">
              <h3>
                <a className="repo-link" href={r.html_url} target="_blank" rel="noreferrer">
                  {r.name}
                </a>
              </h3>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectsPage;
