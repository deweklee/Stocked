"use client";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 rounded border">
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
