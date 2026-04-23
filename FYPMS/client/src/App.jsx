import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Loading from "./components/common/Loading";

// Defense pages
import DefenseSubmission from "./pages/student/DefenseSubmission";
import DefenseEvaluation from "./pages/teacher/DefenseEvaluation";

// Public Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SecurityChallenge from "./pages/SecurityChallenge";
import InvitationResponse from "./pages/InvitationResponse";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import UserDetails from "./pages/admin/UserDetails";
import AuditLogsPage from "./pages/admin/AuditLogsPage";
import SupervisorWorkload from "./pages/admin/SupervisorWorkload";
import AdminProjectManagement from "./pages/admin/AdminProjectManagement";
import ProjectArchive from "./pages/ProjectArchive";

// Module 6 Admin/Coordinator Pages
import BatchManagement from "./pages/admin/BatchManagement";
import MasterDashboard from "./pages/admin/MasterDashboard";
import CurriculumManagement from "./pages/admin/CurriculumManagement";
import StudentMilestones from "./pages/StudentMilestones";

import ProposalDashboard from "./pages/ProposalDashboard";
import SupervisorProposals from "./pages/SupervisorProposals";
import ProposalManagement from "./pages/admin/ProposalManagement";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false, requireCoordinator = false }) => {
  const { isAuthenticated, isAdmin, hasRole, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Verifying authentication..." />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireCoordinator && !(isAdmin() || hasRole('Committee'))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Initializing..." />;
  }

  return (
    <div>
      <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/security-challenge"
            element={
              <PublicRoute>
                <SecurityChallenge />
              </PublicRoute>
            }
          />
          <Route
            path="/invitation-response"
            element={
              <PublicRoute>
                <InvitationResponse />
              </PublicRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-archive"
            element={
              <ProtectedRoute>
                <ProjectArchive />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-milestones"
            element={
              <ProtectedRoute>
                <StudentMilestones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposal-dashboard"
            element={
              <ProtectedRoute>
                <ProposalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor-proposals"
            element={
              <ProtectedRoute>
                <SupervisorProposals />
              </ProtectedRoute>
            }
          />

          {/* Proposal Defense Submission Route */}
          <Route
            path="/student/defense-submission"
            element={
              <ProtectedRoute>
                <DefenseSubmission />
              </ProtectedRoute>
            }
          />

          {/* Proposal Defense Evaluation Route - accessible to Teachers */}
          <Route
            path="/teacher/evaluations"
            element={
              <ProtectedRoute>
                <DefenseEvaluation />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <UsersManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/supervisor-workload"
            element={
              <ProtectedRoute requireAdmin={true}>
                <SupervisorWorkload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProjectManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proposals"
            element={
              <ProtectedRoute requireAdmin={true}>
                <ProposalManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/batches"
            element={
              <ProtectedRoute requireAdmin={true}>
                <BatchManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/master-dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <MasterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/curriculum"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CurriculumManagement />
              </ProtectedRoute>
            }
          />
          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </div>
  );
}

export default App;
