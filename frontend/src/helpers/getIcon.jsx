import FolderIcon from "../assets/icons/FolderIcon";
import GroupIcon from "../assets/icons/GroupIcon";
import UploadIcon from "../assets/icons/UploadIcon";

export const getIcon = (file) => {
  switch (file.type) {
    case "folder":
      return <FolderIcon width={"9rem"} height={"8rem"} />;
    case "group":
      return <GroupIcon width={"8rem"} height={"8rem"} />;
    case "assessment":
      return <UploadIcon width={"8rem"} height={"8rem"} />;
    default:
      return <></>;
  }
};
