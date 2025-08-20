const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

// En local : http://localhost:5000/api/auth
// En Kubernetes : service DNS interne auth-service:5000

export const registerUser = async (username, password) => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return res.json();
};

// api.js
export const loginUser = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getProtectedData = async (token) => {
    const res = await fetch(`${API_URL}/protected`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
};

