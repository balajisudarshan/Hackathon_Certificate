import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/AuthContext';
export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const {login} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password
            });
            console.log(email + " " + password)
             toast.success("Login Successful")

            console.log(res.data)
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("Name",res.data.name)
            login(res.data)
        } catch (error) {
            console.log(error.response.data)
            toast.error("Login Failed: " + (error.response?.data || error.message));

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center ">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to sign in
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="pr-10 "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2  hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-blue-500" onClick={handleLogin} disabled={loading}>
                            {loading ?<Spinner/>:"Sign in"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">

                        </div>
                    </div>


                </CardContent>

                <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                    <p>
                        Don&apos;t have an account?{" "}
                        <a
                            href="/signup"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}