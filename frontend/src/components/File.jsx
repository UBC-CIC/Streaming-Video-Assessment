import PropTypes from 'prop-types';
import FolderIcon from "../assets/icons/FolderIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupIcon from "../assets/icons/GroupIcon";

function getIcon(type) {
    switch(type) {
        case "folder":
            return <FolderIcon width={"141"} height={"131"} />;
        case "group":
            return <GroupIcon width={"130"} height={"131"} />;
        case "assessment":
            return <UploadIcon width={"130"} height={"131"} />;
        default:
            return <></>;
    }
}

function File({ file }) {
    let icon = getIcon(file.type);

    return (
        <div className="flex flex-col items-center">
            <div className="bg-zinc-300 flex flex-col w-full mt-1.5 pt-7 px-18 rounded-[40px] items-center">
                <div className="justify-center text-black text-center text-xl truncate w-[75%]">
                    {file.name}
                </div>
                {icon}
            </div>
        </div>
    );
}

File.propTypes = {
    file: PropTypes.object.isRequired,
};

export default File;