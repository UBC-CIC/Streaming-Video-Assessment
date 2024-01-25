export const getAssignmentInfo = async (assignmentId, secret) => {
    console.log("FETCHED")

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        completedOn: null,
        name: "Spanish 30 Final",
        description: "This is a description of the assignment",
        dueDate: "2021-12-31",
        timeLimitMinutes: 30,
        allowFaceBlur: true,
    }
};