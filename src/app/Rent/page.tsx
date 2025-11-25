// app/rents/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { useRouter } from "next/navigation";

export default function RentsPage() {
  const router = useRouter();

  return (
    <GenericDataManager
      endpoint="rent"
      title="Rentals"
      columns={[
       
        { 
          key: 'name', 
          label: 'Product Name', 
          sortable: true 
        },
        { 
          key: 'price', 
          label: 'Price', 
          sortable: true,
          render: (item) => `£${item.price}`
        },
        { 
          key: 'type', 
          label: 'Type', 
          sortable: true,
          render: (item) => item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'N/A'
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
          key: 'user', 
          label: 'Renter', 
          sortable: true,
          render: (item) => {
            if (typeof item.user === 'object' && item.user !== null && 'user_name' in item.user) {
              return item.user.user_name;
            }
            return item.user || 'N/A';
          }
        },
        { 
          key: 'gallery', 
          label: 'Gallery', 
          sortable: false,
          render: (item) => (
            <div className="flex justify-center">
              {item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0 ? (
                <div className="relative">
                  <img 
                    src={item.gallery[0]?.fullUrl || item.gallery[0]} 
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                  />
                  {item.gallery.length > 1 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      +{item.gallery.length - 1}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-600 text-xs font-medium">
                    No Images
                  </span>
                </div>
              )}
            </div>
          )
        },
     
      ]}
          customActions={[
  {
    label: 'View ',
    onClick: (item) => {
      router.push(`/Rent/${item.id}`);
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
      availableFilters={[]}
    />
  );
}