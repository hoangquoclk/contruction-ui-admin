import { NavLink } from "react-router-dom"
import { FileText, FolderTree, ImageIcon } from "lucide-react"

export default function Sidebar() {
  const navItems = [
    // {
    //   to: "/dashboard",
    //   icon: <LayoutDashboard className="size-5" />,
    //   label: "Dashboard",
    // },
    { to: "/blogs", icon: <FileText className="size-5" />, label: "Blogs" },
    {
      to: "/categories",
      icon: <FolderTree className="size-5" />,
      label: "Categories",
    },
    {
      to: "/images",
      icon: <ImageIcon className="size-5" />,
      label: "Image",
    },
  ]

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="px-3 py-2">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-3 text-gray-700 ${
                    isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
