import { useState } from "react";
import GroupViewModal from "./GroupViewModal/GroupViewModal";
import InputError from "../InputError";
import { validateEmail } from "../../helpers/inputValidation";

function AssessmentSharing({
  usersName,
  setUsersName,
  email,
  setEmail,
  sharedWithList,
  setSharedWithList,
  edit,
  addedToSharedList,
  setAddedToSharedList,
  removedFromSharedList,
  setRemovedFromSharedList,
}) {
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const removeSharedWithUser = (index) => {
    const newSharedWithList = [...sharedWithList];
    const removedValues = newSharedWithList.splice(index, 1);
    setSharedWithList(newSharedWithList);

    // for put request
    if (edit) {
      const newAddedList = addedToSharedList.filter((added) => {
        if (removedValues[0].id) {
          return added.id !== removedValues[0].id;
        }

        return added.email !== removedValues[0].email;
      });

      const alreadyExists = removedFromSharedList.find((current) => {
        if (removedValues[0].id) {
          return current.id === removedValues[0].id;
        } else {
          return current.email === removedValues[0].email;
        }
      });

      if (newAddedList.length !== addedToSharedList.length) {
        setAddedToSharedList(newAddedList);
      } else if (!alreadyExists) {
        setRemovedFromSharedList([...removedFromSharedList, removedValues[0]]);
      }
    }
  };

  const addToSharedList = (type, group) => {
    if (type !== "group") {
      let error = false;
      if (usersName === "") {
        setNameError(true);
        error = true;
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
    }

    const newSharedWithList = [...sharedWithList];
    const alreadyExists = sharedWithList.find((currentGroup) => {
      if (type === "group") {
        return currentGroup.id === group.id;
      } else {
        return currentGroup.email === email;
      }
    });

    if (alreadyExists) {
      setEmailError("User already added");
      return;
    }

    setEmailError(null);

    if (type === "group") {
      newSharedWithList.push({
        ...group,
      });
    } else {
      setUsersName("");
      setEmail("");

      newSharedWithList.push({ name: usersName, email: email });
    }

    setSharedWithList(newSharedWithList);

    if (edit) {
      const newRemovedList = removedFromSharedList.filter((removed) => {
        if (type === "group") {
          return removed.id !== group.id;
        }

        return removed.email !== email;
      });

      const alreadyExists = addedToSharedList.find((currentGroup) => {
        if (type === "group") {
          return currentGroup.id === group.id;
        } else {
          return currentGroup.email === email;
        }
      });

      if (newRemovedList.length !== removedFromSharedList.length) {
        setRemovedFromSharedList(newRemovedList);
      } else if (!alreadyExists) {
        setAddedToSharedList([
          ...addedToSharedList,
          type === "group" ? { ...group } : { name: usersName, email: email },
        ]);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="text-4xl text-center pb-1">Sharing</div>
      <div className="bg-black h-0.5" />
      <div className="grid grid-rows-3 gap-2 grid-flow-col w-full mt-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            className={`input input-bordered w-full max-w-md border-black ${nameError ? "border-red-500" : ""}`}
            value={usersName}
            onChange={(e) => setUsersName(e.target.value)}
          />
          {nameError && <InputError error={"Name cannot be empty"} />}
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            className={`input input-bordered w-full max-w-md border-black ${emailError ? "border-red-500" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <InputError error={emailError} />}
        </div>
        <div className="flex justify-center pb-2">
          <button className="btn btn-wide" onClick={addToSharedList}>
            Share with a user
          </button>
        </div>
      </div>
      <div className="divider">OR</div>
      <GroupViewModal addToSharedList={addToSharedList} />
      <div className="max-h-[32rem] overflow-y-auto ">
        {sharedWithList.map((sharedWith, index) => (
          <div className="pb-2" key={index}>
            {sharedWith.email === undefined ? (
              <div className="p-2 rounded-md border-2 flex items-center">
                <div className="flex-1">
                  <p className="text-gray-700">
                    <b>Group: </b>
                    {sharedWith.name}
                  </p>
                </div>
                <div
                  className="btn btn-md hover:bg-red-600"
                  onClick={() => {
                    removeSharedWithUser(index, "group");
                  }}
                >
                  x
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-md flex border-2 items-center">
                <div className="flex-1 w-[85%]">
                  <p className="text-gray-700 overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <b>Name: </b>
                    {sharedWith.name}
                  </p>
                  <p className="text-gray-700 overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <b>Email: </b>
                    {sharedWith.email}
                  </p>
                </div>
                <div
                  className="btn btn-md hover:bg-red-600"
                  onClick={() => {
                    removeSharedWithUser(index);
                  }}
                >
                  x
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssessmentSharing;
