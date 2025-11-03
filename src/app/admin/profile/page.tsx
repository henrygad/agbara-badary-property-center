"use client";

import { useUserStore } from "@/store/useUserStore";
import ReturnBack from "@/components/ReturnBack";
import ProfileCard from "@/components/ProfileCard";


export default function AdminProfile() {
  const { user, loading } = useUserStore();



  if (loading || !user) return <div>loading profie...</div>;


  return <div className="px-2">
    <menu className="my-3">
      <ReturnBack />
    </menu>
    <ProfileCard user={user} placeViewing="Profile" />
  </div>
}


