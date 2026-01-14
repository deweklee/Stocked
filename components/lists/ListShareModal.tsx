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
import { useListUsers, useUpdateListUserRole } from "@/hooks/useListUsers";

type Props = {
  listId: string;
  open: boolean;
  onClose: () => void;
};

export function ListShareModal({ listId, open, onClose }: Props) {
  const {
    data: list,
    isLoading: listLoading,
    refetch: refetchList,
  } = useList(listId);
  const {
    data: pendingShares,
    isLoading: sharesLoading,
    refetch: refetchShares,
  } = useListShares(listId);
  const {
    data: acceptedUsers,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useListUsers(listId);

  const createShare = useCreateListShare(listId);
  const updateShare = useUpdateListShare();
  const deleteShare = useDeleteListShare();
  const updateList = useUpdateList();
  const updateRole = useUpdateListUserRole(listId);

  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    console.log("acceptedUsers:", acceptedUsers);
  }, [acceptedUsers]);

  if (listLoading || sharesLoading || usersLoading) return null;

  async function handleAddShare() {
    if (!inviteEmail.trim()) return;
    await createShare.mutateAsync({
      email: inviteEmail.trim(),
      role: "viewer",
    });
    setInviteEmail("");
    refetchShares();
  }

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

  async function handleRemoveShare(shareId: string) {
    await deleteShare.mutateAsync(shareId);
    refetchShares();
  }

  async function togglePublic() {
    await updateList.mutateAsync({
      listId,
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
      <DialogPanel className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-6">
        <DialogTitle className="text-2xl font-semibold mb-4">
          Manage Sharing
        </DialogTitle>

        {/* Public Toggle */}
        <div className="flex items-center justify-between border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Public list
          </span>
          <input
            type="checkbox"
            checked={list?.is_public}
            onChange={togglePublic}
            className="h-5 w-5 accent-blue-600"
          />
        </div>

        {/* Pending Invites */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Pending Invites
          </h3>
          {pendingShares?.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">
              No pending invites
            </div>
          ) : (
            pendingShares.map((s) => (
              <div
                key={s.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {s.email}
                </span>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={s.role}
                    onChange={(e) =>
                      handleRoleChange(
                        { id: s.id, status: "pending" },
                        e.target.value as "viewer" | "editor"
                      )
                    }
                    className="border rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full md:w-auto"
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
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Accepted Users
          </h3>
          {acceptedUsers?.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">
              No users have accepted
            </div>
          ) : (
            acceptedUsers.map((u) => (
              <div
                key={u.user_id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {u.email}
                </span>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(
                      { id: "", status: "accepted", user_id: u.user_id },
                      e.target.value as "viewer" | "editor"
                    )
                  }
                  className="border rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full md:w-32"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            ))
          )}
        </div>

        {/* Invite by Email */}
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite by email"
            className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleAddShare}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Invite
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full border rounded py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Close
        </button>
      </DialogPanel>
    </Dialog>
  );
}
