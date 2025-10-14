import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

import SignUpRole from "./pages/auth/SignUpRole";
import SignUpForm from "./pages/auth/SignUpForm";
import AuthLayout from "./ui/AuthLayout";

import CreateGigLayout from "./features/gigs/create/components/CreateGigLayout";
import CreateGigTitlePage from "./pages/gigs/create/CreateGigTitlePage";
import CreateGigDescriptionPage from "./pages/gigs/create/CreateGigDescriptionPage";
import CreateGigLabelsPage from "./pages/gigs/create/CreateGigLabelsPage";
import CreateGigLocationAndTimePage from "./pages/gigs/create/CreateGigLocationAndTimePage";
import CreateGigCompensationPage from "./pages/gigs/create/CreateGigCompensationPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<h1>Hello World</h1>} />
          <Route element={<AuthLayout />}>
            <Route path="signup">
              <Route index path="role" element={<SignUpRole />} />
              <Route path="form" element={<SignUpForm />} />
            </Route>
            <Route path="signin" element={<p>Sign in</p>} />
          </Route>
          <Route path="gigs">
            <Route path="new/">
              <Route
                index
                element={<p>This page will welcome you to create a gig.</p>}
              />
              <Route element={<CreateGigLayout />}>
                <Route path="title" element={<CreateGigTitlePage />} />
                <Route
                  path="description"
                  element={<CreateGigDescriptionPage />}
                />
                <Route path="label" element={<CreateGigLabelsPage />} />
                <Route
                  path="location-time"
                  element={<CreateGigLocationAndTimePage />}
                />
                <Route
                  path="compensation"
                  element={<CreateGigCompensationPage />}
                />
              </Route>
            </Route>
            <Route
              path="review"
              element={<p>Review a gig and possibly publish it</p>}
            />
          </Route>
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
