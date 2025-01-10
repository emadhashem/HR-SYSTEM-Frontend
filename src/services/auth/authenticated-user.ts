class AuthenticatedUser {
  isAuthenticated = (): boolean => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  };

  logout() {
    localStorage.removeItem("accessToken");
  }
}

export const authenticatedUser = new AuthenticatedUser();
