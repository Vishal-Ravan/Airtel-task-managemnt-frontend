import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";


const DashboardLayout = () => {

  return (

    <div className="min-h-screen bg-gray-50">

      <Sidebar />

      <main className="lg:ml-64 min-h-screen min-w-0">

        <Header />

        <div
          className="
            p-4
            pt-20
            sm:p-6
            sm:pt-20
            lg:p-8
            lg:pt-8
          "
        >

          <Outlet />

        </div>

      </main>

    </div>

  );
};


export default DashboardLayout;