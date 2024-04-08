import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import GroupList from "./GroupList";
import {
  getGroupInfo,
  createNewGroup,
  editGroup,
} from "../../helpers/submissionCreatorApi";
import { uploadersFromCSVFile } from "../../helpers/csvParse";
import InputError from "../InputError";
import { validateEmail } from "../../helpers/inputValidation";
import { useToast } from "../Toast/ToastService";

function GroupDialog({
  dialogRef,
  isEdit,
  groupId = null,
  parentId = null,
  isOpen = false,
  setIsOpen = () => {},
  fetchFolderData = () => {},
}) {
  const initialGroupListRef = useRef([]);
  const initialGroupNameRef = useRef("");
  const nameRef = useRef(null);

  const [groupList, setGroupList] = useState([]); // [{name: "", email: ""}]
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [csvError, setCsvError] = useState("");
  const [csvProblemUsers, setCsvProblemUsers] = useState([]);
  const toast = useToast();
  const fileInputRef = useRef(null);

  const closeModal = () => {
    setGroupList([]);
    setName("");
    setEmail("");
    setGroupName("");
    setGroupNameError(false);
    setNameError(false);
    setEmailError(null);
    setCsvError("");
    setCsvProblemUsers([]);
    setIsOpen(false);
  };

  const removeUserFromGroupList = (index) => {
    const newGroupList = [...groupList]; // Create a copy of the original array
    newGroupList.splice(index, 1);
    setGroupList(newGroupList);
  };

  const createGroup = async () => {
    setGroupNameError(false);

    if (
      JSON.stringify(initialGroupListRef.current) ===
        JSON.stringify(groupList) &&
      initialGroupNameRef.current === groupName
    ) {
      setIsOpen(false);
      dialogRef.current.close();
      return;
    }

    if (groupName === "") {
      setGroupNameError(true);
      return;
    }

    if (isEdit) {
      const res = await editGroup(groupId, groupName, parentId, groupList);
      await fetchFolderData();
      if (res.success) {
        toast.success("Group edited successfully");
      } else {
        toast.error("Group edit failed");
      }
    } else {
      const res = await createNewGroup(groupName, parentId, groupList);
      await fetchFolderData();
      if (res.success) {
        toast.success("Group created successfully");
      } else {
        toast.error("Group creation failed");
      }
    }

    closeModal();
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
    nameRef.current?.focus();
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
      initialGroupNameRef.current = groupInfo?.name;
    };
    // Call the async function
    fetchGroupList();
  }, [isOpen, groupId, isEdit]);

  return (
    <dialog
      id={isEdit ? "edit-group-modal" : "create-group-modal"}
      className="modal"
      ref={dialogRef}
    >
      <div className="modal-box max-w-none w-[70%] max-h-none h-[80%] max-sm:h-full max-sm:w-full">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>
        </form>
        <div className="flex flex-col h-full">
          <div>
            <div className="flex justify-center items-center mt-2">
              <h3 className="justify-center text-indigo-500 text-center font-bold text-xl uppercase self-center mt-2 pr-2">
                {isEdit ? "Edit Group" : "Create Group"}
              </h3>
              <div
                className="tooltip tooltip-bottom tooltip-lg"
                data-tip={`Groups are a way of saving a collection of users. 
                When creating a new assessment, you can select any group in the current folder and share the assessment with the entire group at once.`}
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
            </div>

            <div className="flex mt-4 max-sm:flex-col">
              <div className="flex justify-top flex-col items-center w-full">
                <h4 className="justify-center text-indigo-500 text-center font-bold text-l uppercase self-center pr-2 mb-4">
                  Add users from CSV file
                </h4>
                <input
                  type="file"
                  accept=".csv"
                  className="file-input w-full max-w-xs file-input-bordered border-black"
                  ref={fileInputRef}
                />
                {csvError && <InputError error={csvError} />}
                <div>
                  <button
                    className="btn uppercase mt-4 text-white bg-indigo-500"
                    onClick={async () => {
                      setCsvError("");
                      setCsvProblemUsers([]);
                      if (fileInputRef.current.files.length === 0) return;
                      const f = fileInputRef.current.files[0];

                      try {
                        const uploadersToAdd = await uploadersFromCSVFile(f);

                        setCsvProblemUsers(
                          uploadersToAdd.filter(
                            (user) => !validateEmail(user.email) || !user.name,
                          ),
                        );

                        const addUploaders = uploadersToAdd.filter(
                          (user) =>
                            validateEmail(user.email) &&
                            user.name &&
                            !groupList.find(
                              (currentUser) => currentUser.email === user.email,
                            ),
                        );

                        fileInputRef.current.type = "text";
                        fileInputRef.current.type = "file";
                        setGroupList([...groupList, ...addUploaders]);
                        console.log(addUploaders);
                      } catch (e) {
                        setCsvError(e.message);
                      }
                    }}
                  >
                    Add Uploaders
                  </button>

                  <div
                    className="tooltip tooltip-bottom tooltip-lg"
                    data-tip={`Upload a CSV file with Name, Email columns to add multiple users to the group at once. Do *not* use headers.`}
                  >
                    <IoIosInformationCircleOutline size={20} />
                  </div>
                </div>
                {csvProblemUsers.length > 0 && (
                  <div>
                    The following users could not be added:
                    <ul className="list-disc pl-5">
                      {csvProblemUsers.map((user, index) => (
                        <li key={index}>
                          {user.name} - {user.email}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="divider sm:divider-horizontal">OR</div>

              <div className="flex justify-top flex-col items-center w-full">
                <h4 className="justify-center text-indigo-500 text-center font-bold text-l uppercase self-center pr-2 mb-4">
                  Add a single user
                </h4>
                <form
                  action="javascript:void(0);"
                  onSubmit={addUserToGroupList}
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    ref={nameRef}
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
                  <button className="btn uppercase mt-4 text-white bg-indigo-500">
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div>
            <GroupList
              groupList={groupList}
              removeUserFromGroupList={removeUserFromGroupList}
            />
          </div>
        </div>
        <div className="modal-action absolute right-5 bottom-5">
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
