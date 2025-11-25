// app/users/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface ImageData {
  // تعريف الـ ImageData إذا كان موجود
  url?: string;
  path?: string;
  fullUrl?: string;
  // أي خصائص تانية
}

export default function UsersPage() {
    const router = useRouter();
  
  return (
    <GenericDataManager
        endpoint="post"
      title="Posts"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => (
            <span className="font-mono text-sm font-medium">
              P{String(item.id).padStart(3, '0')}
            </span>
          )
        },
        { 
          key: 'user', 
          label: 'User', 
          sortable: true,
          render: (item) => {
            if (typeof item.user === 'object' && item.user !== null && 'user_name' in item.user) {
              return (
                <div className="flex items-center space-x-2">
                  {item.user.profile_image && (
                    <img 
                      src={item.user.profile_image} 
                      alt={item.user.user_name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm font-medium">@{item.user.user_name}</span>
                </div>
              );
            }
            return 'N/A';
          }
        },
        { 
          key: 'content', 
          label: 'Content', 
          sortable: true,
          render: (item) => (
            <div className="max-w-xs">
              {item.content ? (
                <p className="text-sm text-gray-700 line-clamp-2">
                  {item.content}
                </p>
              ) : (
                <span className="text-gray-400 text-sm">No content</span>
              )}
            </div>
          )
        },
        
       
        { 
          key: 'is_ad_request', 
          label: 'Type', 
          sortable: true,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.is_ad_request 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {item.is_ad_request ? 'Ad' : 'Post'}
            </span>
          )
        },
        { 
          key: 'is_ad_approved', 
          label: 'Ad Status', 
          sortable: true,
          render: (item) => {
            if (!item.is_ad_request) {
              return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  N/A
                </span>
              );
            }
            
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.is_ad_approved === true
                  ? 'bg-green-100 text-green-800'
                  : item.is_ad_approved === false
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.is_ad_approved === true 
                  ? 'Approved' 
                  : item.is_ad_approved === false 
                  ? 'Rejected' 
                  : 'Pending'}
              </span>
            );
          }
        },
       
      
      
     
      ]}
     
           customActions={[
  {
    label: 'View ',
    onClick: (item) => {
      router.push(`/Ads/${item.id}`);
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
   
      ]}
    />
  );
}