// app/users/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
interface User {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  graduation_year: string;
  university: string;
  graduation_grade: string;
  postgraduate_degree: string;
  specialization: string | null;
  experience_years: number;
  description: string;
  experience: string | null;
  where_did_you_work: string;
  address: string;
  available_times: Array<{
    day: string;
    from: string;
    to: string;
  }>;
  skills: string[];
  profile_image: string;
  cover_image: string;
  graduation_certificate_image: string;
  cv: string;
  course_certificates_image: Array<{
    id: number;
    name: string;
    fullUrl: string;
  }>;
  is_work_assistant_university: boolean;
  assistant_university: string;
  tools: string;
  active: boolean;
  has_clinic: boolean;
  clinic_name: string;
  clinic_address: string;
  fields: Array<{
    id: number;
    name: string;
  }>;
  created_at: string;
  updated_at: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/user/${id}`);
        
        if (response.data) {
          setUser(response.data);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  // دالة لتحويل النص من snake_case إلى Title Case
  const formatLabel = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // دالة لعرض القيم بشكل منسق
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">Not specified</span>;
    }

    switch (key) {
      case 'active':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? 'Active' : 'Inactive'}
          </span>
        );
      
      case 'has_clinic':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {value ? 'Yes' : 'No'}
          </span>
        );
      
      case 'is_work_assistant_university':
        return value ? 'Yes' : 'No';
      
      case 'birth_date':
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'skills':
        return Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">No skills listed</span>
        );
      
      case 'fields':
        return Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.map((field) => (
              <span key={field.id} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                {field.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">No specializations</span>
        );
      
      case 'available_times':
        return Array.isArray(value) && value.length > 0 ? (
          <div className="space-y-1">
            {value.map((time, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{time.day}:</span> {time.from} - {time.to}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">No availability set</span>
        );
      
      case 'tools':
        try {
          const toolsArray = JSON.parse(value);
          return Array.isArray(toolsArray) && toolsArray.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {toolsArray.map((tool, index) => (
                <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                  {tool}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No tools listed</span>
          );
        } catch {
          return value;
        }
      
      case 'profile_image':
      case 'cover_image':
      case 'graduation_certificate_image':
      case 'cv':
        return value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            View File
          </a>
        ) : (
          <span className="text-gray-400">No file</span>
        );
      
      case 'course_certificates_image':
        return Array.isArray(value) && value.length > 0 ? (
          <div className="space-y-1">
            {value.slice(0, 3).map((cert) => (
              <a 
                key={cert.id}
                href={cert.fullUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline text-sm"
              >
                {cert.name}
              </a>
            ))}
            {value.length > 3 && (
              <span className="text-gray-500 text-sm">+{value.length - 3} more</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">No certificates</span>
        );
      
      default:
        return String(value);
    }
  };

  // البيانات المهمة فقط
  const importantFields = [
    // المعلومات الأساسية
    'user_name', 'first_name', 'last_name', 'email', 'phone', 'birth_date',
    
    // المعلومات التعليمية
    'graduation_year', 'university', 'graduation_grade', 'postgraduate_degree', 
    'specialization',
    
    // الخبرة العملية
    'experience_years', 'description', 'where_did_you_work',
    
    // التخصصات والمهارات
    'fields', 'skills', 'tools',
    
    // المعلومات الإضافية
    'address', 'available_times',
    
    // الحالة والعيادة
    'active', 'has_clinic', 'clinic_name', 'clinic_address',
    
    // المعلومات الأكاديمية
    'is_work_assistant_university', 'assistant_university',
    
    // الملفات
    'profile_image', 'cover_image', 'graduation_certificate_image', 
    'cv', 'course_certificates_image'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>{error}</p>
            <button
              onClick={() => router.push('/Pending_Decorator')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <button
            onClick={() => router.push('/Pending_Decorator')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout> <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/Pending_Decorator"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Users
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-2">User ID: {user.id}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Cover Image */}
          {user.cover_image && (
            <div className="h-48 bg-gray-200">
              <img
                src={user.cover_image}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Profile Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.user_name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow">
                    <span className="text-gray-600 text-lg font-medium">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600">@{user.user_name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formatValue('active', user.active)}
                  {formatValue('has_clinic', user.has_clinic)}
                </div>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {importantFields.map((field) => (
                <div key={field} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {formatLabel(field)}
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatValue(field, user[field as keyof User])}
                  </div>
                </div>
              ))}
            </div>

            {/* Description Section */}
            {user.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">{user.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div></MainLayout>
   
  );
}