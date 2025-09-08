// components/OrdersTable.tsx
import React from 'react';

interface Order {
  id: number;
  customer: { name: string };
  store: { name: string };
  amount_cents: number;
  status: string;
  created_at: string;
}

interface OrdersTableProps {
  orders: Order[];
  onCancel: (order: Order) => void;
  loading: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onCancel, loading }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Order List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td>
                    <div className="flex justify-center items-center h-full">
                      {order.id}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center h-full">
                      {order.customer.name}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center h-full">
                      {order.store.name}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center h-full">
                      {order.amount_cents}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center h-full">
                      {order.status}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center h-full">
                      {order.created_at}
                    </div>
                  </td>

                  <td>
                    <div className="flex justify-center items-center h-full">
                      <button
                        onClick={() => onCancel(order)}
                        className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;