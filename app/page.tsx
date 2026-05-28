'use client'

import { useEffect } from 'react'
import { useUserManagementStore } from '@/store/userManagementStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Plus, Edit2, ShieldAlert } from 'lucide-react'

export default function UserManagement() {
  const {
    users,
    filters,
    isLoading,
    setUsers,
    setLoading,
    setFilters,
  } = useUserManagementStore()

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams({
          search: filters.search,
          status: filters.status,
          role: filters.role,
          page: filters.page.toString(),
          pageSize: filters.pageSize.toString(),
        })

        const response = await fetch(`/licenses/api/users?${queryParams}`)
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error('Failed to fetch users', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [filters, setLoading, setUsers])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value, page: 1 })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center">
            <Filter className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-primary flex-shrink-0" />
            License Management
          </h1>
          <p className="text-slate-500 mt-2">
            Manage system licenses, approvals, and workflows.
          </p>
        </div>
        <button className="flex w-full sm:w-auto items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <CardTitle className="text-lg font-medium text-slate-700">User Directory</CardTitle>
            
            <div className="flex items-center w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary border-transparent"
                  value={filters.search}
                  onChange={handleSearch}
                />
              </div>
              <button className="p-2 border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium mr-3">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                            <div className="text-slate-500 text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <span key={role} className="px-2 py-1 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200 flex items-center">
                              {role === 'SUPER_ADMIN' && <ShieldAlert className="h-3 w-3 mr-1" />}
                              {role.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          user.status === 'INACTIVE' ? 'bg-slate-100 text-slate-800' :
                          user.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {user.department || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{users.length}</span> results
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                disabled={filters.page === 1}
                onClick={() => setFilters({ page: filters.page - 1 })}
                className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-sm disabled:opacity-50 hover:bg-slate-100"
              >
                Previous
              </button>
              <button 
                onClick={() => setFilters({ page: filters.page + 1 })}
                className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-100"
              >
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
