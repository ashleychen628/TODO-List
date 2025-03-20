const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api/login`,
    REGISTER: `${API_BASE_URL}/api/register`,
    GET_TASKS: `${API_BASE_URL}/api/tasks`,
    ADD_TASK: `${API_BASE_URL}/api/tasks`,
    UPDATE_TASK: (id) => `${API_BASE_URL}/api/tasks/${id}`,
    DELETE_TASK: (id) => `${API_BASE_URL}/api/tasks/${id}`
};

export default API_ENDPOINTS;
