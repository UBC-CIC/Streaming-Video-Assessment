function Crumb({ path, index, lastCrumb, onClickHandler }) {
  return lastCrumb ? (
    <li key={index}>
      <a
        onClick={() => {
          onClickHandler(path.id, index);
        }}
      >
        {path.name}
      </a>
    </li>
  ) : (
    <li key={index}>{path.name}</li>
  );
}

function FolderPath({
  folderPath,
  onClickHandler,
  makeLastCrumbClickable = true,
}) {
  return (
    <div className="text-md breadcrumbs">
      <ul>
        {folderPath.map((path, index) => (
          <Crumb
            key={index}
            path={path}
            index={index}
            lastCrumb={
              index !== folderPath.length - 1 || !makeLastCrumbClickable
            }
            onClickHandler={onClickHandler}
          />
        ))}
      </ul>
    </div>
  );
}

export default FolderPath;
