function Crumb({ path, index, lastPath, fetchGroups }) {
  return lastPath ? (
    <li key={index}>
      <a
        onClick={() => {
          fetchGroups(path.id);
        }}
      >
        {path.name}
      </a>
    </li>
  ) : (
    <li key={index}>{path.name}</li>
  );
}

function FolderPath({ folderPath, fetchGroups }) {
  return (
    <div className="text-md breadcrumbs">
      <ul>
        {folderPath.map((path, index) => (
          <Crumb
            key={index}
            path={path}
            index={index}
            lastPath={index !== folderPath.length - 1}
            fetchGroups={fetchGroups}
          />
        ))}
      </ul>
    </div>
  );
}

export default FolderPath;
