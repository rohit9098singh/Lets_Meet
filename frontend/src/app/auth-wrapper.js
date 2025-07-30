"use client";
import Header from "@/components/component/Header/Header";
import Loader from "@/lib/Loader";
import { checkUserAuth, logoutUser, setAuthToken } from "@/service/auth.service";
import userStore from "@/store/userStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

// Separate component that uses useSearchParams
function AuthWrapperContent({ children }) {
  const { setUser, clearUser } = userStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === "/userLogin";
  const is404Page = pathname === "/404" || pathname === "/_not-found";

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
    // Skip authentication check for 404 pages and login page
    if (is404Page || isLoginPage) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [isLoginPage, is404Page, checkAuth]);

  // 🔹 Loader Handling (Simplified)
  if (loading || (!isAuthenticated && !isLoginPage && !is404Page)) return <Loader />;

  // For 404 pages, just render children without header
  if (is404Page) {
    return <>{children}</>;
  }

  return (
    <>
      {!isLoginPage && isAuthenticated && <Header />}
      {children}
    </>
  );
}

// Main component with Suspense boundary
export default function AuthWrapper({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      <AuthWrapperContent>{children}</AuthWrapperContent>
    </Suspense>
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