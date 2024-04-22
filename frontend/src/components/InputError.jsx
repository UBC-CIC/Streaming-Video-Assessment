import { IoWarningOutline } from "react-icons/io5";

function InputError({ error }) {
  return (
    <div className="text-red-600 flex flex-row items-center">
      <div className="mr-1">
        <IoWarningOutline />
      </div>
      {error}
    </div>
  );
}

export default InputError;
