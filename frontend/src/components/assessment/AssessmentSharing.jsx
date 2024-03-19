import GroupViewModal from "./GroupViewModal";

function AssessmentSharing({
  sharedWithList,
  removeSharedWithUser,
  usersName,
  setUsersName,
  email,
  setEmail,
  addToSharedList,
}) {
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
      <GroupViewModal />
      {sharedWithList.map((sharedWith, index) => (
        <div className="grid grid-rows-1 gap-2 grid-flow-col w-full mt-4">
          <div className="font-bold">{sharedWith.name}</div>
          <div className="divider divider-horizontal divider-neutral"></div>
          <div className="font-bold">{sharedWith.email}</div>
          <div
            className="btn btn-sm"
            onClick={() => {
              removeSharedWithUser(index);
            }}
          >
            x
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssessmentSharing;
