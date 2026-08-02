const API_URL =
  import.meta.env.VITE_API_URL ||
  "";

const API = {
  baseURL: API_URL,

  products:
    `${API_URL}/api/products`,

  contact:
    `${API_URL}/api/contact`,

  productById(id) {
    return `${API_URL}/api/products/${id}`;
  },

  image(filename) {
    if (!filename) return "";

    return `${API_URL}/uploads/${filename}`;
  }
};

export default API;
