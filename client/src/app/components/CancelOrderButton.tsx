// components/CancelOrderButton.tsx
import type React from "react";

interface Order {
  id: number;
  customer: { name: string };
  store: { name: string };
  amount_cents: number;
  status: string;
  created_at: string;
}

interface CancelOrderButtonProps {
  order: Order;
  onCancel: (order: Order) => void;
}

const CancelOrderButton: React.FC<CancelOrderButtonProps> = ({
  order,
  onCancel,
}) => {
  const handleClick = () => {
    onCancel(order);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-indigo-600 hover:text-indigo-900"
    >
      Cancel
    </button>
  );
};

export { CancelOrderButton };
