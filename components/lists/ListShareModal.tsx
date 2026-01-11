"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  useListShares,
  useCreateListShare,
  useUpdateListShare,
  useDeleteListShare,
} from "@/hooks/useListShares";
import { useList, useUpdateList } from "@/hooks/useList";
import { useListUsers, useUpdateListUserRole } from "@/hooks/useListUsers"; // hook for accepted users

type Props = {
  listId: string;
  open: boolean;
  onClose: () => void;
};

export function ListShareModal({ listId, open, onClose }: Props) {
  // --- Fetch list info ---
  const {
    data: list,
    isLoading: listLoading,
    refetch: refetchList,
  } = useList(listId);

  // --- Pending invites from list_shares ---
  const {
    data: pendingShares,
    isLoading: sharesLoading,
    refetch: refetchShares,
  } = useListShares(listId);

  // --- Accepted users from list_users ---
  const {
    data: acceptedUsers,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useListUsers(listId);
  useEffect(() => {
    console.log("acceptedUsers:", acceptedUsers);
  }, [acceptedUsers]);
  // --- Mutations ---
  const createShare = useCreateListShare(listId);
  const updateShare = useUpdateListShare();
  const deleteShare = useDeleteListShare();
  const updateList = useUpdateList();
  const updateRole = useUpdateListUserRole(listId);

  const [inviteEmail, setInviteEmail] = useState("");

  if (listLoading || sharesLoading || usersLoading) return null;

  // --- Add a pending share ---
  async function handleAddShare() {
    if (!inviteEmail.trim()) return;

    await createShare.mutateAsync({
      email: inviteEmail.trim(),
      role: "viewer",
    });
    setInviteEmail("");
    refetchShares();
  }

  // --- Update role for pending or accepted user ---
  async function handleRoleChange(
    share: { id: string; status: "pending" | "accepted"; user_id?: string },
    newRole: "viewer" | "editor"
  ) {
    if (share.status === "accepted") {
      await updateRole.mutateAsync({ userId: share.user_id!, role: newRole });
      refetchUsers();
    } else {
      await updateShare.mutateAsync({
        shareId: share.id,
        updates: { role: newRole },
      });
      refetchShares();
    }
  }

  // --- Remove pending share ---
  async function handleRemoveShare(shareId: string) {
    await deleteShare.mutateAsync(shareId);
    refetchShares();
  }

  // --- Toggle public status ---
  async function togglePublic() {
    await updateList.mutateAsync({
      listId: listId,
      updates: { is_public: !list?.is_public },
    });
    refetchList();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <DialogPanel className="bg-gray-50 text-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg">
        <DialogTitle className="text-2xl font-semibold mb-4">
          Manage Sharing
        </DialogTitle>

        {/* Public Toggle */}
        <div className="flex items-center mb-4">
          <label className="flex-1 font-medium text-gray-800">Public</label>
          <input
            type="checkbox"
            checked={list?.is_public}
            onChange={togglePublic}
            className="h-5 w-5 accent-blue-500"
          />
        </div>

        {/* Pending Invites */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-800">Pending Invites</h3>
          {pendingShares == undefined || pendingShares.length === 0 ? (
            <div className="text-gray-500">No pending invites</div>
          ) : (
            pendingShares!.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between mb-2 bg-white rounded p-2 shadow-sm"
              >
                <span className="text-gray-900">{s.email}</span>
                <div className="flex items-center gap-2">
                  <select
                    value={s.role}
                    onChange={(e) =>
                      handleRoleChange(
                        { id: s.id, status: "pending" },
                        e.target.value as "viewer" | "editor"
                      )
                    }
                    className="border p-1 rounded text-gray-900"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <button
                    onClick={() => handleRemoveShare(s.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Accepted Users */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-800">Accepted Users</h3>
          {acceptedUsers == undefined || acceptedUsers.length === 0 ? (
            <div className="text-gray-500">No users have accepted</div>
          ) : (
            acceptedUsers!.map((u) => (
              <div
                key={u.user_id}
                className="flex items-center justify-between mb-2 bg-white rounded p-2 shadow-sm"
              >
                <span className="text-gray-900">{u.email}</span>
                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(
                        { id: "", status: "accepted", user_id: u.user_id },
                        e.target.value as "viewer" | "editor"
                      )
                    }
                    className="border p-1 rounded text-gray-900"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Invite by Email */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite by email"
            className="border p-2 rounded flex-1 text-gray-900 bg-white"
          />
          <button
            onClick={handleAddShare}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Invite
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </DialogPanel>
    </Dialog>
  );
}
