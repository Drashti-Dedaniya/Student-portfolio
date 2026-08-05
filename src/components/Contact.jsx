import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  return (
    <section id="contact" className="section contact">
      <div className="section-header">
        <span className="section-label">Contact</span>
        <h2>Get in touch</h2>
        
      </div>

      <button
        type="button"
        className="toggle-button"
        onClick={() => setShowDetails((current) => !current)}
      >
        {showDetails ? "Hide contact form" : "Show contact form"}
      </button>

      {showDetails && (
        <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-row">
            <label htmlFor="phone">Contact</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter your contact number"
            />
          </div>

          <div className="preview-box">
            <h3>Live preview</h3>
            <p>Name: {name || "(enter your name)"}</p>
            <p>Email: {email || "(enter your email)"}</p>
            <p>Contact: {phone || "(enter your contact number)"}</p>
          </div>
        </form>
      )}
    </section>
  );
}

export default Contact;
