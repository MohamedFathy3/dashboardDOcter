import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.TARGET_API || 'https://api.pyramidsfreight.com/api';

async function proxyRequest(
  method: string,
  endpoint: string,
  body?: Record<string, string | number>,
  request?: NextRequest
) {
  const url = `${baseUrl}/${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // استخراج التوكن من الكوكيز - بدون فك تشفير مزدوج
  const cookies = request?.headers.get('cookie') || '';
  console.log('🍪 Raw cookies:', cookies);
  
  const tokenMatch = cookies.match(/token=([^;]+)/);
  if (tokenMatch) {
    // فك تشفير URL مرة واحدة فقط - استخدام const بدلاً من let
    const token = decodeURIComponent(tokenMatch[1]);
    console.log('🔐 Decoded token:', token);
    
    headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Setting Authorization header with token');
  } else {
    console.log('❌ No token found in cookies');
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    fetchOptions.body = JSON.stringify(body);
  }

  console.log('🚀 Proxying request to:', url);
  console.log('📋 Headers:', headers);

  const response = await fetch(url, fetchOptions);
  
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  return { response, data };
}

// POST - أصلح حفظ التوكن
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const body = await request.json();

  const { response, data } = await proxyRequest('POST', endpoint, body, request);

  const res = NextResponse.json(data, { status: response.status });

  // إذا كان طلب تسجيل دخول ناجح
  if (endpoint === 'admin/login' && response.ok && data && data.token) {
    console.log('✅ Login Successful. Raw token:', data.token);
    
    // حفظ التوكن بدون تشفير مزدوج
    const tokenValue = data.token; // لا تستخدم encodeURIComponent هنا
    
    res.cookies.set({
      name: 'token',
      value: tokenValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('🍪 Token saved in cookies (raw):', tokenValue.substring(0, 20) + '...');
  }

  return res;
}

// GET وأساليب أخرى تبقى كما هي
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');

  const { response, data } = await proxyRequest('GET', endpoint, undefined, request);
  return NextResponse.json(data, { status: response.status });
}

// PATCH
export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const body = await request.json();

  const { response, data } = await proxyRequest('PATCH', endpoint, body, request);
  return NextResponse.json(data, { status: response.status });
}

// PUT
export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const body = await request.json();

  const { response, data } = await proxyRequest('PUT', endpoint, body, request);
  return NextResponse.json(data, { status: response.status });
}

// DELETE
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');

  let body = undefined;
  try {
    body = await request.json();
  } catch {
    // No body - هذا طبيعي، إزالة المتغير غير المستخدم
  }

  const { response, data } = await proxyRequest('DELETE', endpoint, body, request);
  return NextResponse.json(data, { status: response.status });
}