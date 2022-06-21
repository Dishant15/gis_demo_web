export const handlePreventDefault = (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
};
