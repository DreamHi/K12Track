class Storage {
  static isAuthenticatedUser() {
    try {
      return localStorage.getItem('token') !== null;
    } catch (e) {
      return false;
    }
  }

  static setToken(token) {
    try {
      return localStorage.setItem('token', token);
    } catch (e) {
      Storage.clearLocalStorage();
      return null;
    }
  }

  static getToken() {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      Storage.clearLocalStorage();
      return null;
    }
  }

  static setUser(user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      Storage.clearLocalStorage();
    }
  }

  static getUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      Storage.clearLocalStorage();
      return null;
    }
  }

  static clearLocalStorage() {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (e) {
      console.log(e);
    }
  }
}

export default Storage;
