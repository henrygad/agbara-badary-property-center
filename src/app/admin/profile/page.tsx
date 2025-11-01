"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CalendarDays, Clock, Edit, Mail, Pencil, Phone, Shield, UserCircle } from "lucide-react";
import DisplayImage from "@/components/gallery/DisplayImage";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { formatDate } from "@/utils";
import ReturnBack from "@/components/ReturnBack";


export default function AdminProfile() {
  const router = useRouter();
  const { user, loading } = useUserStore();

  const goEdit = () => {
    router.push("/admin/profile/edit-profile")
  };


  if (loading || !user) return <div>loading profie...</div>;

  return <div className="px-2">
    <menu className="my-3">
      <ReturnBack />
    </menu>
    <div className="flex flex-wrap gap-6">

      {/* Avata */}
      <div className="overflow-hidden">
        <DisplayImage
          src={user.profileImage?.url || "avata.png"}
          alt="Admin Avatar"
          useRemove={false}
          type="Profile"
          className="w-20 h-20 rounded-full border-2 border-primary"
        />
      </div>

      {/* Details */}
      <div className="flex-1 space-y-2">
        <h2 className="text-xl text-wrap font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-400 text-sm flex items-center gap-1">
          <Shield className="w-4 h-4 text-primary" />
          {user.accountType}
        </p>
        {user.gender && <Badge variant="outline" className="border-primary text-primary">
          {user.gender}
        </Badge>}
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
      <Info goEdit={goEdit} name="bio" label="Bio" value={user.bio} />      
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <Info goEdit={goEdit} name="email" label="Email" value={user.email} />
      <Info goEdit={goEdit} name="phone" label="Phone" value={user.phoneCode + user.phone} />
      <Info goEdit={goEdit} name="company" label="Company" value={user.company} />
      <Info goEdit={goEdit} name="joined" label="Date Joined" value={formatDate(user.createdAt)} />
      <Info goEdit={goEdit} name="login" label="Last Login" value={formatDate(user.lastLogin as Date)} />
    </div>
  </div>
}

function Info({ label, value, name, goEdit }: { name: string, label?: string; value?: string, goEdit: () => void }) {

  const InfoIcon = ({ name }: { name: string }) => {
    if (name == "bio") {
      return <UserCircle size={20} />
    }
    if (name === "email") {
      return <Mail size={20} />
    }
    if (name === "phone") {
      return <Phone size={20} />
    }
    if (name === "company") {
      return <Building2 size={20} />
    }
    if (name === "joined") {
      return <CalendarDays size={20} />
    }
    if (name === "login") {
      return <Clock size={20} />
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <InfoIcon name={name} />
      <h4 className="text-sm font-medium mb-1">{label}</h4>
      </div>
      <div className="w-full p-3 ">
        {value ?
          <p className="text-base font-normal break-all">{value}</p> :
          <div className="pl-3"><Pencil className="cursor-pointer" onClick={goEdit} size={20} /></div>
        }
      </div>
    </div>
  );
}
