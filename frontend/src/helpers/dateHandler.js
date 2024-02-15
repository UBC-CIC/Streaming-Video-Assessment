const getMonthName = (monthIndex) => {
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
  return months[monthIndex];
};

const padZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

export const formatDateTime = (date) => {
  return `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} at ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
};
