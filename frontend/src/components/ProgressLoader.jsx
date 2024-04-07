function ProgressLoader({
  percentage = 0,
  loaderSize = "5rem",
  textClassName = "",
}) {
  return (
    <div
      className="radial-progress text-primary"
      style={{
        "--value": percentage,
        "--size": loaderSize,
      }}
      role="progressbar"
    >
      <p className={textClassName}>{percentage}%</p>
    </div>
  );
}

export default ProgressLoader;
