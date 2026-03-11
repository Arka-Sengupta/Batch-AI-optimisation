import axios from "axios";

const API = "http://localhost:8000/api";

export const analyzeBatch = async (formData) => {
  try {
    const res = await axios.post(`${API}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Analyze API error:', error);
    throw error;
  }
};
