import PropTypes from "prop-types";

function GroupList({ groupList, removeUserFromGroupList }) {
  return (
    <div className="flex flex-col items-center mt-2 overflow-y-auto h-[35%]">
      {groupList.map((group, index) => (
        <div
          key={index}
          className="container flex items-center justify-between border-b border-gray-300 py-2 px-4 w-[50%]"
        >
          <div className="flex flex-col w-[85%]">
            <span
              className="font-bold overflow-hidden whitespace-nowrap overflow-ellipsis"
              title={group.name}
            >
              {group.name}
            </span>

            <span
              className="font-bold overflow-hidden whitespace-nowrap overflow-ellipsis"
              title={group.email}
            >
              {group.email}
            </span>
          </div>
          <div
            className="btn btn-sm flex-grow-0 flex-shrink hover:bg-red-600"
            onClick={() => {
              removeUserFromGroupList(index);
            }}
          >
            x
          </div>
        </div>
      ))}
    </div>
  );
}

GroupList.propTypes = {
  groupList: PropTypes.array,
  removeUserFromGroupList: PropTypes.func,
};

export default GroupList;
