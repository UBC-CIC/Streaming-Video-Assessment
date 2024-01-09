import SearchBar from "../components/SearchBar";
import { GoPlusCircle } from "react-icons/go";
import { MdFormatListBulleted } from "react-icons/md";
// TODO: add react router loader function to retrieve all folders and info from backend and then display on frontend

function HomePage() {
    return (
        <div className="bg-white flex flex-col pl-16 pr-20 py-12 max-md:px-5">
            <SearchBar />
            <div className="self-center flex w-full max-w-[1206px] items-center justify-between gap-5 mt-7 max-md:max-w-full max-md:flex-wrap">
                <div className="justify-center text-black text-lg grow shrink basis-auto my-auto">
                    Home &gt; 2023 &gt; Tests 
                </div>
                <div className="self-stretch flex items-stretch justify-between gap-2.5">
                    {/* TODO: add buttons that actually do needed functions */}
                    <div className="bg-stone-300 justify-center text-black text-center text-3xl whitespace-nowrap self-center grow items-stretch my-auto p-3 rounded-[50%] max-md:text-4xl max-md:px-5">
                        <MdFormatListBulleted />
                    </div>
                    <div className="justify-center text-black text-center text-5xl whitespace-nowrap self-center grow items-stretch my-auto p-3 rounded-[50%] max-md:text-4xl max-md:px-5">
                        <GoPlusCircle />
                    </div>
                </div>
            </div>
            <div className="w-full self-start max-md:mt-10">
                <div className="gap-5 flex-wrap flex flex-row max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
                        <div className="bg-zinc-300 flex grow flex-col items-stretch w-full mt-1.5 pt-7 px-14 rounded-[40px] max-md:mt-10 max-md:px-5">
                            <div className="justify-center text-black text-center text-2xl">
                                Spanish 30
                            </div>
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d74a152f80318f7f9d83f5d7394f7af139c34c31c76d7037d057674c1c2c656?apiKey=5ab53e5268f64c5db7f0d2610ddd17d5&"
                                className="aspect-[1.09] object-contain object-center w-[142px] overflow-hidden self-center z-[1] mb-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
                        <div className="bg-zinc-300 flex grow flex-col items-stretch w-full mt-1.5 pt-7 px-14 rounded-[40px] max-md:mt-10 max-md:px-5">
                            <div className="justify-center text-black text-center text-2xl">
                                Spanish 30
                            </div>
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d74a152f80318f7f9d83f5d7394f7af139c34c31c76d7037d057674c1c2c656?apiKey=5ab53e5268f64c5db7f0d2610ddd17d5&"
                                className="aspect-[1.09] object-contain object-center w-[142px] overflow-hidden self-center z-[1] mb-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
                        <div className="bg-zinc-300 flex grow flex-col items-stretch w-full mt-1.5 pt-7 px-14 rounded-[40px] max-md:mt-10 max-md:px-5">
                            <div className="justify-center text-black text-center text-2xl">
                                Spanish 30
                            </div>
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d74a152f80318f7f9d83f5d7394f7af139c34c31c76d7037d057674c1c2c656?apiKey=5ab53e5268f64c5db7f0d2610ddd17d5&"
                                className="aspect-[1.09] object-contain object-center w-[142px] overflow-hidden self-center z-[1] mb-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
