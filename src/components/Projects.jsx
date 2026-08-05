import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";

const PROJECT_REPOS = [
  "Drashti-Dedaniya/Smart-Student-performance-prediiction",
  "Drashti-Dedaniya/giriraj-automobile",
  "Drashti-Dedaniya/PRODIGY_WD_01",
  "OMJOSHI15/indus11",
];

function Projects() {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRepositories() {
      try {
        setIsLoading(true);
        setError("");

        const requests = PROJECT_REPOS.map(async (repo) => {
          const response = await fetch(`https://api.github.com/repos/${repo}`, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error("Unable to load repositories right now.");
          }

          return response.json();
        });

        const data = await Promise.all(requests);
        setRepositories(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong while loading repositories.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchRepositories();

    return () => controller.abort();
  }, []);

  return (
    <section id="projects" className="section projects">
      <div className="section-header">
        <span className="section-label">Projects</span>
        <h2>GitHub Repositories of Drashti-Dedaniya</h2>
      </div>

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && (
        <div className="projects-grid">
          {repositories.map((repository) => (
            <article key={repository.id} className="project-card">
              <h3>
                <a className="repo-link" href={repository.html_url} target="_blank" rel="noreferrer">
                  {repository.name}
                </a>
              </h3>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;
