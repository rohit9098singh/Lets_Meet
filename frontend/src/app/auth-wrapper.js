"use client";
import Header from "@/components/component/Header/Header";
import Loader from "@/lib/Loader";
import { checkUserAuth, logoutUser, setAuthToken } from "@/service/auth.service";
import userStore from "@/store/userStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function AuthWrapper({ children }) {
  const { setUser, clearUser } = userStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === "/userLogin";

  // Handle Google OAuth token from URL parameters
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAuthToken(token);
      // Remove token from URL
      const newUrl = pathname;
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  // 🔹 Handle Logout (Moved Outside for Better Structure)
  const handleLogout = useCallback(async () => {
    clearUser();
    setIsAuthenticated(false);
    try {
      await logoutUser();
    } catch (error) {
      console.log("Logout failed, please try again later.");
    }
    if (!isLoginPage) router.push("/userLogin");
  }, [clearUser, isLoginPage, router]);

  // 🔹 Check Authentication
  const checkAuth = useCallback(async () => {
    try {
      const result = await checkUserAuth();
      if (result?.isAuthenticated) {
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        await handleLogout();
      }
    } catch (error) {
      console.log("Authentication failed", error);
      await handleLogout();
    } finally {
      setLoading(false);
    }
  }, [setUser, handleLogout]);

  useEffect(() => {
    if (!isLoginPage) checkAuth();
    else setLoading(false);
  }, [isLoginPage, checkAuth]);

  // 🔹 Loader Handling (Simplified)
  if (loading || (!isAuthenticated && !isLoginPage)) return <Loader />;

  return (
    <>
      {!isLoginPage && isAuthenticated && <Header />}
      {children}
    </>
  );
}



// {isOwner && (
//   <Button
//     className="w-full"
//     onClick={() => setIsEditBioModal(!isEditBioModal)}
//   >
//     Edit Bio
//   </Button>
// )}