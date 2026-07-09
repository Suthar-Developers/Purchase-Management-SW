import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
      <div className="flex flex-col justify-center w-screen h-screen">
          <Outlet />
      </div>
  )
}

export default AuthLayout
