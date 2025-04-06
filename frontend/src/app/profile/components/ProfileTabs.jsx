"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useState } from "react";
import ProfileDetails from "./ProfileDetails";

const ProfileTabs = ({ id, profileData, isOwner, setProfileData,fetchProfile }) => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <ProfileDetails
            activeTab="posts"
            id={id}
            profileData={profileData}
            isOwner={isOwner}
            setProfileData={setProfileData}
            fetchProfile={fetchProfile}

          />
        </TabsContent>
        <TabsContent value="about">
          <ProfileDetails
            activeTab="about"
            id={id}
            profileData={profileData}
            isOwner={isOwner}
            setProfileData={setProfileData}
            fetchProfile={fetchProfile}

          />
        </TabsContent>
        <TabsContent value="friends">
          <ProfileDetails
            activeTab="friends"
            id={id}
            profileData={profileData}
            isOwner={isOwner}
            setProfileData={setProfileData}
            fetchProfile={fetchProfile}

          />
        </TabsContent>
        <TabsContent value="photos">
          <ProfileDetails
            activeTab="photos"
            id={id}
            profileData={profileData}
            isOwner={isOwner}
            setProfileData={setProfileData}
            fetchProfile={fetchProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
