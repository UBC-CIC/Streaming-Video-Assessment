export const validateEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return email.match(regex);
};
