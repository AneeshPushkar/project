export const getRole = () => {
  return localStorage.getItem("role");
};

export const isAdmin = () => getRole() === "ADMIN";
export const isMember = () => getRole() === "MEMBER";