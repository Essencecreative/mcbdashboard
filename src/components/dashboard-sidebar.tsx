"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router"
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ImageIcon,
  Layers,
  LayoutDashboard,

  LifeBuoy,
  NewspaperIcon,
  RadioIcon,
  Settings,
  TrendingUp,
  Users,
  Megaphone,
  MapPin,
  Menu,
  FileText,
  HelpCircle,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "./ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useLanguage } from "../contexts/language-context"

export default function DashboardSidebar() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const [openMenus, setOpenMenus] = useState<string[]>(["investors", "news-events", "team-members", "menu-management"])

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    )
  }

  const isMenuOpen = (menuId: string) => openMenus.includes(menuId)

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true
    if (path !== "/dashboard" && pathname.includes(path)) return true
    return false
  }

  const TruncatedMenuItem = ({
    text,
    isActive,
    onClick,
  }: {
    text: string
    isActive?: boolean
    onClick?: () => void
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuSubButton
            isActive={isActive}
            onClick={onClick}
            className="truncate pr-2 text-xs text-white hover:text-white/90"
          >
            {text}
          </SidebarMenuSubButton>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-background text-foreground">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <Sidebar
      className="w-64 shrink-0"
      style={{
        background: "linear-gradient(0deg, #0a3b73, #0e519a)",
        borderRight: "none",
      }}
    >
      <SidebarHeader className="border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dedfrilse/image/upload/v1762693722/logo-1_vpkruk.svg"
            alt="Logo"
            className="h-15 w-40 object-contain mb-4 mt-4"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="text-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <Link to="/">
                  <SidebarMenuButton
                    isActive={isActive("/")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20 data-[active=true]:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 text-white" />
                    <span>{t("nav.dashboard")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
                <SidebarMenuItem>
                <Link to="/products">
                  <SidebarMenuButton
                    isActive={isActive("/products")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20 data-[active=true]:text-white"
                  >
                    <ImageIcon className="h-4 w-4 text-white" />
                    <span>{t("sidebar.productsCarousel")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
                <SidebarMenuItem>
                <Link to="/news-and-updates">
                  <SidebarMenuButton
                    isActive={isActive("/news-and-updates")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20 data-[active=true]:text-white"
                  >
                    <BookOpen className="h-4 w-4 text-white" />
                    <span>{t("nav.news")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Investors */}
              <Collapsible
                className="w-full"
                open={isMenuOpen("investors")}
                onOpenChange={() => toggleMenu("investors")}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton
                      isActive={isActive("/investors")}
                      className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                    >
                      <TrendingUp className="h-4 w-4 text-white" />
                      <span>{t("nav.investors")}</span>
                      <ChevronDown
                        className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 text-white ${
                          isMenuOpen("investors") ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link to="/investorsnews">
                        <TruncatedMenuItem text={t("investors.title")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/investors?category=agm">
                        <TruncatedMenuItem text={t("sidebar.annualGeneralMeeting")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/investors?category=financial-reports">
                        <TruncatedMenuItem text={t("sidebar.financialReports")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/investors?category=tariff-guide">
                        <TruncatedMenuItem text={t("sidebar.tariffGuide")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/investors?category=shareholding">
                        <TruncatedMenuItem text={t("sidebar.shareholdingStructure")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/investors?category=share-price">
                        <TruncatedMenuItem text={t("sidebar.sharePrice")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/investors?category=contact">
                        <TruncatedMenuItem text={t("sidebar.investorRelationsContact")} />
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>


              {/* Opportunities */}
              <Collapsible
                className="w-full"
                open={isMenuOpen("opportunities")}
                onOpenChange={() => toggleMenu("opportunities")}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton
                      isActive={isActive("/opportunities")}
                      className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                    >
                      <Briefcase className="h-4 w-4 text-white" />
                      <span>{t("nav.opportunities")}</span>
                      <ChevronDown
                        className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 text-white ${
                          isMenuOpen("opportunities") ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link to="/opportunities?category=job-vacancies">
                        <SidebarMenuSubButton className="flex items-center gap-1.5 text-white hover:bg-background/10">
                          <NewspaperIcon className="h-3.5 w-3.5 text-gray-300" />
                          {t("sidebar.jobVacancies")}
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              {/* Team Members */}
              <Collapsible
                className="w-full"
                open={isMenuOpen("team-members")}
                onOpenChange={() => toggleMenu("team-members")}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton
                      isActive={isActive("/board-of-directors") || isActive("/management")}
                      className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                    >
                      <Users className="h-4 w-4 text-white" />
                      <span>{t("sidebar.teamMembers")}</span>
                      <ChevronDown
                        className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 text-white ${
                          isMenuOpen("team-members") ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link to="/board-of-directors">
                        <TruncatedMenuItem text={t("team.boardMembers")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/management">
                        <TruncatedMenuItem text={t("team.management")} />
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              {/* User Management */}
              <SidebarMenuItem>
                <Link to="/users">
                  <SidebarMenuButton
                    isActive={isActive("/users")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                  >
                    <Users className="h-4 w-4 text-white" />
                    <span>{t("sidebar.userManagement")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Carousel */}
              <SidebarMenuItem>
                <Link to="/carousel">
                  <SidebarMenuButton
                    isActive={isActive("/carousel")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                  >
                    <Layers className="h-4 w-4 text-white" />
                    <span>{t("sidebar.homeCarousel")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Header Update */}
              <SidebarMenuItem>
                <Link to="/header-update">
                  <SidebarMenuButton
                    isActive={isActive("/header-update")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                  >
                    <Megaphone className="h-4 w-4 text-white" />
                    <span>{t("header.updates")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Wakala Locations */}
              <SidebarMenuItem>
                <Link to="/wakala">
                  <SidebarMenuButton
                    isActive={isActive("/wakala")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                  >
                    <MapPin className="h-4 w-4 text-white" />
                    <span>{t("wakala.title")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* FAQs */}
              <SidebarMenuItem>
                <Link to="/faqs">
                  <SidebarMenuButton
                    isActive={isActive("/faqs")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                  >
                    <HelpCircle className="h-4 w-4 text-white" />
                    <span>{t("faq.title")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Menu Management */}
              <Collapsible
                className="w-full"
                open={isMenuOpen("menu-management")}
                onOpenChange={() => toggleMenu("menu-management")}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton
                      isActive={isActive("/menu-categories") || isActive("/menu-items")}
                      className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                    >
                      <Menu className="h-4 w-4 text-white" />
                      <span>{t("sidebar.menuManagement")}</span>
                      <ChevronDown
                        className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 text-white ${
                          isMenuOpen("menu-management") ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link to="/menu-categories">
                        <TruncatedMenuItem text={t("menu.categories")} />
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link to="/menu-items">
                        <TruncatedMenuItem text={t("menu.items")} />
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 text-xs font-medium">
            {t("nav.settings")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/settings">
                  <SidebarMenuButton
                    isActive={isActive("/settings")}
                    className="text-white hover:bg-background/10 data-[active=true]:bg-background/20"
                  >
                    <Settings className="h-4 w-4 text-white" />
                    <span>{t("nav.settings")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-white hover:bg-background/10">
              <LifeBuoy className="h-4 w-4 text-white" />
              <span>{t("sidebar.helpSupport")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}