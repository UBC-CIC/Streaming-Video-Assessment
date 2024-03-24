function Crumb({ path, index, lastPath, onClickHandler }) {
  return lastPath ? (
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

function FolderPath({ folderPath, onClickHandler, setIsLastPath = true }) {
  return (
    <div className="text-md breadcrumbs">
      <ul>
        {folderPath.map((path, index) => (
          <Crumb
            key={index}
            path={path}
            index={index}
            lastPath={index !== folderPath.length - 1 || !setIsLastPath}
            onClickHandler={onClickHandler}
          />
        ))}
      </ul>
    </div>
  );
}

export default FolderPath;
