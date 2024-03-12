function AssessmentInputFields({ name, description, setName, setDescription }) {
  return (
    <>
      <div className="pb-1">
        <input
          type="text"
          placeholder="Submission Name"
          className="input w-full text-4xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="bg-black h-0.5" />
      <textarea
        className="textarea textarea-bordered w-full mt-5 textarea-lg h-[20rem]"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </>
  );
}

export default AssessmentInputFields;
