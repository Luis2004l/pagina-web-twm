// src/services/siteService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Función auxiliar para manejar las peticiones e incluir el token JWT
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
  }

  return response.json();
};

export const siteService = {
  // Obtener la lista de centros
  getSites: async () => {
    return await fetchWithAuth('/sites');
  },

  // Obtener el detalle de un centro por su ID
  getSiteById: async (id) => {
    return await fetchWithAuth(`/sites/${id}`);
  },

  // Obtener los sensores asociados a un centro específico
  getSensorsBySite: async (siteId) => {
    return await fetchWithAuth(`/sensors?site_id=${siteId}`);
  }
};