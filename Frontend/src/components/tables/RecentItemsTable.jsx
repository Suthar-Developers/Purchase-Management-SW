import React from 'react'

const formatDate = (dateValue) => {
      if (!dateValue) return '-'
      return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
      }).format(new Date(dateValue))
}

const RecentItemsTable = ({ requests = [], isLoading = false }) => {
      const rows = requests
            .flatMap((request) =>
                  (request.materials || []).map((material, index) => ({
                        id: material.material_id,
                        key: `${request.request_id}-${material.material_id || index}`,
                        PR_Date: request.created_pr_at,
                        itemName: material.material || '-',
                        category: material.category || '-',
                        projectName: request.projectName || '-',
                        qty: material.qty || '-',
                        unit: material.unit || '-',
                        status: material.materialStatus || request.requestStatus || '-',
                  }))
            )
            .slice(0, 8)

      console.log(requests[0]);

      if (isLoading) {
            return <div className='px-5 py-10 text-center text-sm text-slate-500'>Loading latest items...</div>
      }

      if (rows.length === 0) {
            return <div className='px-5 py-10 text-center text-sm text-slate-500'>No purchase request items found.</div>
      }

      return (
            <div className='w-full overflow-x-auto'>
                  <table className='min-w-190 w-full border-collapse text-left text-sm'>
                        <thead className='bg-slate-100 text-xs uppercase text-slate-500'>
                              <tr>
                                    <th className='px-5 py-3 font-semibold'>PR Date</th>
                                    <th className='px-5 py-3 font-semibold'>Item Name</th>
                                    <th className='px-5 py-3 font-semibold'>Category</th>
                                    <th className='px-5 py-3 font-semibold'>Project</th>
                                    <th className='px-5 py-3 font-semibold'>Qty</th>
                                    <th className='px-5 py-3 font-semibold'>Status</th>
                              </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                              {rows.map((row) => (
                                    <tr key={row.key} className='hover:bg-slate-50'>
                                          <td className='px-5 py-3 text-slate-600'>{formatDate(row.PR_Date)}</td>
                                          <td className='px-5 py-3 font-medium text-slate-950'>{row.itemName}</td>
                                          <td className='px-5 py-3 text-slate-600'>{row.category}</td>
                                          <td className='px-5 py-3 text-slate-600'>{row.projectName}</td>
                                          <td className='px-5 py-3 text-slate-600'>{row.qty} {row.unit}</td>
                                          <td className='px-5 py-3'>
                                                <span className='rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'>
                                                      {row.status}
                                                </span>
                                          </td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>
            </div>
      )
}

export default RecentItemsTable
