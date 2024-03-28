import Papa from "papaparse";

export const uploadersFromCSVFile = (file) => {
  return new Promise(function (complete, error) {
    Papa.parse(file, {
      complete: (results) => {
        const uploaders = [];
        for (const row of results.data) {
          if (row.length < 2) {
            return error(new Error("Must have 2 columns: Name and Email."));
          }
          uploaders.push({
            name: row[0],
            email: row[1],
          });
        }
        complete(uploaders);
      },
      error,
    });
  });
};
