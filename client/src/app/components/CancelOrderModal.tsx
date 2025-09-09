import type React from "react";
import type { Order } from "../hooks/useOrders";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (refund: boolean) => void;
  order: Order | null;
  error?: string | null;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  error,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
        <p className="mb-4">
          Are you sure you want to cancel order <strong>{order.id}</strong>?
        </p>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => onConfirm(true)}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Cancel with refund
          </button>
          <button
            type="button"
            onClick={() => onConfirm(false)}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Cancel without refund
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
