"use client";
export default async function OrdersPage() {
  const data = await fetch("http://localhost:4000/orders");
  const orders = await data.json();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders Table */}
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {orders.map((order: any) => (
                  <tr className="hover:bg-gray-50">
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
                        <button className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
