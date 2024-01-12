import { BsSearch } from "react-icons/bs";

function SearchBar() {
    return (
        <div className="bg-stone-300 self-stretch flex items-stretch gap-5 px-8 py-2 rounded-[40px]">
            <div className="leading-[50px]">
                <BsSearch className="inline-block" />
            </div>
            <input 
                className="w-full outline-none bg-stone-300 justify-center text-2xl font-thin leading-6 self-center my-auto"
                name="search"
                placeholder="Search"
            />
        </div>
    )
}

export default SearchBar;
