// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { TrendingUp, Filter } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/Card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Area, AreaChart, ResponsiveContainer } from "recharts";

interface ReportData {
  totals: {
    active_users: number;
    pending_users: number;
    jobs: number;
    rents: number;
    sales: number;
    products: number;
  };
  monthly: {
    users_active: { data: Array<{ month: string; count: number }>; total: number };
    users_pending: { data: Array<{ month: string; count: number }>; total: number };
    jobs: { data: Array<{ month: string; count: number }>; total: number };
    rents: { data: Array<{ month: string; count: number }>; total: number };
    sales: { data: Array<{ month: string; count: number }>; total: number };
    products: { data: Array<{ month: string; count: number }>; total: number };
  };
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState<number>(6);

  const primaryColor = "#039fb3";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await apiFetch("/reports");
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchReportData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-[#039fb3] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-700 dark:text-gray-300">Checking your login status...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-[#039fb3] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  const prepareChartData = (data: Array<{ month: string; count: number }>) => {
    return data.slice(-selectedMonths);
  };

  const allMonths = reportData?.monthly.users_active.data.map(item => item.month) || [];

  const lineChartConfig = {
    count: {
      label: "Count",
      color: primaryColor,
    },
  } satisfies ChartConfig;

  const barChartConfig = {
    active: {
      label: "Active",
      color: primaryColor,
    },
    pending: {
      label: "Pending",
      color: "#f59e0b",
    },
  } satisfies ChartConfig;

  const radarChartConfig = {
    count: {
      label: "Count",
      color: primaryColor,
    },
  } satisfies ChartConfig;

  const areaChartConfig = {
    count: {
      label: "Count",
      color: primaryColor,
    },
  } satisfies ChartConfig;

  // Chart Components مع تحسينات الرؤية
  const ChartLineDots = ({ data, title, description, total }: { 
    data: Array<{ month: string; count: number }>, 
    title: string, 
    description: string,
    total: number 
  }) => {
    const chartData = prepareChartData(data);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineChartConfig}>
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="currentColor" 
                strokeOpacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'currentColor', fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="count"
                type="monotone"
                stroke={`var(--color-count)`}
                strokeWidth={3}
                dot={{
                  fill: `var(--color-count)`,
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#fff'
                }}
                activeDot={{
                  r: 7,
                  stroke: '#fff',
                  strokeWidth: 2,
                  fill: `var(--color-count)`,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Last {selectedMonths} months <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            {chartData.filter(item => item.count > 0).length} months with data
          </div>
        </CardFooter>
      </Card>
    );
  };

  const ChartBarMultiple = ({ data1, data2, title, description, total1, total2 }: { 
    data1: Array<{ month: string; count: number }>, 
    data2: Array<{ month: string; count: number }>,
    title: string, 
    description: string,
    total1: number,
    total2: number
  }) => {
    const chartData1 = prepareChartData(data1);
    const chartData2 = prepareChartData(data2);
    
    const combinedData = chartData1.map((item, index) => ({
      month: item.month,
      active: item.count,
      pending: chartData2[index]?.count || 0
    }));

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex gap-4">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{total1}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{total2}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig}>
            <BarChart 
              data={combinedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="currentColor" 
                strokeOpacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'currentColor', fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar 
                dataKey="active" 
                fill="var(--color-active)" 
                stroke="var(--color-active)"
                strokeWidth={1}
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="pending" 
                fill="var(--color-pending)" 
                stroke="var(--color-pending)"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Comparison view <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Last {selectedMonths} months comparison
          </div>
        </CardFooter>
      </Card>
    );
  };

  const ChartRadarGridFill = ({ data, title, description, total }: { 
    data: Array<{ month: string; count: number }>, 
    title: string, 
    description: string,
    total: number 
  }) => {
    const chartData = prepareChartData(data);
    
    // حساب القيم القصوى للرادار تشارت
    const maxValue = Math.max(...chartData.map(item => item.count)) * 1.2;
    
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-center flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={radarChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadarChart 
              data={chartData}
              margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarGrid 
                stroke="currentColor" 
                strokeOpacity={0.3}
              />
              <PolarAngleAxis 
                dataKey="month" 
                tick={{ 
                  fill: 'currentColor', 
                  fontSize: 11,
                  fontWeight: 500 
                }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, maxValue]}
                tick={{ 
                  fill: 'currentColor', 
                  fontSize: 10 
                }}
              />
              <Radar
                name="Products"
                dataKey="count"
                stroke={`var(--color-count)`}
                strokeWidth={2}
                fill={`var(--color-count)`}
                fillOpacity={0.4}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Distribution <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground flex items-center gap-2 leading-none">
            Last {selectedMonths} months
          </div>
        </CardFooter>
      </Card>
    );
  };

  const ChartAreaStacked = ({ data, title, description, total }: { 
    data: Array<{ month: string; count: number }>, 
    title: string, 
    description: string,
    total: number 
  }) => {
    const chartData = prepareChartData(data);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaChartConfig}>
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="currentColor" 
                strokeOpacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'currentColor', fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Area
                dataKey="count"
                type="monotone"
                stroke={`var(--color-count)`}
                strokeWidth={3}
                fill={`var(--color-count)`}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Area trends <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Last {selectedMonths} months trend
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
                          Here&apos;s what&apos;s happening with your platform today.

            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by months:
              </span>
            </div>
            <div className="flex gap-2">
              {[3, 6, 12].map((months) => (
                <button
                  key={months}
                  onClick={() => setSelectedMonths(months)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMonths === months
                      ? 'bg-[#039fb3] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Last {months} months
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-[#039fb3]">{reportData?.totals.active_users || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Users</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-[#f59e0b]">{reportData?.totals.pending_users || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Users</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-[#10b981]">{reportData?.totals.jobs || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Jobs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-[#8b5cf6]">{reportData?.totals.rents || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rentals</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-[#ef4444]">{reportData?.totals.sales || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sales</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-[#06b6d4]">{reportData?.totals.products || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Products</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartLineDots 
            data={reportData?.monthly.users_active.data || []}
            title="User Growth Trend"
            description="Active users growth over time"
            total={reportData?.monthly.users_active.total || 0}
          />

          <ChartBarMultiple 
            data1={reportData?.monthly.users_active.data || []}
            data2={reportData?.monthly.users_pending.data || []}
            title="Users Comparison"
            description="Active vs Pending users comparison"
            total1={reportData?.monthly.users_active.total || 0}
            total2={reportData?.monthly.users_pending.total || 0}
          />

          <ChartRadarGridFill 
            data={reportData?.monthly.products.data || []}
            title="Products Distribution"
            description="Products performance across months"
            total={reportData?.monthly.products.total || 0}
          />

          <ChartAreaStacked 
            data={reportData?.monthly.jobs.data || []}
            title="Jobs Trend"
            description="Job postings trend over time"
            total={reportData?.monthly.jobs.total || 0}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Totals</CardTitle>
              <CardDescription>Summary of monthly data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Users (Monthly)</span>
                  <span className="font-bold text-gray-900 dark:text-white">{reportData?.monthly.users_active.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Pending Users (Monthly)</span>
                  <span className="font-bold text-gray-900 dark:text-white">{reportData?.monthly.users_pending.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Jobs (Monthly)</span>
                  <span className="font-bold text-gray-900 dark:text-white">{reportData?.monthly.jobs.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Products (Monthly)</span>
                  <span className="font-bold text-gray-900 dark:text-white">{reportData?.monthly.products.total || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Overview</CardTitle>
              <CardDescription>Current platform statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Months Tracked</span>
                  <span className="font-bold text-gray-900 dark:text-white">{allMonths.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Months with Data</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {allMonths.filter(month => 
                      reportData?.monthly.users_active.data.find(m => m.month === month)?.count || 0 > 0
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Current View</span>
                  <span className="font-bold text-gray-900 dark:text-white">Last {selectedMonths} months</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}