"use client";

import { cn } from '@/lib/utils';
import UserTypes from '@/types/user.types'
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ArrowLeft, CheckCircle, Eye, MoreVertical, PauseCircle, Trash2, XCircle } from 'lucide-react';
import Modal from './Modal';
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from './ui/drawer';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { useModal } from '@/hooks/useModal';
import { useAgentStore } from '@/store/useAgentStore';
import OverlayLoader from './loaders/OverlayLoader';
import ProfileCard from './ProfileCard';
import { Checkbox } from './ui/checkbox';
import { showSuccess, showWarning } from './ui/toasts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { deleteAgentDb, updateAgentDb } from '@/lib/firebase/agent_service';

type Props = {
    agent: UserTypes,
    selected?: string[]
    setSelected?: (selected: string) => void
};

function Agent({ agent, selected, setSelected = () => null }: Props) {
    const { updateAgent, deleteAgent } = useAgentStore();
    const [loading, setLoading] = useState(false);
    const [displayDialogType, setDisplayDialogType] = useState({
        display: false,
        type: "Approve",
    });

    const { open, handleModal } = useModal();

    const sendNotic = async (status: string) => {
        try {
            const payload = {
                email: agent.email,
                firstName: agent.firstName,
                lastName: agent.lastName,
                id: agent.id || "",
                status,
            };

            await fetch("/api/agent/account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error(error)
        }
    };

    const handleView = () => {
        handleModal(true);
    };

    const handleApprove = async (a: UserTypes) => {
        if (!a.id) return;

        if (!a.emailIsVerified) {
            showWarning("The email for this account is not yet verified!");
            return;
        }
        setLoading(true);

        try {
            const res = await updateAgentDb(a.id, { accountStatus: "Approved" });
            if (res) {
                updateAgent(res);
                setDisplayDialogType({ display: false, type: "Approve" });

                // Create a new notification for agent
                await sendNotic("Approved");

                showSuccess("Agent account approved!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleSuspend = async (a: UserTypes) => {
        if (!a.id) return;
        setLoading(true);

        try {
            const res = await updateAgentDb(a.id, { accountStatus: "Suspended" });
            if (res) {
                updateAgent(res);
                setDisplayDialogType({ display: false, type: "Suspend" });
                // Create a new notification for agent
                await sendNotic("Suspended");

                showWarning("Agent account suspended!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (a: UserTypes) => {
        if (!a.id) return;
        setLoading(true);

        try {
            const res = await updateAgentDb(a.id, { accountStatus: "Rejected" });
            if (res) {
                updateAgent(res);
                setDisplayDialogType({ display: false, type: "Reject" });
                // Create a new notification for agent
                await sendNotic("Rejected");
                showWarning("Agent account Rejected!");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (a: UserTypes) => {
        if (!a.id) return;
        setLoading(true);

        try {
            await deleteAgentDb(a.id);
            deleteAgent(a.id);

            setDisplayDialogType({ display: false, type: "Delete" });
            // Create a new notification for agent
            await sendNotic("Deleted");

            showWarning("Agent account Deleted!");

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };    
    
    return <>
        <tr
            key={agent.id}
            className={cn("border-t hover:bg-gray-50 dark:hover:bg-gray-800/50",
                selected?.includes(agent.id || "") && "bg-gray-50 dark:bg-gray-800")}
            onClick={() => setSelected(agent?.id || "")}
        >
            {selected && <td className="p-3">
                <Checkbox
                    checked={selected.includes(agent.id || "")}
                    onCheckedChange={() => setSelected(agent?.id || "")}
                />
            </td>}

            <td className="p-3 font-medium">{agent.firstName} {agent.lastName}</td>
            <td className="p-3">{agent.email}</td>

            <td className="p-3 capitalize">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${agent.accountStatus === "Approved"
                            ? "bg-green-100 text-green-700"
                            : agent.accountStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : agent.accountStatus === "Suspended"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-red-100 text-red-700"
                        }`}
                >
                    {agent.accountStatus}
                </span>
            </td>

            <td className="p-3 text-gray-500">
                {new Date(agent.createdAt).toLocaleDateString()}
            </td>

            <td className="p-3 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="min-w-40 space-y-4 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DropdownMenuItem
                            className="flex gap-2 items-center"
                            onClick={() => handleView()}
                        >
                            <Eye className="w-4 h-4 mr-2 text-gray-600" />
                            View Details
                        </DropdownMenuItem>
                        {agent.accountStatus !== "Approved" &&
                            <DropdownMenuItem
                                className="flex gap-2 items-center"
                                onClick={() =>
                                    setDisplayDialogType({ display: true, type: "Approve" })
                                }
                            >
                                <CheckCircle className="w-4 h-4 mr-2 text-gray-600" />
                                Approve
                            </DropdownMenuItem>}
                        {agent.accountStatus !== "Suspended" &&
                            <DropdownMenuItem
                                className="flex gap-2 items-center"
                                onClick={() =>
                                    setDisplayDialogType({ display: true, type: "Suspend" })
                                }
                            >
                                <PauseCircle className="w-4 h-4 mr-2 text-gray-600" />
                                Suspend
                            </DropdownMenuItem>}
                        {agent.accountStatus !== "Rejected" &&
                            <DropdownMenuItem
                                className="flex gap-2 items-center"
                                onClick={() =>
                                    setDisplayDialogType({ display: true, type: "Reject" })
                                }
                            >
                                <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                                Reject
                            </DropdownMenuItem>}
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2 text-primary" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>

        <Modal
            open={open}
            setOpen={handleModal}
            className="fixed inset-0 h-screen w-screen max-w-none"
        >
            <DrawerHeader className="relative flex justify-between items-center">
                <div className="absolute left-2 top-0">
                    <Button
                        type="button"
                        variant="ghost"
                        datatype="icon"
                        className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
                        onClick={() => handleModal(false)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>
                <DrawerTitle>Agent Details</DrawerTitle>
                <DrawerDescription className="hidden">
                    View the full details of Agent
                </DrawerDescription>
                <div className='flex justify-center items-center absolute right-0 top-0'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="min-w-40 space-y-4 p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuItem
                                className="flex gap-2 items-center"
                            >
                                <CheckCircle className="w-4 h-4 mr-2 text-gray-600" />
                                Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex gap-2 items-center"
                            >
                                <PauseCircle className="w-4 h-4 mr-2 text-gray-600" />
                                Suspend
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex gap-2 items-center"
                            >
                                <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                                Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </DrawerHeader>

            <ScrollArea className="max-h-full overflow-auto">
                <div className="mx-auto p-8">
                    <ProfileCard placeViewing='Agents' user={agent} />
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>

            <DrawerFooter className="w-full hidden">
            </DrawerFooter>
        </Modal>

        <AlertDialog
            open={displayDialogType.display}
            onOpenChange={() =>
                setDisplayDialogType({ display: false, type: "Reject" })
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {displayDialogType.type} Agent
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-wrap">
                        Do you want to {displayDialogType.type} “{agent.firstName} {agent.lastName}”?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-primary text-white"
                        onClick={() => {
                            if (displayDialogType.type === "Approve") {
                                handleApprove(agent);
                            } else if (displayDialogType.type === "Reject") {
                                handleReject(agent);
                            } else if (displayDialogType.type === "Suspend") {
                                handleSuspend(agent);
                            } else if (displayDialogType.type === "Delete") {
                                handleDelete(agent);
                            }
                        }}
                    >
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <OverlayLoader loading={loading} />
    </>
}

export default Agent