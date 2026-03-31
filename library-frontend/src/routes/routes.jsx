import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Books from "../pages/Books";
import AddBook from "../pages/AddBook";
import IssueBook from "../pages/IssueBook";
import ReturnBook from "../pages/ReturnBook";
import Reports from "../pages/Reports";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EditBook from "../pages/EditBook"; // ✅ ADDED
import PendingRequests from "../pages/PendingRequests";
import MyBooks from "../pages/MyBooks";
import IssueHistory from "../pages/IssueHistory"; // NEW

import ProtectedRoute from "../components/ProtectedRoute";

const RoutesConfig = () => {
  return (
    <Routes>

      {/* 🔓 PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-book"
        element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-book/:id"   // ✅ EDIT ROUTE
        element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/issue"
        element={
          <ProtectedRoute>
            <IssueBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/return"
        element={
          <ProtectedRoute>
            <ReturnBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pending-requests"
        element={
          <ProtectedRoute>
            <PendingRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-books"
        element={
          <ProtectedRoute>
            <MyBooks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/issue-history"
        element={
          <ProtectedRoute>
            <IssueHistory />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default RoutesConfig;