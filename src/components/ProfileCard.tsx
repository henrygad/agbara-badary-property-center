"use client";

import UserTypes from '@/types/user.types'
import React from 'react'
import DisplayImage from './gallery/DisplayImage'
import { Building2, CalendarDays, Clock, Edit, Mail, Pencil, Phone, UserCircle } from "lucide-react";
import { formatDate } from '@/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function ProfileCard({ user, placeViewing }: { user: UserTypes, placeViewing: "Agents" | "Profile" }) {
    const router = useRouter();

    const goEdit = () => {
        router.push("/admin/profile/edit-profile")
    };

    return (
        <div className='space-y-4'>
            <div className="flex justify-center items-center flex-col gap-2">

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
                <div className="space-y-2">
                    <h2 className="text-xl text-wrap font-semibold">
                        {user.firstName} {user.lastName}
                    </h2>
                    {user.gender &&
                        <Badge variant="outline" className="border-primary text-primary">
                            {user.gender}
                        </Badge>}
                    <div className='flex justify-center items-center'>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${user.accountStatus === "Approved"
                                    ? "bg-green-100 text-green-700"
                                    : user.accountStatus === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : user.accountStatus === "Suspended"
                                            ? "bg-gray-200 text-gray-700"
                                            : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.accountStatus}
                        </span>
                    </div>
                </div>

                {placeViewing === "Profile" &&
                    <div className="flex-1 flex justify-end">
                        <Button
                            onClick={() => router.push("/admin/profile/edit-profile")}
                            className="cursor-pointer"
                            variant="ghost"
                        >
                            <Edit className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>}

            </div>

            {/* Bio */}
            <div className="w-full py-2">
                <Info placeViewing={placeViewing} goEdit={goEdit} name="bio" label="Bio" value={user.bio} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className='flex items-center'>
                    <Info placeViewing={placeViewing} goEdit={goEdit} name="email" label="Email" value={user.email} />
                    {user.emailIsVerified && <span className='text-lime-700 py-1 px-2 text-shadow-2xs text-xs'>Verified</span>}
                </div>
                <Info placeViewing={placeViewing} goEdit={goEdit} name="phone" label="Phone" value={user.phoneCode + user.phone} />
                <Info placeViewing={placeViewing} goEdit={goEdit} name="company" label="Company" value={user.company} />
                <Info placeViewing={placeViewing} goEdit={goEdit} name="joined" label="Date Joined" value={formatDate(user.createdAt)} />
                <Info placeViewing={placeViewing} goEdit={goEdit} name="login" label="Last Login" value={formatDate(user.lastLogin as Date)} />
            </div>
        </div>
    )
}


function Info({ label, value, name, goEdit, placeViewing }:
    { name: string, label?: string; value?: string, goEdit: () => void, placeViewing: "Agents" | "Profile" }) {

    return (
        <div>
            <div className="flex items-center gap-2">
                <InfoIcon name={name} />
                <h4 className="text-sm font-medium mb-1">{label}</h4>
            </div>
            <div className="w-full p-3 ">
                {value ?
                    <p className="text-base font-normal break-all">{value}</p> :
                    <div className="pl-3">
                        {placeViewing === "Profile" && <Pencil className="cursor-pointer" onClick={goEdit} size={20} />}
                    </div>
                }
            </div>
        </div>
    );
}


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
