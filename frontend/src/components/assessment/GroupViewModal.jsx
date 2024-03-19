import React from "react";

function GroupView() {
  return (
    <div>
      <h1 className="text-4xl">Groups</h1>
    </div>
  );
}

function GroupViewModal() {
  // TODO: Render all Groups and the folders they belong in
  return (
    <div className="flex justify-center">
      <button
        className="btn btn-wide"
        onClick={() => document.getElementById("groupView").showModal()}
      >
        Select a Group
      </button>
      <dialog id="groupView" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <GroupView />
        </div>
      </dialog>
    </div>
  );
}

export default GroupViewModal;
