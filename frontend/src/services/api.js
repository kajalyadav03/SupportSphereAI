const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


// ==========================================
// GET TOKEN
// ==========================================
const getToken = () => {
  const token = localStorage.getItem("token");

  console.log("API TOKEN:", token);

  return token;
};


// ==========================================
// COMMON API REQUEST
// ==========================================
const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  // Only set JSON content type when body exists
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log("API REQUEST:", {
    endpoint,
    tokenExists: !!token,
    authorization: headers.Authorization,
  });

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {
      message: "Invalid server response",
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong"
    );
  }

  return data;
};


// ==========================================
// API METHODS
// ==========================================
const api = {
  get: (endpoint) =>
    apiRequest(endpoint, {
      method: "GET",
    }),

  post: (endpoint, body) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    apiRequest(endpoint, {
      method: "DELETE",
    }),
};

export default api;