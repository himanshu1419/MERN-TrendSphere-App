import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Left Section - Auth Illustration */}
      <div className="hidden lg:flex items-center justify-center w-1/2 px-12 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-md space-y-6 text-center">
          <img src="/trendsphereLogo.webp" className="h-80 w-96 mx-auto" alt="" />
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to TrendSphere
          </h1>
          <p className="text-lg text-gray-300">
          Your destination for the latest trends and timeless fashion essentials
          </p>
        </div>
      </div>

      {/* Right Section - Authentication Form */}
      <div className="flex flex-1 items-center justify-center bg-white shadow-lg rounded-lg px-6 py-12 sm:px-8 lg:px-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
