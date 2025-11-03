"use client";

import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Agent from "@/components/Agent";
import PageLoader from "@/components/loaders/PageLoader";
import { useAgentStore } from "@/store/useAgentStore";
import { X } from "lucide-react";
import UserTypes from "@/types/user.types";
import { showSuccess, showWarning } from "@/components/ui/toasts";
import { deleteAgentDb, updateAgentDb } from "@/lib/firebase/agent_service";
import OverlayLoader from "@/components/loaders/OverlayLoader";

export default function AgentsTable() {
  const { agents, loading: loadingAgents, updateAgent, deleteAgent } = useAgentStore();

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);


  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const query = search.toLowerCase();
      return (
        (agent.firstName + agent.lastName).toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query)
      );
    });
  }, [search, agents]);

  if (loadingAgents) {
    return <PageLoader loading={loadingAgents} />;
  }

  const toggleAll = () => {
    if (selected.length === filteredAgents.length) setSelected([]);
    else setSelected(filteredAgents.map((a) => a.id || ""));
  };

  const toggleOne = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]);
  };

  const sendNotic = async (a: UserTypes, status: string) => {
    try {
      const payload = {
        email: a.email,
        firstName: a.firstName,
        lastName: a.lastName,
        id: a.id || "",
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

  const handleApprove = async (a: UserTypes) => {
    if (!a.id || a.accountStatus === "Approved") return;

    if (!a.emailIsVerified) {
      showWarning("The email for this account is not yet verified!");
      return;
    }
    setLoading(true);

    try {
      const res = await updateAgentDb(a.id, { accountStatus: "Approved" });
      if (res) {
        updateAgent(res);

        // Create a new notification for agent
        await sendNotic(a, "Approved",);

        showSuccess("Agent account approved!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (a: UserTypes) => {
    if (!a.id || a.accountStatus === "Suspended") return;
    setLoading(true);

    try {
      const res = await updateAgentDb(a.id, { accountStatus: "Suspended" });
      if (res) {
        updateAgent(res);
        // Create a new notification for agent
        await sendNotic(a, "Suspended");

        showWarning("Agent account suspended!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (a: UserTypes) => {
    if (!a.id || a.accountStatus === "Rejected") return;
    setLoading(true);

    try {
      const res = await updateAgentDb(a.id, { accountStatus: "Rejected" });
      if (res) {
        updateAgent(res);
        // Create a new notification for agent
        await sendNotic(a, "Rejected");
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

      // Create a new notification for agent
      await sendNotic(a, "Deleted");

      showWarning("Agent account Deleted!");

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAll = () => {
    selected.map((s) => {
      handleDelete(agents.find(a => a.id === s)!)
    });
  }

  const suspendAll = () => {
    selected.map((s) => {
      handleSuspend(agents.find(a => a.id === s)!)
    });
  }

  const approvedAll = () => {
    selected.map((s) => {
      handleApprove(agents.find(a => a.id === s)!)
    });
  };
  
  const rejectAll = () => {
    selected.map((s) => {
      handleReject(agents.find(a => a.id === s)!)
    });
  };

  return (
    <div className="w-full">

      {/* Search + Bulk Actions */}
      <div className="w-full min-h-10 py-2">
        {selected.length > 0 ? (
          <div className="relative flex justify-end gap-4 p-2 items-center shadow-sm flex-wrap">
            <div className="absolute top-1/2 -translate-1/2 left-4">
              <Button
                variant="ghost"
                onClick={() => setSelected([])}
              >
                <X size={20} />
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteAll}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={suspendAll}
            >
              Suspend
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={approvedAll}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectAll}
            >
              Reject
            </Button>
          </div>
        ) :
          <Input
            placeholder="Search agents by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md py-5"
          />
        }
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900 mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">
                <Checkbox
                  checked={
                    selected.length > 0 &&
                    selected.length === filteredAgents.length
                  }
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="p-3 text-left whitespace-pre text-nowrap">Full Name</th>
              <th className="p-3 text-left whitespace-pre text-nowrap">Email</th>
              <th className="p-3 text-left whitespace-pre text-nowrap">Status</th>
              <th className="p-3 text-left whitespace-pre text-nowrap">Joined</th>
              <th className="p-3 text-right whitespace-pre text-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <Agent agent={agent} key={agent.id} selected={selected} setSelected={toggleOne} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  No agents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <OverlayLoader loading={loading} />
    </div>

  );

}
