import { Outlet } from "react-router-dom";
import SideNav from "../components/common/SideNav";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const AppLayout = () => {
  return (
      <div className='flex h-screen overflow-hidden'>
          <SideNav />

          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
              <Header />

              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                  <Outlet />
              </main>

              <Footer />
          </div>
      </div>
  )
}

export default AppLayout
