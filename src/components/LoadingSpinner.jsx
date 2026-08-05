function LoadingSpinner() {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="spinner-ring" aria-hidden="true" />
      <span>Loading repositories...</span>
    </div>
  );
}

export default LoadingSpinner;
