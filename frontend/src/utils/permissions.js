export const hasPermission = (permissions, name) => {
  return permissions?.some((perm) => perm.name === name);
};
