import { useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';

import { searchLocation } from '../utils/api';
import { Location } from '../utils/types';
import React from 'react';

export const LocationList = ({
  selectedLocation,
  setSelectedLocation,
}: {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', searchTerm],
    queryFn: () => searchLocation({ city: searchTerm }),
  });

  return (
    <>
      <Autocomplete
        size="small"
        sx={{ width: '250px' }}
        options={locations}
        getOptionLabel={(option: Location) =>
          `${option.city}, ${option.state} ${option.zip_code}`
        }
        inputValue={searchTerm}
        onInputChange={(_, value) => setSearchTerm(value)}
        value={selectedLocation}
        onChange={(_, newLocation) => setSelectedLocation(newLocation)}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search City"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
      />
    </>
  );
};
