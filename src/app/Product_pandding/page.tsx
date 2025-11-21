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
          key: 'is_new', 
          label: 'New', 
          sortable: true,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.is_new 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.is_new ? 'Yes' : 'No'}
            </span>
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
        { 
          key: 'des', 
          label: 'Description', 
          sortable: false,
          render: (item) => (
            <div className="max-w-xs">
              <p className="text-sm text-gray-600 truncate">
                {item.des || 'No description'}
              </p>
            </div>
          )
        },
     
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
         initialData={{ active: 0 }} // علشان يبعت type عند الحفظ
      defaultFilters={{ active: '0' }} 
    />
  );
}