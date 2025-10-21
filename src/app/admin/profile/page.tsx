"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Shield } from "lucide-react";
import DisplayImage from "@/components/gallery/DisplayImage";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { formatDate } from "@/utils";


export default function AdminProfile() {
  const router = useRouter();
  const { user, loading } = useUserStore();


  if (loading || !user) return <div>loading profie...</div>;

  return (
    <div className="max-w-3xl mx-auto">

      {/* Profile Card */}
      <div className="border border-neutral-700 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-6">

          {/* Avata */}
          <div className="overflow-hidden">
            <DisplayImage
              src={user.profileImage?.url || ""}
              alt="Admin Avatar"
              useRemove={false}
              type="Profile"
              className="w-28 h-28 rounded-full border-2 border-red-700"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              {user.accountType}
            </p>
            <Badge variant="outline" className="border-red-700 text-red-500">
              {user.gender}
            </Badge>
          </div>

          <div className="flex-1 flex justify-end">
            <Button
              onClick={() => router.push("/admin/profile/edit-profile")}
              className="cursor-pointer"
              variant="ghost"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </Button>
          </div>

        </div>

        {/* Bio */}
        <div className="w-full py-2 my-2">
          <h3 className="text-sm font-bold mb-1">Bio</h3>
          <p className="text-sm font-normal text-wrap">{user.bio}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <Info label="Email" value={user.email} />
          <Info label="Phone" value={user.phone} />
          <Info label="Company" value={user.company} />
          <Info label="Date Joined" value={formatDate(user.createdAt)} />
          <Info label="Last Login" value={formatDate(user.lastLogin)} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label?: string; value?: string }) {
  return (
    <div>
      <h4 className="text-sm font-bold mb-1">{label}</h4>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
