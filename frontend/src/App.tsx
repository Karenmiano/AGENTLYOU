import { BrowserRouter, Routes, Route } from "react-router";
import SignUp from "./pages/SignUp";
import AuthLayout from "./ui/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<h1>Hello World</h1>} />
        <Route element={<AuthLayout />}>
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<p>Sign in</p>} />
        </Route>
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
