import GroupViewModal from "./GroupViewModal/GroupViewModal";

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
    const newSharedWithList = [...sharedWithList];
    const alreadyExists = sharedWithList.find((currentGroup) => {
      if (type === "group") {
        return currentGroup.id === group.id;
      } else {
        return currentGroup.email === email;
      }
    });

    if (alreadyExists) return;

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
      <div className="grid grid-rows-2 gap-2 grid-flow-col w-full mt-4">
        <input
          type="text"
          placeholder="Name"
          className="input input-bordered w-full max-w-md border-black"
          value={usersName}
          onChange={(e) => setUsersName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          className="input input-bordered w-full max-w-md border-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div></div>
        <button className="btn btn-sm self-end" onClick={addToSharedList}>
          Add
        </button>
      </div>
      <div className="divider">OR</div>
      <GroupViewModal addToSharedList={addToSharedList} />
      <div className="max-h-[32rem] overflow-y-auto ">
        {sharedWithList.map((sharedWith, index) => (
          <div className="pb-2" key={index}>
            {sharedWith.email === undefined ? (
              <div class="p-2 rounded-md border-2 flex items-center">
                <div class="flex-1">
                  <p class="text-gray-700">
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
              <div class="p-2 rounded-md flex border-2 items-center">
                <div class="flex-1 w-[85%]">
                  <p class="text-gray-700 overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <b>Name: </b>
                    {sharedWith.name}
                  </p>
                  <p class="text-gray-700 overflow-hidden whitespace-nowrap overflow-ellipsis">
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
