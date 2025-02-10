import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getDogBreeds } from '../utils/api';

export const BreedList = ({
  selectedBreeds,
  setSelectedBreeds,
}: {
  selectedBreeds: string[];
  setSelectedBreeds: (breeds: string[]) => void;
}) => {
  const { data: allBreeds = [], isLoading: isBreedLoading } = useQuery({
    queryKey: ['dogBreeds'],
    queryFn: getDogBreeds,
  });

  return (
    <Autocomplete
      multiple
      size="small"
      sx={{ width: '250px' }}
      limitTags={2}
      options={allBreeds}
      loading={isBreedLoading}
      disableCloseOnSelect
      value={selectedBreeds}
      onChange={(_, newBreeds) => setSelectedBreeds(newBreeds)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Breeds"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isBreedLoading ? (
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
  );
};
