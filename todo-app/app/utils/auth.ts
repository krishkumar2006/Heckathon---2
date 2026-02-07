// utils/auth.ts
export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};