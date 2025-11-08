"use client";

import AnalyticsCharts from '@/components/AnalyticsChart'
import PageLoader from '@/components/loaders/PageLoader';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useRequestStore } from '@/store/useRequestStore';
import { generateMonthlyAnalytics } from '@/utils/generateMonthlyAnalytics';

export default function Analytics() {
  const { properties, loading: loadingPrperties } = usePropertyStore();
  const { requests, loading: loadingRequest } = useRequestStore();

  const analyticsData = generateMonthlyAnalytics(properties, requests);
  
  if (loadingPrperties || loadingRequest) {
    return <PageLoader loading={(loadingPrperties || loadingRequest)} />
  }

  return (
    <div className='w-full px-3 py-8'>
      <AnalyticsCharts data={analyticsData} />
    </div>
  )
}
