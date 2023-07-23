import { NavLink, Outlet } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <div className="sticky top-0 z-20 flex items-center justify-start h-16 gap-3 pl-20 font-serif text-2xl bg-secondary">
        <NavLink to="/">home</NavLink>
        <NavLink to="/#root">root</NavLink>
      </div>
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;
