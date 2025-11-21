import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router"
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "./ui/dialog"
import { Input } from "./ui/input"
import {
  LayoutDashboard,
  Newspaper,
  TrendingUp,
  Briefcase,
  Package,
  Image,
  Users,
  Menu,
  FolderTree,
  Settings,
  DollarSign,
  FileText,
  HelpCircle,
  Building2,
  User,
  Search as SearchIcon,
  ArrowRight,
} from "lucide-react"
import { cn } from "../lib/utils"

interface SearchItem {
  id: string
  title: string
  description: string
  path: string
  icon: any
  category: string
  keywords?: string[]
}

const searchItems: SearchItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "View overview and statistics",
    path: "/",
    icon: LayoutDashboard,
    category: "Main",
    keywords: ["home", "overview", "stats", "analytics"],
  },
  {
    id: "products",
    title: "Products",
    description: "Manage banking products and services",
    path: "/products",
    icon: Package,
    category: "Content",
    keywords: ["banking", "services", "ways to bank"],
  },
  {
    id: "news-updates",
    title: "News & Updates",
    description: "Manage news articles and updates",
    path: "/news-and-updates",
    icon: Newspaper,
    category: "Content",
    keywords: ["articles", "news", "updates", "blog"],
  },
  {
    id: "investor-news",
    title: "Investor News",
    description: "Manage investor-related news",
    path: "/investorsnews",
    icon: TrendingUp,
    category: "Investors",
    keywords: ["investor", "financial", "stocks"],
  },
  {
    id: "investors",
    title: "Investor Categories",
    description: "Manage investor categories and documents",
    path: "/investors",
    icon: FolderTree,
    category: "Investors",
    keywords: ["categories", "agm", "financial reports", "shareholding"],
  },
  {
    id: "opportunities",
    title: "Opportunities",
    description: "Manage job opportunities and vacancies",
    path: "/opportunities",
    icon: Briefcase,
    category: "Content",
    keywords: ["jobs", "vacancies", "careers", "hiring"],
  },
  {
    id: "carousel",
    title: "Carousel Items",
    description: "Manage homepage carousel banners",
    path: "/carousel",
    icon: Image,
    category: "Content",
    keywords: ["banner", "slider", "homepage", "images"],
  },
  {
    id: "board-directors",
    title: "Board of Directors",
    description: "Manage board members",
    path: "/board-of-directors",
    icon: Users,
    category: "Team",
    keywords: ["board", "directors", "leadership"],
  },
  {
    id: "management",
    title: "Management",
    description: "Manage management team members",
    path: "/management",
    icon: Building2,
    category: "Team",
    keywords: ["management", "executives", "team"],
  },
  {
    id: "menu-items",
    title: "Menu Items",
    description: "Manage navigation menu items",
    path: "/menu-items",
    icon: Menu,
    category: "Settings",
    keywords: ["navigation", "menu", "links"],
  },
  {
    id: "menu-categories",
    title: "Menu Categories",
    description: "Manage menu categories",
    path: "/menu-categories",
    icon: FolderTree,
    category: "Settings",
    keywords: ["menu", "categories", "navigation"],
  },
  {
    id: "header-update",
    title: "Header Updates",
    description: "Manage header announcements",
    path: "/header-update",
    icon: Settings,
    category: "Settings",
    keywords: ["header", "announcements", "updates"],
  },
  {
    id: "wakala",
    title: "Wakala Locations",
    description: "Manage Wakala branch locations",
    path: "/wakala",
    icon: Building2,
    category: "Content",
    keywords: ["branches", "locations", "wakala"],
  },
  {
    id: "faqs",
    title: "FAQs",
    description: "Manage frequently asked questions",
    path: "/faqs",
    icon: HelpCircle,
    category: "Content",
    keywords: ["questions", "faq", "help"],
  },
  {
    id: "users",
    title: "Users",
    description: "Manage dashboard users",
    path: "/users",
    icon: User,
    category: "Settings",
    keywords: ["users", "accounts", "team members"],
  },
  {
    id: "profile",
    title: "Profile",
    description: "View and edit your profile",
    path: "/profile",
    icon: User,
    category: "Settings",
    keywords: ["profile", "account", "settings"],
  },
  {
    id: "settings",
    title: "Settings",
    description: "Application settings",
    path: "/settings",
    icon: Settings,
    category: "Settings",
    keywords: ["settings", "preferences", "config"],
  },
]

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  const filteredItems = searchItems.filter((item) => {
    const query = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.keywords?.some((keyword) => keyword.toLowerCase().includes(query))
    )
  })

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  const handleSelect = (item: SearchItem) => {
    navigate(item.path)
    onOpenChange(false)
    setSearchQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault()
      handleSelect(filteredItems[selectedIndex])
    } else if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, SearchItem[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center border-b px-4">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            type="text"
            placeholder="Search pages, features, and content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-base"
            autoFocus
          />
        </div>
        <DialogDescription className="sr-only">
          Search for pages and features in the dashboard
        </DialogDescription>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SearchIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for "dashboard", "news", "products", or "users"
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    {category}
                  </div>
                  {items.map((item, index) => {
                    const globalIndex = filteredItems.indexOf(item)
                    const Icon = item.icon
                    const isSelected = globalIndex === selectedIndex
                    const isCurrentPage = location.pathname === item.path

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50",
                          isCurrentPage && "bg-accent border border-border"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 text-left">
                          <div className="font-medium flex items-center gap-2">
                            {item.title}
                            {isCurrentPage && (
                              <span className="text-xs text-primary">(Current)</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                        {isSelected && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                Enter
              </kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              Esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

