import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@mui/material';

import { RootState, AppDispatch } from '../redux/store';
import { DogCard } from '../components/DogCard';
import { fetchDogs } from '../utils/api';
import { DogWithLocation } from '../utils/types';
import { fetchMatchedDogId } from '../redux/authSlice';

export const FavoriteDogs = () => {
  const favoriteDogIds = useSelector(
    (state: RootState) => state.auth.favorites
  );
  const matchedDogId = useSelector((state: RootState) => state.auth.match);
  const dispatch: AppDispatch = useDispatch();

  const { data: favoriteDogs } = useQuery({
    queryKey: ['favoriteDogs', favoriteDogIds],
    queryFn: () => fetchDogs(favoriteDogIds),
    enabled: favoriteDogIds.length > 0,
  });

  const { data: matchedDog } = useQuery({
    queryKey: ['matchedDog', matchedDogId],
    queryFn: () => fetchDogs(matchedDogId ? [matchedDogId] : []),
    enabled: Boolean(matchedDogId),
  });

  const handleMatchClick = useCallback(() => {
    dispatch(fetchMatchedDogId(favoriteDogIds));
  }, [dispatch, favoriteDogIds]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {favoriteDogIds.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="flex w-full h-full">
          <div className="flex flex-col items-center pt-[10%] gap-4 w-[30%] h-screen fixed bg-gray-100">
            <p>Your Match:</p>
            {matchedDog && matchedDog.length && (
              <DogCard
                key={matchedDog[0]?.id}
                dog={matchedDog[0]}
                isEditable={false}
              />
            )}
            <Button
              className="bg-orange-500 text-white rounded"
              onClick={handleMatchClick}>
              {matchedDog ? 'ReMatch' : 'Match'}
            </Button>
          </div>
          <div className="w-[70%] ml-[30%] flex flex-col justify-center items-center gap-4 p-10">
            <p>Your Favorite List:</p>
            <div className="grid grid-cols-3 gap-4 place-content-center">
              {favoriteDogs?.map((dog: DogWithLocation) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteDogs;
