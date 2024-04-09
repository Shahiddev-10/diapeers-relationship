const token = localStorage.getItem("token") !== null ? localStorage.getItem('token') : null;
export const config = {
  headers: {
    'Content-Type': ' application/vnd.api+json',
    'Accept': ' application/vnd.api+json',
    'Authorization': `Bearer ${token}`,
  }
};