import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { logoutUser } from '../redux/authSlice';

export const NavBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const onLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="fixed flex h-12 gap-10 bg-orange-500 text-white w-full items-center px-8">
      <strong>DOG SHELTER</strong>

      {user && (
        <div className="flex justify-between flex-1">
          <div className="flex gap-4">
            <NavLink to="/search">
              {({ isActive }) => (
                <button className={isActive ? 'underline' : ''}>Search</button>
              )}
            </NavLink>
            <NavLink to="/favo">
              {({ isActive }) => (
                <button className={isActive ? 'underline' : ''}>
                  Favorites
                </button>
              )}
            </NavLink>
          </div>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};
