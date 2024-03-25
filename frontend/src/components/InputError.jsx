import { IoWarningOutline } from "react-icons/io5";

function InputError({ error }) {
  return (
    <div className="text-red-600 flex flex-row items-center">
      <IoWarningOutline />
      {error}
    </div>
  );
}

export default InputError;
