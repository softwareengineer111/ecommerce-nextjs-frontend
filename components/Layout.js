import Navbar from '../pages/Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className='container'>{children}</main>
    </>
  );
};

export default Layout;
