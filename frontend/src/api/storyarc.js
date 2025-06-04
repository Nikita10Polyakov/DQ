import axios from 'axios';

const API_URL = 'http://localhost:8000/api/story-arcs/';

export const fetchStoryArcs = async () => {
  const token = localStorage.getItem('access');
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
