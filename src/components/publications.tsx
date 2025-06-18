import DashboardLayout from "./dashboard-layout"
import PublicationsTable from "./publication-table"

export default function PublicationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
          <p className="text-muted-foreground">
            Browse and download official reports, guidelines, and other publications.
          </p>
        </div>

        <PublicationsTable />
      </div>
    </DashboardLayout>
  )
}
