import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Navbar = () => {
  const [offset, setOffset] = useState<boolean>(false);
  useEffect(() => {}, []);
  return (
    <>
      <div className="h-16 bg-sky-400 flex justify-start gap-3 text-2xl items-center pl-20 sticky top-0 font-serif z-20">
        <NavLink to="/">home</NavLink>
        <NavLink to="/root">root</NavLink>
      </div>
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;
