// app/products/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  return (
    <GenericDataManager
      endpoint="product"
      title="Products"
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
          key: 'discount', 
          label: 'Discount', 
          sortable: true,
          render: (item) => item.discount ? `${item.discount}%` : 'No Discount'
        },
        { 
          key: 'price_after_discount', 
          label: 'Final Price', 
          sortable: true,
          render: (item) => `£${item.price_after_discount || item.price}`
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
          label: 'Seller', 
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
                  <span className="text-sm">{item.user.user_name}</span>
                </div>
              );
            }
            return 'N/A';
          }
        },
        { 
          key: 'gallery', 
          label: 'Gallery', 
          sortable: false,
          render: (item) => {
            // التحقق من وجود gallery وانه ليس مصفوفة فارغة
            if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
              // البحث عن أول صورة صالحة في المصفوفة (من الـ fullUrl)
              const firstImage = item.gallery.find(img => 
                img && typeof img === 'object' && img.fullUrl
              );
              
              if (firstImage && firstImage.fullUrl) {
                return (
                  <div className="flex justify-center">
                    <div className="relative">
                      <img 
                        src={firstImage.fullUrl} 
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          // إذا فشل تحميل الصورة، استخدم fallback
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {item.gallery.length > 1 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          +{item.gallery.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
            }
            
            // إذا لم توجد صور، عرض صورة افتراضية
            return (
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-600 text-xs font-medium">
                    No Images
                  </span>
                </div>
              </div>
            );
          }
        },
      
     
      ]}
     
     customActions={[
  {
    label: 'View ',
    onClick: (item) => {
      router.push(`/Product/${item.id}`);
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
          key: 'is_new',
          label: 'New Products',
          type: 'select',
          options: [
            { value: '1', label: 'Yes' },
            { value: '0', label: 'No' }
          ]
        },
        {
          key: 'name',
          label: 'Product Name',
          type: 'text',
          placeholder: 'Search by product name...'
        },
        {
          key: 'price_min',
          label: 'Min Price',
          type: 'number',
          placeholder: 'Minimum price...'
        },
        {
          key: 'price_max', 
          label: 'Max Price',
          type: 'number',
          placeholder: 'Maximum price...'
        }
      ]}
        initialData={{ active: 1 }} // علشان يبعت type عند الحفظ
      defaultFilters={{ active: "1" }} 
    />
  );
}