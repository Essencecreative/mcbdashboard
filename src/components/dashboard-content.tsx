import { useEffect, useState } from "react"
import DashboardLayout from "./dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs"
import { useAuth } from "../auth-context"
import { apiRequest } from "../api/client"
import { useLanguage } from "../contexts/language-context"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts"
import {
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
  User,
  BarChart3,
} from "lucide-react"

export default function DashboardContent() {
  const { token } = useAuth()
  const { t } = useLanguage()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiRequest("/stats/summary")
        setData(result)
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchData()
  }, [token])

  // Metric categories with icons and colors
  const metricConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
    "News & Updates": { icon: Newspaper, color: "text-blue-600", bgColor: "bg-blue-50" },
    "Investor News": { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
    "Opportunities": { icon: Briefcase, color: "text-purple-600", bgColor: "bg-purple-50" },
    "Products": { icon: Package, color: "text-orange-600", bgColor: "bg-orange-50" },
    "Carousel Items": { icon: Image, color: "text-pink-600", bgColor: "bg-pink-50" },
    "Board Members": { icon: Users, color: "text-indigo-600", bgColor: "bg-indigo-50" },
    "Management": { icon: Users, color: "text-cyan-600", bgColor: "bg-cyan-50" },
    "Menu Items": { icon: Menu, color: "text-amber-600", bgColor: "bg-amber-50" },
    "Investor Categories": { icon: FolderTree, color: "text-teal-600", bgColor: "bg-teal-50" },
    "Menu Categories": { icon: FolderTree, color: "text-muted-foreground", bgColor: "bg-muted" },
    "Header Updates": { icon: Settings, color: "text-muted-foreground", bgColor: "bg-muted" },
    "Exchange Rates": { icon: DollarSign, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    "Total Users": { icon: User, color: "text-red-600", bgColor: "bg-red-50" },
  }

  const renderMetric = (label: any, total: any, monthly: any, isCompact: boolean = false) => {
    const config = metricConfig[label] || { icon: BarChart3, color: "text-muted-foreground", bgColor: "bg-muted" }
    const Icon = config.icon

    if (isCompact) {
      return (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${config.bgColor}`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">
                +{loading ? "..." : monthly} {t("metrics.thisMonth")}
              </p>
            </div>
          </div>
          <div className="text-lg font-bold">
            {loading ? "..." : total}
          </div>
        </div>
      )
    }

    return (
      <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <div className={`p-2 rounded-md ${config.bgColor}`}>
            <Icon className={`h-4 w-4 ${config.color}`} />
          </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "..." : total}
        </div>
          <p className="text-xs text-muted-foreground mt-1">
            +{loading ? "..." : monthly} {t("metrics.thisMonth")}
        </p>
      </CardContent>
    </Card>
  )
  }

  const renderChart = (trendData: any[] | undefined, label: string) => {
    if (loading || !trendData) {
      return <div className="h-[200px] flex items-center justify-center text-muted-foreground">{t("common.loading")}...</div>
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} name={label} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Main Metrics - Key Content Metrics */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t("dashboard.contentOverview")}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderMetric("News & Updates", data?.newsAndUpdates?.total, data?.newsAndUpdates?.thisMonth)}
          {renderMetric("Investor News", data?.investorNews?.total, data?.investorNews?.thisMonth)}
          {renderMetric("Opportunities", data?.opportunities?.total, data?.opportunities?.thisMonth)}
          {renderMetric("Products", data?.products?.total, data?.products?.thisMonth)}
        </div>
        </div>

        {/* Secondary Metrics - Organized in a compact grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Team & Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("dashboard.teamManagement")}</CardTitle>
              <CardDescription>{t("dashboard.leadershipTeam")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderMetric("Board Members", data?.boardMembers?.total, data?.boardMembers?.thisMonth, true)}
              {renderMetric("Management", data?.management?.total, data?.management?.thisMonth, true)}
              {renderMetric("Total Users", data?.users?.total, data?.users?.thisMonth, true)}
            </CardContent>
          </Card>

          {/* Content Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("dashboard.contentManagement")}</CardTitle>
              <CardDescription>{t("dashboard.websiteContent")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderMetric("Carousel Items", data?.carousels?.total, data?.carousels?.thisMonth, true)}
              {renderMetric("Menu Items", data?.menuItems?.total, data?.menuItems?.thisMonth, true)}
              {renderMetric("Menu Categories", data?.menuCategories?.total, data?.menuCategories?.thisMonth, true)}
              {renderMetric("Header Updates", data?.headerUpdates?.total, data?.headerUpdates?.thisMonth, true)}
            </CardContent>
          </Card>

          {/* Categories & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("dashboard.categoriesSettings")}</CardTitle>
              <CardDescription>{t("dashboard.organization")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderMetric("Investor Categories", data?.investorCategories?.total, data?.investorCategories?.thisMonth, true)}
              {renderMetric("Exchange Rates", data?.foreignExchange?.total, data?.foreignExchange?.thisMonth, true)}
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="newsAndUpdates" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="newsAndUpdates">{t("charts.newsUpdates")}</TabsTrigger>
            <TabsTrigger value="investorNews">{t("charts.investorNews")}</TabsTrigger>
            <TabsTrigger value="opportunities">{t("charts.opportunities")}</TabsTrigger>
            <TabsTrigger value="products">{t("charts.products")}</TabsTrigger>
            <TabsTrigger value="carousels">{t("charts.carousels")}</TabsTrigger>
            <TabsTrigger value="menuItems">{t("charts.menuItems")}</TabsTrigger>
          </TabsList>

          <TabsContent value="newsAndUpdates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.newsUpdatesTrends")}</CardTitle>
                <CardDescription>{t("charts.newsUpdatesDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.newsAndUpdates?.trends, t("charts.newsUpdates"))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investorNews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.investorNewsTrends")}</CardTitle>
                <CardDescription>{t("charts.investorNewsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.investorNews?.trends, t("charts.investorNews"))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.opportunitiesTrends")}</CardTitle>
                <CardDescription>{t("charts.opportunitiesDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.opportunities?.trends, t("charts.opportunities"))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.productsTrends")}</CardTitle>
                <CardDescription>{t("charts.productsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.products?.trends, t("charts.products"))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carousels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.carouselsTrends")}</CardTitle>
                <CardDescription>{t("charts.carouselsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.carousels?.trends, t("charts.carousels"))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menuItems" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.menuItemsTrends")}</CardTitle>
                <CardDescription>{t("charts.menuItemsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.menuItems?.trends, t("charts.menuItems"))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
