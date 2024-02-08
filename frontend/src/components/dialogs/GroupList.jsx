import PropTypes from "prop-types";

function GroupList({ groupList, removeUserFromGroupList }) {
  return (
    <div className="flex flex-col items-center mt-5 overflow-y-auto h-[35%]">
      {groupList.map((group, index) => (
        <div
          key={index}
          className="flex items-center justify-center w-full pb-4"
        >
          <div className="font-bold">{group.name}</div>
          <div className="divider divider-horizontal divider-neutral"></div>
          <div className="font-bold pr-5">{group.email}</div>
          <div
            className="btn btn-sm"
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
