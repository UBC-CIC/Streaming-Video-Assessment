import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import GroupList from "./GroupList";
import { getGroupList } from "../../helpers/assessmentCreatorApi";

function GroupDialog({ isEdit, groupId = "", isOpen = false, setIsOpen }) {
  const initialGroupListRef = useRef([]);
  const [groupList, setGroupList] = useState([]); // [{name: "", email: ""}
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");

  const removeUserFromGroupList = (index) => {
    const newGroupList = [...groupList]; // Create a copy of the original array
    newGroupList.splice(index, 1);
    setGroupList(newGroupList);
  };

  const createGroup = () => {
    if (
      JSON.stringify(initialGroupListRef.current) === JSON.stringify(groupList)
    ) {
      console.log("no change");
      setIsOpen(false);
      return;
    }
    if (isEdit) {
      // TODO: call update API
    } else {
      // TODO: call create API
    }
    console.log("creating group");
    console.log(groupName, groupList);
    setGroupList([]);
    setName("");
    setEmail("");
    setGroupName("");
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchGroupList = async () => {
      let fetchedGroupList;

      if (isEdit && isOpen) {
        console.log("fetching group list");
        fetchedGroupList = await getGroupList(groupId);
        setGroupList(fetchedGroupList);
      }

      // Update the mutable value in the useRef
      initialGroupListRef.current = fetchedGroupList;
    };

    // Call the async function
    fetchGroupList();
  }, [isOpen, groupId, isEdit]);

  return (
    <dialog
      id={isEdit ? "edit-group-modal" : "create-group-modal"}
      className="modal"
    >
      <div className="modal-box max-w-none w-[70%] max-h-none h-[80%] flex flex-col justify-between">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setGroupList([]);
              setName("");
              setEmail("");
              setGroupName("");
              setIsOpen(false);
            }}
          >
            ✕
          </button>
        </form>
        <div>
          <div className="flex justify-center items-center mt-2">
            <h3 className="justify-center text-indigo-500 text-center font-bold text-xl uppercase self-center mt-2 pr-2">
              {isEdit ? "Edit Group" : "Create Group"}
            </h3>
            <div
              className="tooltip tooltip-bottom tooltip-lg"
              data-tip={`Groups are a way to share folders with other users. 
            You can create a group and add users to it. 
            Then, you can share folders with the group and all users in the group will have access to the folder.`}
            >
              <IoIosInformationCircleOutline size={20} />
            </div>
          </div>
          <div className="flex justify-center mt-5 flex-col items-center">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              className="input input-bordered w-full max-w-sm border-black"
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
            <div className="flex justify-center mt-10 flex-col items-center w-full">
              <input
                type="text"
                placeholder="Name"
                value={name}
                className="input input-bordered w-full max-w-sm border-black"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                className="input input-bordered w-full max-w-sm border-black mt-4"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className="btn uppercase mt-4 text-white bg-indigo-500"
                onClick={() => {
                  if (name === "" || email === "") return;
                  setGroupList([...groupList, { name: name, email: email }]);
                  setName("");
                  setEmail("");
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <GroupList
          groupList={groupList}
          removeUserFromGroupList={removeUserFromGroupList}
        />
        <div className="modal-action justify-end">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn uppercase text-white bg-indigo-500"
              onClick={createGroup}
            >
              {isEdit ? "Save" : "Create"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

GroupDialog.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  groupId: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default GroupDialog;
