import { MdFormatListBulleted, MdGridView } from "react-icons/md";

function ToggleViewStyle({ setView, view }) {
  const toggleView = () => {
    setView(view === "grid" ? "list" : "grid");
  };

  return (
    <div
      tabIndex={0}
      role="button"
      className="btn btn-circle m-1 bg-stone-300 btn-lg"
      onClick={toggleView}
    >
      {view === "grid" ? (
        <MdFormatListBulleted size={30} />
      ) : (
        <MdGridView size={30} />
      )}
    </div>
  );
}

export default ToggleViewStyle;
