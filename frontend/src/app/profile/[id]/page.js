"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";
import LeftSidebar from "@/components/component/LeftSideBar/LeftSideBar";
import { useParams } from "next/navigation";
import { fetchUserProfile } from "@/service/user.service";

const ProfilePage = () => {
  // Renamed component to follow React naming conventions
  const params = useParams();
  const id = params?.id; // Ensure id is defined before using it

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id || profileData?._id === id) return; 
  
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const result = await fetchUserProfile(id);
        setProfileData(result?.profile || null);
        setIsOwner(result?.isOwner || false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchProfile();
  }, [id]);

  return (
    <div className="flex">
      <div>
        <LeftSidebar />
      </div>
      <div className="lg:ml-64 w-full flex-grow">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <ProfileHeader
              profileData={profileData}
              setProfileData={setProfileData}
              isOwner={isOwner}
              id={id}
              fetchProfile={fetchUserProfile}
            />
            <ProfileTabs
              profileData={profileData}
              setProfileData={setProfileData}
              isOwner={isOwner}
              id={id}
              fetchProfile={fetchUserProfile}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; // Renamed for better readability
