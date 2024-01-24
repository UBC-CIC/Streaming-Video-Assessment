import PropTypes from 'prop-types';
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function FolderPath({ folderPath }) {
    const navigate = useNavigate();

    const handlePathClick = (id) => {
        if (id === "HOME") {
            return navigate(`/home`);
        }

        return navigate(`/folder/${id}`);
    };

    return (
        <>
            {folderPath.map((path, index) => (
                <>
                    <div className="flex items-center gadiv-2.5 hover:text-blue-500 cursor-pointer" onClick={() => {handlePathClick(path.id)}}>
                        {path.name}
                    </div>
                    {index + 1 != folderPath.length && 
                        <div className="flex items-center gap-2.5">
                            <MdOutlineArrowForwardIos />
                        </div>
                    }
                </>
            ))}
        </>
    );
}

FolderPath.propTypes = {
    folderPath: PropTypes.array.isRequired,
};

export default FolderPath;
