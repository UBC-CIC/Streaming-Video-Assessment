export const formatDateTime = (dateObj) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extracting components
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();
  let hour = dateObj.getUTCHours();
  const minute = dateObj.getMinutes();
  let period = "AM";

  // Adjusting hours for AM/PM format
  if (hour === 0) {
    hour = 12;
  } else if (hour == 12) {
    period = "PM";
  } else if (hour > 12) {
    hour -= 12;
    period = "PM";
  }

  // Formatting
  const formattedDate = `${day} ${months[monthIndex]} ${year} at ${hour}:${minute < 10 ? "0" + minute : minute} ${period}`;

  return formattedDate;
};

export const formatTimeForInput = (dateObj) => {
  // Function to pad single digit with 0
  const pad = (num) => {
    return num < 10 ? "0" + num : num;
  };

  // Get date components
  const year = dateObj.getFullYear();
  const month = pad(dateObj.getMonth() + 1); // Month is zero-based
  const day = pad(dateObj.getDate());
  const hours = pad(dateObj.getUTCHours());
  const minutes = pad(dateObj.getMinutes());

  // Create datetime-local string
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
