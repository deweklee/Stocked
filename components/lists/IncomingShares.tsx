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
    await deleteShare.mutateAsync(shareId);
    refetch();
  }

  return (
    <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="font-semibold mb-3 text-lg">Pending Invites</h2>

      <ul className="space-y-3">
        {shares.map((share) => (
          <li
            key={share.id}
            className="
              flex items-center justify-between gap-4
              border rounded-lg p-3
              bg-gray-50 dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition
            "
          >
            <div>
              <div className="font-medium">{share.list_name}</div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Invited by {share.inviter_email} · Role:{" "}
                <span className="capitalize">{share.role}</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAccept(share.id)}
                className="
                  bg-blue-600 text-white px-3 py-1 rounded
                  hover:bg-blue-700 transition
                "
              >
                Accept
              </button>

              <button
                onClick={() => handleDecline(share.id)}
                className="
                  bg-gray-300 text-gray-900 px-3 py-1 rounded
                  hover:bg-gray-400 transition
                  dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500
                "
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
