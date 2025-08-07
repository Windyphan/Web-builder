const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class BlogAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Public blog endpoints
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/blog/posts?${queryString}` : '/blog/posts';
    return this.request(endpoint);
  }

  async getPost(slug) {
    return this.request(`/blog/posts/${slug}`);
  }

  async getTags() {
    return this.request('/blog/tags');
  }

  // Admin endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('authToken');
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  async getAdminPosts() {
    return this.request('/blog/admin/posts');
  }

  async getAdminPost(id) {
    return this.request(`/blog/admin/posts/${id}`);
  }

  async createPost(postData) {
    return this.request('/blog/admin/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id, postData) {
    return this.request(`/blog/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id) {
    return this.request(`/blog/admin/posts/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new BlogAPI();
