import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div>
      <nav>
        <div className="text-2xl font-bold small-caps">Agentlyou</div>
      </nav>
      <div className="mx-auto max-w-fit mt-8 sm:mt-10 px-10 py-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
