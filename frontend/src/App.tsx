import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

import SignUpRole from "./pages/auth/SignUpRole";
import SignUpForm from "./pages/auth/SignUpForm";
import AuthLayout from "./ui/AuthLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<h1>Hello World</h1>} />
          <Route element={<AuthLayout />}>
            <Route path="signup">
              <Route path="role" element={<SignUpRole />} />
              <Route path="form" element={<SignUpForm />} />
            </Route>
            <Route path="signin" element={<p>Sign in</p>} />
          </Route>
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
