import React, { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Slider,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import { fetchDogs, searchDogs } from '../utils/api';
import { SearchDog } from '../utils/types';
import { DogCard } from '../components/DogCard';
import { BreedList } from '../components/BreedList';

export const SearchDogs = () => {
  const [age, setAge] = useState<number[]>([0, 10]);
  const [sort, setSort] = useState<string>('breed:asc');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  // const [selectedLocation, setSelectedLocation] = useState<Location | null>(
  //   null
  // );
  const [zipCode, setZipCode] = useState<string>('');

  const searchMutation = useMutation({
    mutationFn: async (searchParam: SearchDog) => {
      const result = await searchDogs(searchParam);
      return result;
    },
  });

  const {
    resultIds,
    total,
    next: nextPage,
    prev: prevPage,
  } = searchMutation.data || {};

  const { data: dogs = [], isSuccess } = useQuery({
    queryKey: ['fetchDogs', resultIds],
    queryFn: () => fetchDogs(resultIds),
    enabled: !!resultIds?.length,
  });

  const onSortChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      setSort(e.target.value);
      if (dogs.length > 0) {
        searchMutation.mutate({
          zipCodes: zipCode ? [zipCode] : [],
          breeds: selectedBreeds,
          ageMin: age[0],
          ageMax: age[1],
          size: 25,
          sort: e.target.value,
        });
      }
    },
    [setSort, searchMutation, dogs, selectedBreeds, age]
  );

  const paginationButton = (
    <div className="flex gap-2">
      <button
        onClick={() => searchMutation.mutate({ from: prevPage })}
        disabled={!prevPage?.length}
        className="bg-orange-500 text-white rounded disabled:opacity-50 px-2">
        {'<'}
      </button>
      <button
        onClick={() => searchMutation.mutate({ from: nextPage })}
        disabled={!nextPage?.length}
        className="bg-orange-500 text-white rounded disabled:opacity-50 px-2">
        {'>'}
      </button>
    </div>
  );

  console.log(searchMutation);

  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12 px-24">
      <div className="flex flex-wrap gap-4 w-full items-center justify-center">
        {/* <LocationList
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        /> */}

        <TextField
          size="small"
          type="number"
          label="Zip Code"
          value={zipCode}
          inputMode="numeric"
          onChange={(event) => setZipCode(event.target.value)}
        />
        <BreedList
          selectedBreeds={selectedBreeds}
          setSelectedBreeds={setSelectedBreeds}
        />

        <InputLabel>Age:</InputLabel>
        <Box sx={{ width: 150 }}>
          <Slider
            getAriaLabel={() => 'Age range'}
            value={age}
            onChange={(_, newAgeRange: number | number[]) =>
              setAge(newAgeRange as number[])
            }
            valueLabelDisplay="auto"
            min={0}
            max={20}
            className="text-orange-500"
          />
        </Box>
        <Button
          onClick={() =>
            searchMutation.mutate({
              zipCodes: zipCode ? [zipCode] : [],
              breeds: selectedBreeds,
              ageMin: age[0],
              ageMax: age[1],
              size: 25,
              sort,
            })
          }
          className="bg-orange-500 text-white rounded px-3">
          Search
        </Button>

        <FormControl size="small" className="ml-auto">
          <InputLabel>Sort</InputLabel>
          <Select value={sort} onChange={onSortChange} label="Sort">
            <MenuItem value="breed:asc">Breed Asc</MenuItem>
            <MenuItem value="breed:desc">Breed Desc</MenuItem>
            <MenuItem value="age:asc">Age Asc</MenuItem>
            <MenuItem value="age:desc">Age Desc</MenuItem>
            <MenuItem value="name:asc">Name Asc</MenuItem>
            <MenuItem value="name:desc">Name Desc</MenuItem>
          </Select>
        </FormControl>
      </div>

      {searchMutation.isPending && <p>Loading...</p>}
      {searchMutation.isError && <p>Error fetching data</p>}
      {dogs.length > 0 && (
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="flex w-full justify-between">
            <div className="font-semibold">Total Results: {total}</div>
            {paginationButton}
          </div>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
            {dogs.map((dog) => (
              <DogCard dog={dog} key={dog.id} />
            ))}
          </div>
          {paginationButton}
        </div>
      )}
      {dogs.length === 0 && isSuccess && <p>No dogs found </p>}
    </div>
  );
};
