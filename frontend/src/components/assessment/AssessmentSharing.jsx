import GroupViewModal from "./GroupViewModal/GroupViewModal";

function AssessmentSharing({
  usersName,
  setUsersName,
  email,
  setEmail,
  sharedWithList,
  setSharedWithList,
}) {
  const removeSharedWithUser = (index, type) => {
    const newSharedWithList = { ...sharedWithList };
    const otherIndex = newSharedWithList.ordered[index].index;
    newSharedWithList.ordered.splice(index, 1);
    if (type === "group") {
      newSharedWithList.groups.splice(otherIndex, 1);
    } else {
      newSharedWithList.users.splice(otherIndex, 1);
    }
    setSharedWithList(newSharedWithList);
  };

  const addToSharedList = (type, group) => {
    const newSharedWithList = { ...sharedWithList };
    if (type === "group") {
      const alreadyExists = sharedWithList.groups.find((currentGroup) => {
        return currentGroup.id === group.id;
      });
      if (alreadyExists) return;
      newSharedWithList.groups.push(group);
      newSharedWithList.ordered.push({
        ...group,
        index: newSharedWithList.groups.length - 1,
      });
    } else {
      setUsersName("");
      setEmail("");

      const alreadyExists = sharedWithList.users.find((currentUser) => {
        return currentUser.email === email;
      });

      if (alreadyExists) return;

      newSharedWithList.users.push({ name: usersName, email: email });
      newSharedWithList.ordered.push({
        name: usersName,
        email: email,
        index: newSharedWithList.users.length - 1,
      });
    }
    setSharedWithList(newSharedWithList);
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
        {sharedWithList.ordered.map((sharedWith, index) => (
          <div className="pb-2">
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
