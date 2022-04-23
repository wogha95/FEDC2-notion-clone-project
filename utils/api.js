import { API_ERROR } from './error.js';

const API_END_POINT = 'https://kdt-frontend.programmers.co.kr';

export const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        'x-username': 'wogha95',
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) return res.json();
    
    throw new Error(API_ERROR);
  } catch(error) {
    console.log(error);
  }
}
