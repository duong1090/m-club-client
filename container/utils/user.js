export const isLoginUser = (user) => {
  const { member } = global.organization || {};
  if (user && user.id && member.id && user.id == member.id) return true;
  return false;
};
