

import { MdFormatListBulleted, MdGridView } from "react-icons/md";

function ToggleViewStyle({ setView, view }) {
    const toggleView = () => {
        setView(view === "grid" ? "list" : "grid");
    }

    return (
        <button onClick={toggleView}
            className="bg-stone-300 justify-center text-black text-center text-3xl whitespace-nowrap self-center grow items-stretch my-auto p-3 rounded-[50%] max-md:text-4xl max-md:px-5"
        >
            { view === "grid" ? 
            <MdFormatListBulleted /> 
            : 
            <MdGridView />
            }
        </button>
    )
}

export default ToggleViewStyle;
