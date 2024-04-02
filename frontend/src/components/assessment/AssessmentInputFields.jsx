import InputError from "../InputError";

function AssessmentInputFields({
  name,
  description,
  setName,
  setDescription,
  titleError,
  descriptionError,
}) {
  return (
    <>
      <div className="pb-1">
        <input
          type="text"
          placeholder="Submission Name"
          className={`input w-full text-4xl ${titleError ? "border-red-500" : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="bg-black h-0.5" />
      {titleError && <InputError error={titleError} />}
      <textarea
        className={`textarea textarea-bordered w-full mt-5 textarea-lg h-[20rem] ${descriptionError ? "border-red-500" : ""}`}
        placeholder="Submission Description:&#10;Enter the instructions for your users here"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {descriptionError && <InputError error={descriptionError} />}
    </>
  );
}

export default AssessmentInputFields;
