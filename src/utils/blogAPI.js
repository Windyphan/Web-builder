const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class BlogAPI {
  async getPosts(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append('search', params.search);
      if (params.tag) queryParams.append('tag', params.tag);
      if (params.featured) queryParams.append('featured', params.featured);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);

      const response = await fetch(`${API_BASE_URL}/blog/posts?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getPostBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found');
        }
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  async getTags() {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/tags`);

      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Admin functions (require authentication)
  async getAdminPosts(token, params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);

      const response = await fetch(`${API_BASE_URL}/blog/admin/posts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch admin posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching admin posts:', error);
      throw error;
    }
  }

  async createPost(token, postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/admin/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async updatePost(token, postId, postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePost(token, postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Authentication functions
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async verifyToken() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Token verification failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('authToken'); // Remove invalid token
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }
}

const blogAPI = new BlogAPI();
export default blogAPI;
