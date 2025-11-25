// app/jobs/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { useRouter } from "next/navigation";
interface ImageObject {
  url?: string;
  fullUrl?: string;
  previewUrl?: string;
  // Add other possible image properties
}
export default function JobsPage() {
  const router = useRouter();

  return (
    <GenericDataManager
      endpoint="job"
      title="Jobs"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "Job";
            const firstLetter = ep[0]?.toUpperCase() || 'J';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'J';
            return `${firstLetter}${lastLetter}${String(item.id).padStart(3, '0')}`;
          }
        },
        { 
          key: 'title', 
          label: 'Title', 
          sortable: true 
        },
       
        { 
          key: 'type', 
          label: 'Type', 
          sortable: true,
          render: (item) => {
            const typeMap: { [key: string]: string } = {
              'full_time': 'Full Time',
              'part_time': 'Part Time',
              'contract': 'Contract',
              'freelance': 'Freelance'
            };
            return typeMap[item.type] || item.type;
          }
        },
        { 
          key: 'salary', 
          label: 'Salary', 
          sortable: true 
        },
        { 
          key: 'available', 
          label: 'Available', 
          sortable: true,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.available ? 'Yes' : 'No'}
            </span>
          )
        },
        { 
          key: 'active', 
          label: 'Active', 
          sortable: true,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.active ? 'Yes' : 'No'}
            </span>
          )
        },
        { 
         key: 'image', 
          label: 'Image', 
          sortable: false,
          render: (item) => {
            // Handle different types of image data
            const imageUrl = typeof item.image === 'string' ? item.image : 
                           item.image && typeof item.image === 'object' && 'url' in item.image ? 
                           (item.image as ImageObject).url : null;
            
            return (
              <div className="flex justify-center">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={item.title}
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
            );
          }
        },
        
      ]}
     
      // إضافة actions مخصصة
  customActions={[
  {
    label: 'View ',
    onClick: (item) => {
      router.push(`/Job/${item.id}`);
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
     
      // التحكم في ظهور الأزرار
      showAddButton={false}
      showEditButton={false}
      showDeleteButton={false}
      showBulkActions={false}
      showDeletedToggle={false}
      showCustomActions={true} // ← أضف هذا السطر المهم!
      
      // الفلترز المتاحة
      availableFilters={[
        {
          key: 'available',
          label: 'Available',
          type: 'select',
          options: [
            { value: '1', label: 'Yes' },
            { value: '0', label: 'No' }
          ]
        },
        {
          key: 'active',
          label: 'Active',
          type: 'select',
          options: [
            { value: '1', label: 'Yes' },
            { value: '0', label: 'No' }
          ]
        },
        {
          key: 'type',
          label: 'Job Type',
          type: 'select',
          options: [
            { value: 'Full-time', label: 'Full Time' },
            { value: 'part_time', label: 'Part Time' },
            { value: 'contract', label: 'Contract' },
            { value: 'freelance', label: 'Freelance' }
          ]
        },
        {
          key: 'title',
          label: 'Job Title',
          type: 'text',
          placeholder: 'Search by job title...'
        },
      
      ]}
    />
  );
}