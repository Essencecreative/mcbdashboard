import React from 'react';
import { Routes, Route } from "react-router";
import './App.css';

import LoginPage from './components/login-page';
import DashboardContent from './components/dashboard-content';
import PublicationsPage from './components/publications';
import NewsEventsPage from './components/news-events';
import TeamPage from './components/team';
import NewTeamMemberPage from './components/team-new';
import NewPublicationPage from './components/publications-new';
import NewNewsEventPage from './components/news-new';
import ProtectedRoute from './ProtectedRoute';
import SettingsPage from './components/settings';
import ProfileSettingsPage from './components/profile';
import OpportunitiesTable from './components/opportunities-table';
import NewOpportunityPage from './components/opportunities-new';
import UsersTable from './components/users-table';
import NewUserPage from './components/users-new';
import EditPublicationPage from './components/publicationedit';
import EditNewsEventPage from './components/news-edit';
import EditTeamMemberPage from './components/team-edit';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        index
        element={
          <ProtectedRoute>
            <DashboardContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/publications"
        element={
          <ProtectedRoute>
            <PublicationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news-and-events"
        element={
          <ProtectedRoute>
            <NewsEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <TeamPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teamnew"
        element={
          <ProtectedRoute>
            <NewTeamMemberPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/publicationnew"
        element={
          <ProtectedRoute>
            <NewPublicationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/newsnew"
        element={
          <ProtectedRoute>
            <NewNewsEventPage />
          </ProtectedRoute>
        }
      />
        <Route
        path="/opportunitiesnew"
        element={
          <ProtectedRoute>
            <NewOpportunityPage />
          </ProtectedRoute>
        }
      />
        <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettingsPage />
          </ProtectedRoute>
        }
      />
        <Route
        path="/opportunities"
        element={
          <ProtectedRoute>
            <OpportunitiesTable />
          </ProtectedRoute>
        }
      />
       <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersTable />
          </ProtectedRoute>
        }
      />
       <Route
        path="/usernew"
        element={
          <ProtectedRoute>
            <NewUserPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/publications/:id/edit"
        element={
          <ProtectedRoute>
            <EditPublicationPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/news-and-events/:id/edit"
        element={
          <ProtectedRoute>
            <EditNewsEventPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/team/:id/edit"
        element={
          <ProtectedRoute>
            <EditTeamMemberPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
