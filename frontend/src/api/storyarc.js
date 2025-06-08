import axios from 'axios';

const API_URL = 'http://localhost:8000/api/story-arcs/';
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access')}`
  }
});

export const fetchStoryArcs = async () => {
  const res = await axios.get(API_URL, getAuthHeader());
  return res.data;
};

export const createStoryArc = async (data) => {
  const res = await axios.post(API_URL, data, getAuthHeader());
  return res.data;
};

export const updateStoryArc = async (id, data) => {
  const res = await axios.put(`http://localhost:8000/api/story-arcs/${id}/`, data, getAuthHeader());
  return res.data;
};

export const deleteStoryArc = async (id) => {
  await axios.delete(`http://localhost:8000/api/story-arcs/${id}/`, getAuthHeader());
};
