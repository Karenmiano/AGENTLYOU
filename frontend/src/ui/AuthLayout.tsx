import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div>
      <nav>
        <div className="text-3xl font-bold small-caps px-6 py-3 invisible">
          <span className="text-[#E45F2B]">AGE</span>
          <span className="text-[#F6C445]">NT</span>
          <span className="text-[#432DD7]">LY</span>
          <span className="text-[#A0E548]">OU</span>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
