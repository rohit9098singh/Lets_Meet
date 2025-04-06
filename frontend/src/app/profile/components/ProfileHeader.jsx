"use client";
import { Button } from "@/components/ui/button";
import { Camera, PenLine, Save, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchUserProfile,
  updateUserCoverPhoto,
  updateUserProfile,
} from "@/service/user.service";
import userStore from "@/store/userStore";
import { useForm } from "react-hook-form";

const ProfileHeader = ({ id, profileData, isOwner, setProfileData }) => {
  const [isEditProfileModal, setIsEditProfileModal] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isEditCoverModal, setIsEditCoverModal] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const profileImageInputRef = useRef();
  const coverImageInputRef = useRef();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      username: profileData?.username,
      dateOfBirth: profileData?.dateOfBirth
        ? profileData.dateOfBirth.split("T")[0]
        : "",
      gender: profileData?.gender,
    },
  });

  // console.log("getting the id",id)

  const { setUser } = userStore();
  // console.log("lets see", profileData);

  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      const updatedProfile = await updateUserProfile(id, formData);
      setProfileData({ ...profileData, ...updatedProfile });
      setIsEditProfileModal(false);
      setProfilePicturePreview(null);
      setUser(updatedProfile);
      await fetchUserProfile();
    } catch (error) {
      console.error("Error updating the user profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const onSubmitCoverPhoto = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      if (coverPhotoFile) {
        formData.append("coverPhoto", coverPhotoFile);
      }

      const updatedProfile = await updateUserCoverPhoto(id, formData);
      setProfileData({ ...profileData,coverPhoto:updatedProfile.coverPhoto });
      setIsEditCoverModal(false);
      setCoverPhotoFile(null);
      setCoverPhotoPreview(false);
      // setUser(updatedProfile);
      // await fetchUserProfile();
    } catch (error) {
      console.error("Error updating the user cover photo", error);
    } finally {
      setLoading(false);
    }
  };

  const handlecoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="relative">
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden">
        <img
          src={profileData?.coverPhoto}
          alt="cover_photo"
          className="w-full h-full object-cover"
        />
        {isOwner && (
          <Button
            variant="secondary"
            size="sm"
            className="cursor-pointer absolute bottom-4 right-4 flex items-center z-50 hover:bg-gray-500 "
            onClick={() => setIsEditCoverModal(!isEditCoverModal)}
          >
            <Camera className="mr-0 md:mr-2 h-4 w-4" />
            <span className="hidden md:block">Edit Cover Photo</span>
          </Button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-5">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700">
            <AvatarImage
              src={profileData?.profilePicture}
              alt={profileData?.username}
            />
            <AvatarFallback>
              {profileData?.username
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 md:mt-0 text-center md:text-left flex-grow">
            <h1 className="text-2xl font-bold">{profileData?.username}</h1>
            <p className="text-gray-400 font-semibold">
              {profileData?.followerCount}
            </p>
          </div>
          {isOwner && (
            <Button
              onClick={() => setIsEditProfileModal(true)}
              className="mt-4 md:mt-0 cursor-pointer"
            >
              <PenLine size={18} />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isEditProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="dark:bg-gray-800 bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Edit Profile
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditProfileModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmitProfile)}
                className="space-y-4"
              >
                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="w-24 h-24 mb-2 border-4 border-white dark:border-gray-700">
                    <AvatarImage
                      src={profilePicturePreview || profileData?.profilePicture}
                    />
                    <AvatarFallback>
                      {profileData?.username
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="images/*"
                    className="hidden"
                    ref={profileImageInputRef}
                    onChange={handleProfilePictureChange}
                    onClick={(e) => (e.target.value = null)}
                  />
                  <Button
                    onClick={() => profileImageInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Change Profile Picture</span>
                  </Button>
                </div>

                {/* Username Field */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} />
                </div>

                {/* Date of Birth Field */}
                <div>
                  <Label htmlFor="dateofbirth">Date of Birth </Label>
                  <Input
                    id="dateofbirth"
                    type="date"
                    {...register("dateOfBirth")}
                  />
                </div>

                {/* Gender Selection */}
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(value) => setValue("gender", value)}
                    defaultValue={profileData?.gender}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/**edit cover modal */}
      <AnimatePresence>
        {isEditCoverModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="dark:bg-gray-800 bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Edit Cover Photo
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditCoverModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Form */}
              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmitCoverPhoto)}
              >
                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-4">
                  {coverPhotoPreview && (
                    <img
                      src={coverPhotoPreview}
                      alt="cover-photo"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}

                  <input
                    ref={coverImageInputRef}
                    onChange={handlecoverPhotoChange}
                    type="file"
                    accept="images/*"
                    className="hidden"
                    onClick={(e) => (e.target.value = null)}
                  />
                  <Button
                    onClick={() => coverImageInputRef.current.click()}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Select New Cover photo</span>
                  </Button>
                </div>

                <Button
                  disabled={!coverPhotoFile}
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white"
                  onClick={onSubmitCoverPhoto} // Ensure this is not commented out
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{loading ? "Saving..." : "Save Cover Photo"}</span>
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileHeader;
