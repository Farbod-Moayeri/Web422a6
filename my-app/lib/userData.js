import { getToken } from "./authenticate";

async function makeRequest(url, method) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${getToken()}`
    }
  });

  const data = await res.json();

  if (res.status === 200) {
    return data;
  } else {
    return [];
  }
}

export async function addToFavourites(id) {
  return await makeRequest(`api/user/favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return await makeRequest(`api/user/favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return await makeRequest(`api/user/favourites`, 'GET');
}

export async function addToHistory(id) {
  return await makeRequest(`api/user/history/${id}`, 'PUT');
}

export async function removeFromHistory(id) {
  return await makeRequest(`api/user/history/${id}`, 'DELETE');
}

export async function getHistory() {
  return await makeRequest(`api/user/history`, 'GET');
}
