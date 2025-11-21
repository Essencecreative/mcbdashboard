import { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  Bell,
  Database,
  Download,
  Upload,
  Shield,
  Server,
  Settings as SettingsIcon,
  Trash2,
  Save,
  Info,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import DashboardLayout from "./dashboard-layout"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../auth-context"
import { useTheme } from "../contexts/theme-context"
import { useLanguage } from "../contexts/language-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState("10")
  const [sessionTimeout, setSessionTimeout] = useState("60")
  const [maxFileSize, setMaxFileSize] = useState("10")
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("dashboardSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.emailNotifications !== undefined) setEmailNotifications(settings.emailNotifications)
        if (settings.language) setLanguage(settings.language)
        if (settings.itemsPerPage) setItemsPerPage(settings.itemsPerPage)
        if (settings.sessionTimeout) setSessionTimeout(settings.sessionTimeout)
        if (settings.maxFileSize) setMaxFileSize(settings.maxFileSize)
        if (settings.apiUrl) setApiUrl(settings.apiUrl)
        if (settings.maintenanceMode !== undefined) setMaintenanceMode(settings.maintenanceMode)
        if (settings.debugMode !== undefined) setDebugMode(settings.debugMode)
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }
  }, [])

  const handleSave = () => {
    // Save settings to localStorage
    const settings = {
      emailNotifications,
      language,
      itemsPerPage,
      sessionTimeout,
      maxFileSize,
      apiUrl,
      maintenanceMode,
      debugMode,
    }
    localStorage.setItem("dashboardSettings", JSON.stringify(settings))
    toast({
      title: t("settings.saved"),
      description: t("settings.savedDesc"),
    })
  }

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
    toast({
      title: checked ? t("settings.darkMode") + " " + t("common.success") : t("settings.darkMode") + " " + t("common.success"),
      description: t("settings.savedDesc"),
    })
  }

  const handleClearCache = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("dashboardSettings")
    toast({
      title: t("settings.clearCache"),
      description: t("settings.savedDesc"),
    })
    window.location.reload()
  }

  const handleExportData = () => {
    toast({
      title: t("settings.exportData"),
      description: t("common.loading"),
    })
  }

  const handleImportData = () => {
    toast({
      title: t("settings.importData"),
      description: t("common.loading"),
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
            <p className="text-muted-foreground">{t("settings.description")}</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {t("settings.saveChanges")}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {t("settings.appearance")}
              </CardTitle>
              <CardDescription>{t("settings.customizeLook")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.darkMode")}</Label>
                  <p className="text-xs text-muted-foreground">{t("settings.switchDarkTheme")}</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={handleThemeChange} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("settings.language")}</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "sw")}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("settings.language")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Kiswahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* General Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                {t("settings.generalPreferences")}
              </CardTitle>
              <CardDescription>{t("settings.configureBehavior")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.itemsPerPage")}</Label>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 items</SelectItem>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("settings.sessionTimeout")}</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {t("settings.notifications")}
              </CardTitle>
              <CardDescription>{t("settings.manageNotifications")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.emailNotifications")}</Label>
                  <p className="text-xs text-muted-foreground">{t("settings.receiveEmailAlerts")}</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.browserNotifications")}</Label>
                  <p className="text-xs text-muted-foreground">{t("settings.showBrowserNotifications")}</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t("settings.security")}
              </CardTitle>
              <CardDescription>{t("settings.configureSecurity")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.twoFactorAuth")}</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{t("settings.addExtraSecurity")}</p>
                  <Switch defaultChecked={false} />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("settings.passwordRequirements")}</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• {t("settings.minCharacters")}</p>
                  <p>• {t("settings.uppercaseLetter")}</p>
                  <p>• {t("settings.oneNumber")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {t("settings.fileUpload")}
              </CardTitle>
              <CardDescription>{t("settings.configureFileUpload")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.maxFileSize")}</Label>
                <Select value={maxFileSize} onValueChange={setMaxFileSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 MB</SelectItem>
                    <SelectItem value="10">10 MB</SelectItem>
                    <SelectItem value="25">25 MB</SelectItem>
                    <SelectItem value="50">50 MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("settings.allowedFileTypes")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.images")}
                  <br />
                  {t("settings.documents")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                {t("settings.apiConfig")}
              </CardTitle>
              <CardDescription>{t("settings.backendApi")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.apiBaseUrl")}</Label>
                <Input
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:5000"
                />
                <p className="text-xs text-muted-foreground">
                  Current: {process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                {t("settings.dataManagement")}
              </CardTitle>
              <CardDescription>{t("settings.exportImport")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportData} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  {t("settings.exportData")}
                </Button>
                <Button variant="outline" onClick={handleImportData} className="flex-1 gap-2">
                  <Upload className="h-4 w-4" />
                  {t("settings.importData")}
                </Button>
              </div>
              <Separator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full gap-2">
                    <Trash2 className="h-4 w-4" />
                    {t("settings.clearCache")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("settings.clearCache")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("settings.clearCacheDesc")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearCache}>{t("settings.clearCache")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                {t("settings.systemInfo")}
              </CardTitle>
              <CardDescription>{t("settings.versionDetails")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("settings.version")}</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("settings.userRole")}</span>
                <span className="font-medium">{user?.role || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("settings.lastUpdated")}</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t("settings.advanced")}
              </CardTitle>
              <CardDescription>{t("settings.advancedOptions")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.maintenanceMode")}</Label>
                  <p className="text-xs text-muted-foreground">{t("settings.putInMaintenance")}</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.debugMode")}</Label>
                  <p className="text-xs text-muted-foreground">{t("settings.enableDebugLogging")}</p>
                </div>
                <Switch checked={debugMode} onCheckedChange={setDebugMode} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
