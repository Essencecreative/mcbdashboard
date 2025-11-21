"use client"

import React, { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useAuth } from "../auth-context"
import { useNavigate } from "react-router"
import { login as loginAPI } from "../api/auth"
import { toast } from "../hooks/use-toast"
import { useLanguage } from "../contexts/language-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await loginAPI(formData)
      
      if (response.token) {
        login(response.token)
        navigate("/")
      } else {
        toast({
          title: t("login.failed"),
          description: response.message || t("login.failed"),
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Login error:", err)
      toast({
        title: t("login.error"),
        description: err.message || t("login.error"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Image and copy */}
        <div className="relative flex w-full items-center justify-center bg-slate-900 p-10 text-white md:w-1/2">
          <div className="z-10 max-w-md text-center">
            <h1 className="mb-6 text-4xl font-bold">{t("login.welcomeBack")}</h1>
            <p className="mb-8 text-lg">
Mwalimu Commercial Bank
            </p>
            <div className="text-sm opacity-75">2025 ©️ All rights Reserved. Designed by: Essence Creative</div>
          </div>
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://res.cloudinary.com/dedfrilse/image/upload/v1762705967/IMG_0060_e457qo.jpg"
              alt="Background pattern"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex w-full items-center justify-center bg-background p-10 md:w-1/2">
          <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="space-y-4 flex flex-col items-center">
  <img
    src="https://res.cloudinary.com/dedfrilse/image/upload/v1762706180/MCB-LOGO_b4bcyu.svg"
    alt="Logo"
    className="h-20 w-100 object-contain"
  />
  <CardTitle className="text-2xl font-bold text-center">{t("login.title")}</CardTitle>
  <CardDescription className="text-center">
    {t("login.enterCredentials")}
  </CardDescription>
</CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t("login.username")}</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder={t("login.enterUsername")}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.enterPassword")}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                {/* <div className="text-sm">
                  <a href="#" className="text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div> */}
              </CardContent>
              <CardFooter className="flex flex-col">
              <Button
  type="submit"
  className="w-full bg-[#024F28] hover:bg-[#02391f] text-white"
  style={{
    background: "linear-gradient(0deg, #0a3b73, #0e519a)"
  }}
  disabled={isLoading}
>
  {isLoading ? t("login.signingIn") : t("login.signIn")}
</Button>
                {/* <p className="mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-primary hover:underline">
                    Sign up
                  </a>
                </p> */}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
