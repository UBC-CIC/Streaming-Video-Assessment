function AssessmentSettings({
  timeLimit,
  setTimeLimit,
  allowFaceBlur,
  setAllowFaceBlur,
  dueDate,
  setDueDate,
}) {
  return (
    <>
      <div className="pb-1 mt-5">
        <div className="text-4xl">Settings</div>
      </div>
      <div className="bg-black h-0.5" />
      <div className="flex flex-row mt-8 text-xl pb-5">
        Time Limit:
        <div className="flex flex-row pl-5 w-[30%]">
          <label htmlFor="hours" className="pr-2">
            Hours:
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            min="0"
            max="99"
            placeholder="Hours"
            className="w-full"
            value={timeLimit.hours}
            onChange={(e) =>
              setTimeLimit({ ...timeLimit, hours: e.target.value })
            }
          />
        </div>
        <div className="flex flex-row pl-5 w-[30%]">
          <label htmlFor="minutes" className="pr-2">
            Minutes:
          </label>
          <input
            type="number"
            id="minutes"
            name="minutes"
            min="0"
            max="59"
            placeholder="Minutes"
            className="w-full"
            value={timeLimit.minutes}
            onChange={(e) =>
              setTimeLimit({ ...timeLimit, minutes: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex flex-row text-xl w-full pb-5">
        Allow Face Blur:
        <div className="pl-5 flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={allowFaceBlur}
              onChange={() => setAllowFaceBlur(!allowFaceBlur)}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <div className="flex flex-row text-xl w-full">
        Close Submission On:
        <div className="pl-5 flex items-center">
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default AssessmentSettings;
