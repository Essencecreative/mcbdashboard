import DashboardLayout from "./dashboard-layout"
import NewsEventsTable from "./news-events-table"

export default function NewsEventsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News & Events</h1>
          <p className="text-muted-foreground">Browse the latest news, events, radio programs, and photo galleries.</p>
        </div>

        <NewsEventsTable />
      </div>
    </DashboardLayout>
  )
}
