class UserService {
  constructor() {
    this.currentUserCache = null;
    this.currentUserPromise = null;
  }

  async getCurrentUser({ forceRefresh = false } = {}) {
    if (!forceRefresh && this.currentUserCache) {
      return this.currentUserCache;
    }

    if (!forceRefresh && this.currentUserPromise) {
      return this.currentUserPromise;
    }

    this.currentUserPromise = this.getUserById(1)
      .then((user) => {
        this.currentUserCache = user;
        return user;
      })
      .finally(() => {
        this.currentUserPromise = null;
      });

    return this.currentUserPromise;
  }

  async getUserById(id) {
    const response = await fetch(`/api/user/${id}`, {
      headers: {
        Accept: 'application/json'
      }
    });

    return this.handleJsonResponse(response);
  }

  async updateUser(model) {
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(model)
    });

    if (!response.ok) {
      throw new Error(await this.readErrorMessage(response));
    }

    const refreshedUser = await this.getUserById(model.id);
    this.currentUserCache = refreshedUser;
    return refreshedUser;
  }

  async handleJsonResponse(response) {
    if (!response.ok) {
      throw new Error(await this.readErrorMessage(response));
    }

    return response.status === 204 ? null : response.json();
  }

  clearCurrentUserCache() {
    this.currentUserCache = null;
    this.currentUserPromise = null;
  }

  async readErrorMessage(response) {
    try {
      const errorPayload = await response.json();
      return errorPayload?.message || errorPayload?.title || 'An unexpected API error occurred.';
    } catch {
      return 'An unexpected API error occurred.';
    }
  }
}

export const userService = new UserService();
export default UserService;