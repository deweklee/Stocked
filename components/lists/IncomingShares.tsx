"use client";

import {
  useUpdateListShare,
  useDeleteListShare,
  useIncomingShares,
} from "@/hooks/useListShares";

export function IncomingShares() {
  const { data: shares, isLoading, error, refetch } = useIncomingShares();

  const updateShare = useUpdateListShare();
  const deleteShare = useDeleteListShare();

  if (isLoading) return <div>Loading invites...</div>;
  if (error) return <div>Failed to load invites</div>;
  if (!shares || shares.length === 0) return null;

  async function handleAccept(shareId: string) {
    await updateShare.mutateAsync({
      shareId,
      updates: { status: "accepted" },
    });
    refetch();
  }

  async function handleDecline(shareId: string) {
    // You can either:
    // 1. delete the share row
    // 2. OR update status = "declined"
    // Deleting keeps things simpler
    await deleteShare.mutateAsync(shareId);
    refetch();
  }

  return (
    <div className="mb-6 border rounded p-4 bg-white">
      <h2 className="font-semibold mb-3">Pending Invites</h2>

      <ul className="space-y-3">
        {shares.map((share) => (
          <li
            key={share.id}
            className="flex items-center justify-between border rounded p-2"
          >
            <div>
              <div className="font-medium">{share.list_name}</div>
              <div className="text-sm text-gray-500">
                Invited by {share.inviter_email} · Role: {share.role}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(share.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(share.id)}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
