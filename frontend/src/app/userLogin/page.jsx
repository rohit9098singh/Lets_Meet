"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { GoogleSVG } from "../../../utils";
import { registerSchema, loginSchema } from "./validation/schema";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, registerUser } from "@/service/auth.service"; // Assuming login service is here

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      gender: "male",
    },
    resolver: zodResolver(registerSchema),
  });

  const handleSignup = async (data) => {
    console.log("signup data over here", data);

    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.status === "success") {
        toast.success("User Registered Successfully");
        router.push("/");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Check your credentials properly.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data) => {
    console.log("login data", data);

    setIsLoading(true);
    try {
      const result = await loginUser(data);
      if (result.status === "success") {
        toast.success("User logged in Successfully");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Email or Password wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
  };
  const onClick = (data) => {
    console.log(data);
  };
  console.log(isLoading);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Let_Meet
            </CardTitle>
            <CardDescription className="text-center">
              Connect with friends and the world around you on Let's Meet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Signup</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-4"
                  >
                    {/* ... (Login form fields) */}
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className="dark:text-white dark:bg-gray-700"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="dark:text-white dark:bg-gray-700"
                                placeholder="password"
                                {...field}
                              />
                              {showPassword ? (
                                <EyeOff
                                  size={18}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                />
                              ) : (
                                <Eye
                                  size={18}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 mt-2 bg-gray-300 dark:bg-gray-400 dark:hover:bg-gray-500 hover:bg-gray-400"
                    onClick={handleGoogleLogin}
                  >
                    <GoogleSVG /> Continue with Google
                  </Button>
                </Form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <div className="space-y-4">
                    {/* ... (Signup form fields) */}
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              className="dark:text-white dark:bg-gray-700 text-sm"
                              type="text"
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              className="dark:text-white dark:bg-gray-700 text-sm"
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="dark:text-white dark:bg-gray-700"
                                placeholder="password"
                                {...field}
                              />
                              {showPassword ? (
                                <EyeOff
                                  size={18}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                />
                              ) : (
                                <Eye
                                  size={18}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl className="text-sm">
                            <select
                              {...field}
                              className="w-full p-2 border rounded-md text-black font-semibold"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="female">Others</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      className="w-full"
                      onClick={signupForm.handleSubmit(handleSignup)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing up..." : "Signup"}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 mt-2 bg-gray-300 dark:bg-gray-400 dark:hover:bg-gray-500 hover:bg-gray-400"
                    onClick={handleGoogleLogin}
                  >
                    <GoogleSVG /> Continue with Google
                  </Button>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;
