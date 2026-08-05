function Header({ name, title, summary }) {
  return (
    <header className="site-header compact-header">
      <div className="header-inner compact-header-inner">
        <div className="hero-copy">
          <span className="eyebrow">Student Portfolio</span>
          <h1>{name}</h1>
          <p className="hero-title">{title}</p>
          <p className="hero-description">{summary}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
