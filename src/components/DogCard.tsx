import { useDispatch, useSelector } from 'react-redux';

import { DogWithLocation } from '../utils/types';
import { Heart } from 'lucide-react';
import { RootState } from '../redux/store';
import { addFavorite, removeFavorite } from '../redux/authSlice';

export const DogCard = ({
  dog,
  isEditable = true,
}: {
  dog: DogWithLocation;
  isEditable?: boolean;
}) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.auth.favorites);
  const isFavorite = favorites.includes(dog.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(dog.id));
    } else {
      dispatch(addFavorite(dog.id));
    }
  };
  return (
    <div
      className={`flex flex-col items-center gap-4 p-6 min-w-40 ${
        isEditable && 'w-full border rounded-lg shadow-lg'
      }`}>
      <img src={dog.img} alt={dog.name} className="max-h-40 mx-auto" />
      <div className="text-center">
        <div className="font-bold">{dog.name}</div>
        <div>
          {dog.breed} | {dog.age} year(s)
        </div>
        <div className="text-gray-500">{`${dog.location?.city ?? 'Unknown'}, ${
          dog.location?.state ?? 'Unknown'
        } ${dog.zip_code}`}</div>
      </div>
      {isEditable && (
        <Heart
          className="w-6 h-6 cursor-pointer mt-auto"
          stroke="#f97316"
          fill={isFavorite ? '#f97316' : 'transparent'}
          onClick={toggleFavorite}
        />
      )}
    </div>
  );
};
