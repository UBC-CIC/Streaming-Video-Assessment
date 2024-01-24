import PropTypes from "prop-types";
import ListViewRow from "./ListViewRow";

function ListView({ folderData }) {
  const { files } = folderData;

  const sortByDateModified = (a, b) => {
    const dateA = new Date(a.dateModified);
    const dateB = new Date(b.dateModified);

    // Compare dates
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  };

  const sortedInputs = files.sort(sortByDateModified);
  return (
    <div className="pt-4">
      <table className="min-w-full">
        <thead>
          <tr className="bg-stone-50 text-stone-500">
            <th className="p-2"></th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Due Date</th>
            <th className="p-2 text-left">Date Modified</th>
            <th className="p-2 text-left">Date Created</th>
            <th className="p-2"></th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {sortedInputs.map((row, index) => (
            <ListViewRow key={index} index={index} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

ListView.propTypes = {
  folderData: PropTypes.object.isRequired,
};

export default ListView;
