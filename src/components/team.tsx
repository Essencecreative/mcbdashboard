import DashboardLayout from "./dashboard-layout"
import TeamMembersTable from "./team-table"

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Our team of management professionals and subject matter experts.</p>
        </div>

        <TeamMembersTable />
      </div>
    </DashboardLayout>
  )
}
