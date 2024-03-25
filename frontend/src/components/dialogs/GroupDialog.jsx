import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import GroupList from "./GroupList";
import {
  getGroupInfo,
  createNewGroup,
  editGroup,
} from "../../helpers/submissionCreatorApi";
import InputError from "../InputError";
import { validateEmail } from "../../helpers/inputValidation";

function GroupDialog({
  isEdit,
  groupId = null,
  parentId = null,
  isOpen = false,
  setIsOpen = () => {},
}) {
  const initialGroupListRef = useRef([]);
  const [groupList, setGroupList] = useState([]); // [{name: "", email: ""}]
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const removeUserFromGroupList = (index) => {
    const newGroupList = [...groupList]; // Create a copy of the original array
    newGroupList.splice(index, 1);
    setGroupList(newGroupList);
  };

  const createGroup = async () => {
    setGroupNameError(false);

    if (
      JSON.stringify(initialGroupListRef.current) === JSON.stringify(groupList)
    ) {
      setIsOpen(false);
      return;
    }

    if (groupName === "") {
      setGroupNameError(true);
      return;
    }

    if (isEdit) {
      const res = await editGroup(groupId, groupName, parentId, groupList);
      if (res.success) {
        alert("Group edited successfully");
      } else {
        alert("Group editing failed");
      }
    } else {
      const res = await createNewGroup(groupName, parentId, groupList);
      if (res.success) {
        alert("Group created successfully");
      } else {
        alert("Group creation failed");
      }
    }
    setGroupList([]);
    setName("");
    setEmail("");
    setGroupName("");
    setIsOpen(false);
    document.getElementById("edit-group-modal").close();
  };

  const addUserToGroupList = () => {
    let error = false;

    if (name === "") {
      error = true;
      setNameError(true);
    } else {
      setNameError(false);
    }

    if (email === "") {
      error = true;
      setEmailError("Email cannot be empty");
    } else if (!validateEmail(email)) {
      error = true;
      setEmailError("Invalid email format");
    } else {
      setEmailError(null);
    }

    if (error) return;

    const alreadyExists = groupList.find(
      (currentUser) => currentUser.email === email,
    );

    if (alreadyExists) {
      setEmailError("User already added");
      return;
    }

    setName("");
    setEmail("");
    setGroupList([...groupList, { name: name, email: email }]);
  };

  useEffect(() => {
    const fetchGroupList = async () => {
      let fetchedGroupList;
      let groupInfo;

      if (isEdit && isOpen) {
        groupInfo = await getGroupInfo(groupId);
        fetchedGroupList = groupInfo.users;
        setGroupList(fetchedGroupList);
        setGroupName(groupInfo.name);
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
              setGroupNameError(false);
              setNameError(false);
              setEmailError(null);
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
              className={`input input-bordered w-full max-w-sm border-black ${groupNameError ? "border-red-500" : ""}`}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
            {groupNameError && (
              <InputError error={"Group name cannot be empty"} />
            )}
            <div className="flex justify-center mt-10 flex-col items-center w-full">
              <input
                type="text"
                placeholder="Name"
                value={name}
                className={`input input-bordered w-full max-w-sm border-black ${nameError ? "border-red-500" : ""}`}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              {nameError && <InputError error={"Name cannot be empty"} />}
              <input
                type="text"
                placeholder="Email"
                value={email}
                className={`input input-bordered w-full max-w-sm border-black mt-4 ${emailError ? "border-red-500" : ""}`}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {emailError && <InputError error={emailError} />}
              <button
                className="btn uppercase mt-4 text-white bg-indigo-500"
                onClick={addUserToGroupList}
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
          <button
            className="btn uppercase text-white bg-indigo-500"
            onClick={createGroup}
          >
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

GroupDialog.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  groupId: PropTypes.number,
  parentId: PropTypes.number,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default GroupDialog;
