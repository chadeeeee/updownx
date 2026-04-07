import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NotFound } from "./screens/NotFound";
import { Auth } from "./screens/Auth";
import { Landing } from "./screens/Landing";
import { Accounts } from "./screens/Accounts";
import { Payments } from "./screens/Payments";
import { Checkout } from "./screens/Checkout";
import { CheckoutLanding } from "./screens/CheckoutLanding";
import { EventLive } from "./screens/EventLive";
import { Trading } from "./screens/Trading";
import { ControlPanel } from "./screens/ControlPanel";
import { AuthProvider, useAuth } from "./lib/auth";

const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route
            path="/challenge"
            element={
              <PrivateRoute>
                <EventLive />
              </PrivateRoute>
            }
          />
          <Route
            path="/accounts"
            element={<PrivateRoute><Accounts /></PrivateRoute>}
          />
          <Route
            path="/new-challenge"
            element={<PrivateRoute><Accounts /></PrivateRoute>}
          />
          <Route
            path="/withdrawals"
            element={<PrivateRoute><Accounts /></PrivateRoute>}
          />
          <Route
            path="/help"
            element={<PrivateRoute><Accounts /></PrivateRoute>}
          />
          <Route
            path="/payments"
            element={<PrivateRoute><Payments /></PrivateRoute>}
          />
          <Route path="/event-live" element={<EventLive />} />
          <Route
            path="/trading"
            element={
              <PrivateRoute>
                <ControlPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/control-panel"
            element={
              <PrivateRoute>
                <Trading />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutLanding />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout/:planId"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
