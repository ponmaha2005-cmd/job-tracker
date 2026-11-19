import { useState, useEffect } from "react";

function App() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  function addJob(e) {
    e.preventDefault();
    if (!company || !role) return;

    const newJob = { id: Date.now(), company, role, status };
    setJobs([...jobs, newJob]);

    setCompany("");
    setRole("");
    setStatus("Applied");
  }

  function deleteJob(id) {
    setJobs(jobs.filter((job) => job.id !== id));
  }

  function updateStatus(id, newStatus) {
    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  }

  const visibleJobs = jobs.filter(
    (job) =>
      (filter === "All" || job.status === filter) &&
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Job Application Tracker</h1>

      <form className="form" onSubmit={addJob}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <button type="submit">Add Job</button>
      </form>

      <div className="filters">
        <input
          placeholder="Search company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      {visibleJobs.length === 0 && <p className="empty">No jobs found</p>}

      <ul className="job-list">
        {visibleJobs.map((job) => (
          <li className="job-card" key={job.id}>
            <div>
              <strong>{job.company}</strong>
              <span>{job.role}</span>
            </div>
            <div className="actions">
              <select
                value={job.status}
                onChange={(e) => updateStatus(job.id, e.target.value)}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
              <button
                className="delete-btn"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;