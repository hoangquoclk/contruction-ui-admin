import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"
import Layout from "@/components/Layout"
import BlogList from "@/pages/blog/blog-list.tsx"
import BlogEditor from "@/pages/blog/blog-editor"
import NotFound from "@/pages/NotFound"
import CategoryList from "@/pages/category/CategoryList"
import CategoryEditor from "@/pages/category/CategoryEditor"
import ImageLibrary from "@/pages/media/ImageLibrary.tsx"
import Login from "@/pages/auth/Login.tsx"
import ProtectedRoute from "@/components/ProtectedRoute.tsx"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/blogs" replace />} />
          {/*<Route path="dashboard" element={<Dashboard />} />*/}

          {/* Blog routes */}
          <Route path="blogs">
            <Route index element={<BlogList />} />
            <Route path="new" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
          </Route>

          {/* Category routes */}
          <Route path="categories">
            <Route index element={<CategoryList />} />
            <Route path="new" element={<CategoryEditor />} />
            <Route path="edit/:id" element={<CategoryEditor />} />
          </Route>

          {/* Media routes */}
          <Route path="images" element={<ImageLibrary />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}
