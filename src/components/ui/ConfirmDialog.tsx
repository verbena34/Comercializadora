import React from "react";

export default function ConfirmDialog({
  open,
  title,
  children,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        <div className="mt-4">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm && onConfirm();
              onClose && onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
