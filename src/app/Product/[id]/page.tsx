// app/products/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Tag, DollarSign, Percent, CheckCircle, XCircle, Star } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
interface GalleryImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface User {
  id: number;
  user_name: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  discount: string;
  price_after_discount: number;
  des: string;
  is_new: boolean;
  gallery: GalleryImage[];
  user: User;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  result: string;
  data: Product;
  message: string;
  status: number;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = params.id;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data: ApiResponse = await apiFetch(`/product/${productId}`);
        
        console.log("📦 Received product data:", data);

        if (data.result === 'Success' && data.data) {
          setProduct(data.data);
        } else {
          throw new Error(data.message || 'Failed to load product details');
        }
      } catch (err) {
        console.error("❌ Error fetching product details:", err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The product youre looking for doesnt exist.</p>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout> <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 dark:border-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Product Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {product.active ? 'Active' : 'Inactive'}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.is_new 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {product.is_new ? 'New' : 'Used'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {product.gallery.length > 0 ? (
                  <img
                    src={product.gallery[selectedImage].fullUrl}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.gallery.length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gallery</h3>
                <div className="grid grid-cols-4 gap-4">
                  {product.gallery.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.fullUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Details */}
            {product.gallery.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Image Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.gallery[selectedImage].name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatFileSize(product.gallery[selectedImage].size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.gallery[selectedImage].mimeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Uploaded</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.gallery[selectedImage].createdAt}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pricing</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Original Price</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</p>
                    </div>
                  </div>
                </div>

                {parseFloat(product.discount) > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Percent className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
                          <p className="text-lg font-semibold text-orange-600">{product.discount}% OFF</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-3">
                        <Tag className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Final Price</p>
                          <p className="text-3xl font-bold text-blue-600">${product.price_after_discount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                        You save ${(parseFloat(product.price) - product.price_after_discount).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>

             
            </div>

            {/* Product Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{product.des}</p>
            </div>

            {/* Seller Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
              
              <div className="flex items-center space-x-4">
                {product.user.profile_image && (
                  <img
                    src={product.user.profile_image}
                    alt={product.user.user_name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{product.user.user_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member since {formatDate(product.user.created_at)}</p>
                </div>
              
              </div>
            </div>

            {/* Product Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Status</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Status</span>
                  <div className="flex items-center">
                    {product.active ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <span className={`font-medium ${product.active ? 'text-green-600' : 'text-red-600'}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Condition</span>
                  <div className="flex items-center">
                    {product.is_new ? (
                      <Star className="w-5 h-5 text-blue-500 mr-2" />
                    ) : (
                      <Tag className="w-5 h-5 text-gray-500 mr-2" />
                    )}
                    <span className={`font-medium ${product.is_new ? 'text-blue-600' : 'text-gray-600'}`}>
                      {product.is_new ? 'New' : 'Used'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(product.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(product.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></MainLayout>
   
  );
}