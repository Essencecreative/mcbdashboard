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
import EditOpportunityPage from './components/opportunities-edit';
import UsersTable from './components/users-table';
import NewUserPage from './components/users-new';
import EditPublicationPage from './components/publicationedit';
import EditNewsEventPage from './components/news-edit';
import EditTeamMemberPage from './components/team-edit';
import CarouselItemForm from './components/carousel-new';
import CarouselList from './components/carousel';
import CarouselEdit from './components/carousel-edit';
import WaysToBankForm from './components/WaysToBank';
import WaysToBankList from './components/WaysToBankList';
import WaysToBankEdit from './components/WaysToBankEdit';
import InvestorNewsForm from './components/InvestorNewsForm';
import InvestorNewsList from './components/InvestorNewsList';
import InvestorNewsEdit from './components/InvestorNewsEdit';
import InvestorCategoryList from './components/InvestorCategoryList';
import InvestorCategoryForm from './components/InvestorCategoryForm';
import NewsList from './components/news-and-updates';
import NewsNewForm from './components/news-and-updates-new';
import NewsAndUpdateEdit from './components/news-and-updates-edit';
import BoardOfDirectorsList from './components/BoardOfDirectorsList';
import BoardOfDirectorsForm from './components/BoardOfDirectorsForm';
import BoardOfDirectorsEdit from './components/BoardOfDirectorsEdit';
import ManagementList from './components/ManagementList';
import ManagementForm from './components/ManagementForm';
import ManagementEdit from './components/ManagementEdit';
import HeaderUpdateList from './components/HeaderUpdateList';
import HeaderUpdateForm from './components/HeaderUpdateForm';
import HeaderUpdateEdit from './components/HeaderUpdateEdit';
import MenuCategoryList from './components/MenuCategoryList';
import MenuCategoryForm from './components/MenuCategoryForm';
import MenuItemList from './components/MenuItemList';
import MenuItemForm from './components/MenuItemForm';
import WakalaList from './components/WakalaList';
import WakalaForm from './components/WakalaForm';
import WakalaEdit from './components/WakalaEdit';
import FAQList from './components/FAQList';
import FAQForm from './components/FAQForm';
import FAQEdit from './components/FAQEdit';

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
        path="/carousel"
        element={
          <ProtectedRoute>
            <CarouselList />
          </ProtectedRoute>
        }
      />
        <Route
        path="/carousel/new"
        element={
          <ProtectedRoute>
            <CarouselItemForm />
          </ProtectedRoute>
        }
      />
        <Route
        path="/carousel/edit/:id"
        element={
          <ProtectedRoute>
            <CarouselEdit />
          </ProtectedRoute>
        }
      />
        <Route
        path="/products"
        element={
          <ProtectedRoute>
            <WaysToBankList />
          </ProtectedRoute>
        }
      />
         <Route
        path="/products/create"
        element={
          <ProtectedRoute>
            <WaysToBankForm />
          </ProtectedRoute>
        }
      />
       <Route
        path="/products/edit/:id"
        element={
          <ProtectedRoute>
            <WaysToBankEdit />
          </ProtectedRoute>
        }
      />
       <Route
        path="/investorsnews"
        element={
          <ProtectedRoute>
            <InvestorNewsList />
          </ProtectedRoute>
        }
      />
       <Route
        path="/news-and-updates"
        element={
          <ProtectedRoute>
            <NewsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investors"
        element={
          <ProtectedRoute>
            <InvestorCategoryList />
          </ProtectedRoute>
        }
      />
       <Route
        path="/investors/:category/add"
        element={
          <ProtectedRoute>
            <InvestorCategoryForm />
          </ProtectedRoute>
        }
      />
       <Route
        path="/investors/:category/edit/:id"
        element={
          <ProtectedRoute>
            <InvestorCategoryForm />
          </ProtectedRoute>
        }
      />
       <Route
        path="/investorsnews/create"
        element={
          <ProtectedRoute>
            <InvestorNewsForm />
          </ProtectedRoute>
        }
      />
       <Route
        path="/investorsnews/edit/:id"
        element={
          <ProtectedRoute>
            <InvestorNewsEdit />
          </ProtectedRoute>
        }
      />
        <Route
        path="/news-and-updates/create"
        element={
          <ProtectedRoute>
            <NewsNewForm />
          </ProtectedRoute>
        }
      />
       <Route
        path="/news-and-updates/edit/:id"
        element={
          <ProtectedRoute>
            <NewsAndUpdateEdit />
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
        path="/opportunities/edit/:id"
        element={
          <ProtectedRoute>
            <EditOpportunityPage />
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
      {/* Board of Directors Routes */}
      <Route
        path="/board-of-directors"
        element={
          <ProtectedRoute>
            <BoardOfDirectorsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board-of-directors/new"
        element={
          <ProtectedRoute>
            <BoardOfDirectorsForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board-of-directors/edit/:id"
        element={
          <ProtectedRoute>
            <BoardOfDirectorsEdit />
          </ProtectedRoute>
        }
      />
      {/* Management Routes */}
      <Route
        path="/management"
        element={
          <ProtectedRoute>
            <ManagementList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/new"
        element={
          <ProtectedRoute>
            <ManagementForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/edit/:id"
        element={
          <ProtectedRoute>
            <ManagementEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wakala"
        element={
          <ProtectedRoute>
            <WakalaList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wakala/new"
        element={
          <ProtectedRoute>
            <WakalaForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wakala/edit/:id"
        element={
          <ProtectedRoute>
            <WakalaEdit />
          </ProtectedRoute>
        }
      />
      {/* FAQ Routes */}
      <Route
        path="/faqs"
        element={
          <ProtectedRoute>
            <FAQList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faqs/new"
        element={
          <ProtectedRoute>
            <FAQForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faqs/edit/:id"
        element={
          <ProtectedRoute>
            <FAQEdit />
          </ProtectedRoute>
        }
      />
      {/* Header Update Routes */}
      <Route
        path="/header-update"
        element={
          <ProtectedRoute>
            <HeaderUpdateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/header-update/new"
        element={
          <ProtectedRoute>
            <HeaderUpdateForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/header-update/edit/:id"
        element={
          <ProtectedRoute>
            <HeaderUpdateEdit />
          </ProtectedRoute>
        }
      />
      {/* Menu Categories Routes */}
      <Route
        path="/menu-categories"
        element={
          <ProtectedRoute>
            <MenuCategoryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu-categories/new"
        element={
          <ProtectedRoute>
            <MenuCategoryForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu-categories/edit/:id"
        element={
          <ProtectedRoute>
            <MenuCategoryForm />
          </ProtectedRoute>
        }
      />
      {/* Menu Items Routes */}
      <Route
        path="/menu-items"
        element={
          <ProtectedRoute>
            <MenuItemList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu-items/new"
        element={
          <ProtectedRoute>
            <MenuItemForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu-items/edit/:id"
        element={
          <ProtectedRoute>
            <MenuItemForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
