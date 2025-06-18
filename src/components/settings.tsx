import { useState } from "react"
import { Moon, Sun, Bell, RefreshCw, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import DashboardLayout from "./dashboard-layout"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoUpdates, setAutoUpdates] = useState(false)
  const [language, setLanguage] = useState("en")

  return (
   <DashboardLayout>
     <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Dark Mode</Label>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Email Notifications</Label>
          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </CardContent>
      </Card>

      {/* Auto Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            System
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Enable Auto Updates</Label>
          <Switch checked={autoUpdates} onCheckedChange={setAutoUpdates} />
        </CardContent>
      </Card>

      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
   </DashboardLayout>
  )
}
