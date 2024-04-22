export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^\S+@\S+\.\S+$/;
  return email.match(regex);
};
