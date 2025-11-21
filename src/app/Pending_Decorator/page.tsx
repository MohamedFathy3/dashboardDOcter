// app/users/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { useRouter } from "next/navigation";

interface TableField {
  id: string;
  name: string;
  type?: string;
}
export default function UsersPage() {
    const router = useRouter();
  
  return (
    <GenericDataManager
      endpoint="user"
      title="Users"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "User";
            const firstLetter = ep[0]?.toUpperCase() || 'U';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'U';
            return `${firstLetter}${lastLetter}${String(item.id).padStart(3, '0')}`;
          }
        },
        { 
          key: 'user_name', 
          label: 'Username', 
          sortable: true 
        },
        { 
          key: 'first_name', 
          label: 'First Name', 
          sortable: true 
        },
        { 
          key: 'last_name', 
          label: 'Last Name', 
          sortable: true 
        },
        { 
          key: 'email', 
          label: 'Email', 
          sortable: false 
        },
        { 
          key: 'phone', 
          label: 'Phone', 
          sortable: false 
        },
        { 
          key: 'profile_image', 
          label: 'Profile Image', 
          sortable: false,
          render: (item) => (
            <div className="flex justify-center">
              {item.profile_image ? (
                <img 
                  src={item.profile_image} 
                  alt={item.user_name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-600 text-xs font-medium">
                    No Image
                  </span>
                </div>
              )}
            </div>
          )
        },
        { 
          key: 'active', 
          label: 'Status', 
          sortable: true,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.active ? 'Active' : 'Inactive'}
            </span>
          )
        },
        { 
          key: 'has_clinic', 
          label: 'Has Clinic', 
          sortable: true,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.has_clinic 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.has_clinic ? 'Yes' : 'No'}
            </span>
          )
        },
        { 
          key: 'fields', 
          label: 'Specializations', 
          sortable: false,
          render: (item) => (
            <div className="max-w-xs">
              {item.fields && item.fields.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {item.fields.slice(0, 2).map((field: TableField, index: number) => (
                    <span 
                      key={field.id || index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {field.name}
                    </span>
                  ))}
                  {item.fields.length > 2 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                      +{item.fields.length - 2} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No specializations</span>
              )}
            </div>
          )
        },
      ]}
     
           customActions={[
  {
    label: 'View ',
    onClick: (item) => {
      router.push(`/Pending_Decorator/${item.id}`);
    },
    className: `
      relative
      overflow-hidden
      bg-gradient-to-r
      from-[#039fb3]
      to-[#028a9c]
      dark:from-[#036f7c]
      dark:to-[#025a66]
      hover:white
      dark:hover:from-[#025a66]
      dark:hover:to-[#014652]
      text-white
      dark:text-gray-100
      font-semibold
      py-2
      px-4
      rounded-xl
      shadow-md
      hover:shadow-lg
      dark:shadow-gray-900/30
      dark:hover:shadow-gray-900/50
      transform
      hover:-translate-y-0.5
      active:translate-y-0
      transition-all
      duration-300
      ease-out
      border
      border-[#039fb3]/20
      dark:border-[#036f7c]/30
      hover:border-[#028a9c]/30
      dark:hover:border-[#025a66]/40
      group
    `,
    icon: (
      <svg 
        className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300 ease-out" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      </svg>
    )
  }
]}
     
      showAddButton={false}
      showEditButton={false}
      showDeleteButton={false}
      showBulkActions={false}
      showDeletedToggle={false}
      
      // الفلترز المتاحة
      availableFilters={[
        // الفلترز الجديدة المطلوبة
        {
          key: 'user_name',
          label: 'Username',
          type: 'text',
          placeholder: 'Search by username...'
        },
        {
          key: 'email',
          label: 'Email',
          type: 'text',
          placeholder: 'Search by email...'
        },
        {
          key: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: 'Search by phone...'
        },
        {
          key: 'graduation_year',
          label: 'Graduation Year',
          type: 'number',
          placeholder: 'Enter graduation year...'
        },
        {
          key: 'experience_years',
          label: 'Experience Years',
          type: 'number',
          placeholder: 'Enter years of experience...'
        },
        {
          key: 'active',
          label: 'Status',
          type: 'select',
          options: [
            { value: '1', label: 'Active' },
            { value: '0', label: 'Inactive' }
          ]
        },
        {
          key: 'has_clinic',
          label: 'Has Clinic',
          type: 'select',
          options: [
            { value: '1', label: 'Yes' },
            { value: '0', label: 'No' }
          ]
        },
        {
          key: 'graduation_grade',
          label: 'Graduation Grade',
          type: 'select',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'very_good', label: 'Very Good' },
            { value: 'good', label: 'Good' },
            { value: 'pass', label: 'Pass' }
          ]
        },
        {
          key: 'postgraduate_degree',
          label: 'Postgraduate Degree',
          type: 'select',
          options: [
            { value: 'master', label: 'Master' },
            { value: 'phd', label: 'PhD' },
            { value: 'diploma', label: 'Diploma' },
            { value: 'board', label: 'Board' }
          ]
        }
      ]}
    />
  );
}