import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from './components/ui/provider'
import { AppLayout } from './layout/AppLayout'
import { InboxPage } from './pages/InboxPage'
import { UserManagementPage } from './pages/UserManagementPage'

export default function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/providers" replace />} />
            <Route
              path="providers"
              element={
                <UserManagementPage
                  role="provider"
                  title="Providers"
                  description="Search provider records or add a new provider user."
                  addLabel="Add provider"
                />
              }
            />
            <Route
              path="consumers"
              element={
                <UserManagementPage
                  role="consumer"
                  title="Consumers"
                  description="Search consumer records or invite a new consumer to sign up."
                  addLabel="Invite consumer"
                />
              }
            />
            <Route
              path="admins"
              element={
                <UserManagementPage
                  role="admin"
                  title="Admins"
                  description="Search admin users or create a new admin account."
                  addLabel="Add admin"
                />
              }
            />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="*" element={<Navigate to="/providers" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
