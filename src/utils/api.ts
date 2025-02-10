import axios from 'axios';
import {
  SearchDog,
  Location,
  DogWithLocation,
  Dog,
  SearchLocation,
} from './types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';
axios.defaults.withCredentials = true;

export const handleLogin = async (name: string, email: string) => {
  const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
    name,
    email,
  });
  return data;
};

export const handleLogout = async () => {
  const { data } = await axios.post(`${API_BASE_URL}/auth/logout`);
  return data;
};

export const getDogBreeds = async (): Promise<string[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/dogs/breeds`);
  return data;
};

export const searchDogs = async (queryParams: SearchDog) => {
  const url = queryParams.from
    ? `${API_BASE_URL}${queryParams.from}`
    : `${API_BASE_URL}/dogs/search`;

  const response = await axios.get(url, {
    params: queryParams,
    paramsSerializer: {
      indexes: true,
    },
  });
  if (response.status !== 200) {
    throw new Error('Failed to search dogs');
  }
  return response.data;
};

export const fetchDogs = async (ids: string[]): Promise<DogWithLocation[]> => {
  try {
    const response = await axios.post<Dog[]>(`${API_BASE_URL}/dogs`, ids);

    const dogs: Dog[] = response.data;

    const zipCodes: string[] = dogs
      .map((dog: Dog) => dog.zip_code)
      .slice(0, 100);

    const locations = await fetchLocations(zipCodes);
    const zipToLocationMap = locations.reduce(
      (acc: { [key: string]: Location }, location) => {
        if (!location) {
          return acc;
        }
        acc[location.zip_code] = location;
        return acc;
      },
      {}
    );
    return dogs.map((dog) => ({
      ...dog,
      location: zipToLocationMap[dog.zip_code] || undefined,
    }));
  } catch (error) {
    throw new Error('Failed to fetch dogs');
  }
};

export const findMatchDogId = async (ids: string[]) => {
  const { data } = await axios.post<{ match: string }>(
    `${API_BASE_URL}/dogs/match`,
    ids
  );
  return data;
};

export const fetchLocations = async (
  zipCodes: string[]
): Promise<Location[]> => {
  const { data } = await axios.post<Location[]>(
    `${API_BASE_URL}/locations`,
    zipCodes
  );
  return data;
};

export const searchLocation = async (
  queryParam: SearchLocation
): Promise<Location[]> => {
  const response = await axios.post(`${API_BASE_URL}/locations/search`, {
    pararm: queryParam,
    paramsSerializer: {
      indexes: true,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to search location');
  }

  const {
    data: { results },
  } = response;

  return results;
};
