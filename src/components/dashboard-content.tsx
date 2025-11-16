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
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts"

export default function DashboardContent() {
  const { token } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/stats/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const result = await res.json()
        setData(result)
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchData()
  }, [token])

  const renderMetric = (label: any, total: any, monthly: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "..." : total}
        </div>
        <p className="text-xs text-muted-foreground">
          +{loading ? "..." : monthly} this month
        </p>
      </CardContent>
    </Card>
  )

  const renderChart = (trendData: any[] | undefined, label: string) => {
    if (loading || !trendData) {
      return <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
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
        {/* Main Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderMetric("News & Updates", data?.newsAndUpdates?.total, data?.newsAndUpdates?.thisMonth)}
          {renderMetric("Investor News", data?.investorNews?.total, data?.investorNews?.thisMonth)}
          {renderMetric("Opportunities", data?.opportunities?.total, data?.opportunities?.thisMonth)}
          {renderMetric("Products", data?.products?.total, data?.products?.thisMonth)}
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderMetric("Carousel Items", data?.carousels?.total, data?.carousels?.thisMonth)}
          {renderMetric("Board Members", data?.boardMembers?.total, data?.boardMembers?.thisMonth)}
          {renderMetric("Management", data?.management?.total, data?.management?.thisMonth)}
          {renderMetric("Menu Items", data?.menuItems?.total, data?.menuItems?.thisMonth)}
        </div>

        {/* Additional Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderMetric("Investor Categories", data?.investorCategories?.total, data?.investorCategories?.thisMonth)}
          {renderMetric("Menu Categories", data?.menuCategories?.total, data?.menuCategories?.thisMonth)}
          {renderMetric("Header Updates", data?.headerUpdates?.total, data?.headerUpdates?.thisMonth)}
          {renderMetric("Exchange Rates", data?.foreignExchange?.total, data?.foreignExchange?.thisMonth)}
        </div>

        {/* User Metric */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderMetric("Total Users", data?.users?.total, data?.users?.thisMonth)}
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="newsAndUpdates" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="newsAndUpdates">News & Updates</TabsTrigger>
            <TabsTrigger value="investorNews">Investor News</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="carousels">Carousels</TabsTrigger>
            <TabsTrigger value="menuItems">Menu Items</TabsTrigger>
          </TabsList>

          <TabsContent value="newsAndUpdates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>News & Updates Trends</CardTitle>
                <CardDescription>Monthly growth of news and updates content.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.newsAndUpdates?.trends, "News & Updates")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investorNews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Investor News Trends</CardTitle>
                <CardDescription>Monthly growth of investor news content.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.investorNews?.trends, "Investor News")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Opportunities Trends</CardTitle>
                <CardDescription>Monthly growth of job opportunities and listings.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.opportunities?.trends, "Opportunities")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Products Trends</CardTitle>
                <CardDescription>Monthly growth of banking products and services.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.products?.trends, "Products")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carousels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Carousel Items Trends</CardTitle>
                <CardDescription>Monthly growth of carousel banner items.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.carousels?.trends, "Carousels")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menuItems" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items Trends</CardTitle>
                <CardDescription>Monthly growth of dynamic menu items.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart(data?.menuItems?.trends, "Menu Items")}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
