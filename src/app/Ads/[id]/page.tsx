'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
import toast from 'react-hot-toast';

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

interface Post {
  id: number;
  user: {
    id: number;
    user_name: string;
    profile_image: string;
    created_at: string;
    updated_at: string;
  };
  content: string;
  image: string;
  video: string;
  gallery: GalleryItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any[];
  is_ad_request: boolean;
  is_ad_approved: boolean | null;
  ad_approved_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/show-post/${id}`);
        
        if (response.data) {
          setPost(response.data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post data');
        toast.error('Failed to load post data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // ⭐⭐⭐ دالة تغيير حالة الـ Approval (بدون الـ active) ⭐⭐⭐
  const handleToggleApproval = async () => {
    if (!post) return;

    const newApprovalStatus = !post.is_ad_approved;
    
    const confirmMessage = newApprovalStatus 
      ? 'Are you sure you want to approve this advertisement?'
      : 'Are you sure you want to reject this advertisement?';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setUpdating(true);
      
      // ⭐⭐⭐ إرسال بيانات الـ approval فقط ⭐⭐⭐
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestBody: any = {
        is_ad_approved: newApprovalStatus,
        status: newApprovalStatus ? 1 : 0 // ⭐⭐⭐ إرسال status بناءً على approval ⭐⭐⭐
      };

      // إذا كان الموافقة، نضيف timestamp
      if (newApprovalStatus) {
        requestBody.ad_approved_at = new Date().toISOString();
      } else {
        requestBody.ad_approved_at = null;
      }

      const response = await apiFetch(`/posts/${post.id}/ad-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // تحسين الـ Error Handling
      if (response.status === 200 || response.status === 1 || response.post) {
        // تحديث حالة الـ Post محلياً
        setPost(prev => {
          if (!prev) return null;
          
          return { 
            ...prev, 
            is_ad_approved: newApprovalStatus,
            ad_approved_at: newApprovalStatus ? new Date().toISOString() : null,
            active: newApprovalStatus // ⭐⭐⭐ تحديث active بناءً على approval ⭐⭐⭐
          };
        });
        
        toast.success(`Advertisement ${newApprovalStatus ? 'approved' : 'rejected'} successfully!`);
        
        // ⭐⭐⭐ تحديث الـ localStorage للإشارة لتحديث الجدول ⭐⭐⭐
        localStorage.setItem('shouldRefreshPosts', 'true');
        
      } else if (response.message) {
        // إذا كان فيه message، نعرض success مع تحديث الحالة
        toast.success(`Advertisement ${newApprovalStatus ? 'approved' : 'rejected'} successfully!`);
        
        setPost(prev => {
          if (!prev) return null;
          
          return { 
            ...prev, 
            is_ad_approved: newApprovalStatus,
            ad_approved_at: newApprovalStatus ? new Date().toISOString() : null,
            active: newApprovalStatus // ⭐⭐⭐ تحديث active بناءً على approval ⭐⭐⭐
          };
        });
        
        // ⭐⭐⭐ تحديث الـ localStorage للإشارة لتحديث الجدول ⭐⭐⭐
        localStorage.setItem('shouldRefreshPosts', 'true');
        
      } else {
        throw new Error(response.message || 'Failed to update advertisement status');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error updating advertisement status:', err);
      const errorMessage = err.message || 'Error updating advertisement status. Please try again.';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded max-w-md">
              <h3 className="font-bold text-lg mb-2">Error</h3>
              <p>{error || 'Post not found'}</p>
              <button
                onClick={() => router.push('/Ads')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Back to Posts
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/posts"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
            >
              ← Back to Posts
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post Details</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Post ID: P{String(post.id).padStart(3, '0')}</p>
          </div>

          {/* Post Card */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            {/* User Info Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {post.user.profile_image ? (
                  <img
                    src={post.user.profile_image}
                    alt={post.user.user_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {post.user.user_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">@{post.user.user_name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">User ID: {post.user.id}</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-4">
              {post.content && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Content</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Media Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Main Image */}
                {post.image && !post.image.includes('default-logo.png') && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Main Image</h4>
                    <img
                      src={post.image}
                      alt="Post image"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}

                {/* Video */}
                {post.video && !post.video.includes('default-logo.png') && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Video</h4>
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <a
                        href={post.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        View Video
                      </a>
                    </div>
                  </div>
                )}

                {/* Gallery Images */}
                {post.gallery && post.gallery.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Gallery ({post.gallery.length} items)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {post.gallery.map((item) => (
                        <div key={item.id} className="relative group">
                          <img
                            src={item.fullUrl}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <a
                              href={item.fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              {/* <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Comments ({post.comments ? post.comments.length : 0})
                </h4>
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-3">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-gray-700 dark:text-gray-300">Comment {index + 1}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
                )}
              </div> */}

              {/* Status Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Advertisement Status</h4>
                <div className="flex flex-wrap gap-4">
                  {/* ⭐⭐⭐ زر الـ Approval - يظهر فقط للـ Ad Requests ⭐⭐⭐ */}
                  {post.is_ad_request && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Approval Status:</span>
                      <button
                        onClick={handleToggleApproval}
                        disabled={updating}
                        className={`
                          relative
                          inline-flex
                          h-6
                          w-11
                          items-center
                          rounded-full
                          transition-colors
                          duration-300
                          ease-in-out
                          focus:outline-none
                          focus:ring-2
                          focus:ring-blue-500
                          focus:ring-offset-2
                          dark:focus:ring-offset-gray-800
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                          ${post.is_ad_approved 
                            ? 'bg-green-600 dark:bg-green-500 shadow-lg shadow-green-200 dark:shadow-green-900' 
                            : 'bg-gray-300 dark:bg-gray-600'
                          }
                        `}
                      >
                        <span
                          className={`
                            inline-block
                            h-4
                            w-4
                            transform
                            rounded-full
                            bg-white
                            dark:bg-gray-200
                            shadow-lg
                            transition-transform
                            duration-300
                            ease-in-out
                            ${post.is_ad_approved ? 'translate-x-6' : 'translate-x-1'}
                            ${post.is_ad_approved ? 'shadow-md' : ''}
                          `}
                        />
                      </button>
                      <span className={`text-sm font-medium ${
                        post.is_ad_approved
                          ? 'text-green-600 dark:text-green-400 font-bold'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {post.is_ad_approved ? 'Approved' : 'Rejected'}
                      </span>
                      {updating && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      )}
                    </div>
                  )}

                  <div className={`px-3 py-2 rounded-full text-sm font-medium ${
                    post.is_ad_request
                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                  }`}>
                    Type: {post.is_ad_request ? 'Advertisement' : 'Regular Post'}
                  </div>
                  
                  {post.is_ad_request && post.is_ad_approved && post.ad_approved_at && (
                    <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                      Approved: {new Date(post.ad_approved_at).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm">
                    Created: {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* ⭐⭐⭐ رسالة توضيحية ⭐⭐⭐ */}
                {post.is_ad_request && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Note:</strong> This is an advertisement request. 
                      {post.is_ad_approved 
                        ? ' Approved and active for users.' 
                        : ' Rejected and hidden from users.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}