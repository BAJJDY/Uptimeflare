import Head from 'next/head'

import { Inter } from 'next/font/google'
import { MonitorTarget } from '@/types/config'
import { maintenances, pageConfig, workerConfig } from '@/uptime.config'
import OverallStatus from '@/components/OverallStatus'
import MonitorList from '@/components/MonitorList'
import Header from '@/components/Header'
import { Center, Text } from '@mantine/core'
import MonitorDetail from '@/components/MonitorDetail'
import Footer from '@/components/Footer'
import { useTranslation, Trans } from 'react-i18next'
import { CompactedMonitorStateWrapper, getFromStore } from '@/worker/src/store'
import { useEffect, useState } from 'react'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

export default function Home({
  compactedStateStr,
  monitors,
}: {
  compactedStateStr: string
  monitors: MonitorTarget[]
  tooltip?: string
  statusPageLink?: string
}) {
  const { t } = useTranslation('common')
  let state = new CompactedMonitorStateWrapper(compactedStateStr).uncompact()
  const [isUp, setIsUp] = useState(true)

  // Check if all monitors are up
  useEffect(() => {
    if (state.lastUpdate > 0) {
      const allUp = state.overallDown === 0
      setIsUp(allUp)
    }
  }, [state])

  // Specify monitorId in URL hash to view a specific monitor (can be used in iframe)
  const monitorId = window.location.hash.substring(1)
  if (monitorId) {
    const monitor = monitors.find((monitor) => monitor.id === monitorId)
    if (!monitor || !state) {
      return <Text fw={700}>{t('Monitor not found', { id: monitorId })}</Text>
    }
    return (
      <div style={{ maxWidth: '810px' }}>
        <MonitorDetail monitor={monitor} state={state} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageConfig.title}</title>
        <link rel="icon" href={isUp ? (pageConfig.favicon ?? '/favicon.ico') : '/favicon-error.ico'} />
      </Head>

      <main className={inter.className}>
        <Header />

        {state.lastUpdate === 0 ? (
          <Center>
            <Text fw={700}>{t('Monitor State not defined')}</Text>
          </Center>
        ) : (
          <div>
            <OverallStatus state={state} monitors={monitors} maintenances={maintenances} />
            <MonitorList monitors={monitors} state={state} />
          </div>
        )}

        <Footer />
      </main>
    </>
  )
}

export async function getServerSideProps() {
  // Read state as string from storage, to avoid hitting server-side cpu time limit
  const compactedStateStr = await getFromStore(process.env as any, 'state')

  // Only present these values to client
  const monitors = workerConfig.monitors.map((monitor) => {
    const result: any = {
      id: monitor.id,
      name: monitor.name,
    }
    
    // 只添加定义了的属性，避免 undefined 值
    if (monitor.tooltip !== undefined) {
      result.tooltip = monitor.tooltip
    }
    
    if (monitor.statusPageLink !== undefined) {
      result.statusPageLink = monitor.statusPageLink
    }
    
    if (monitor.hideLatencyChart !== undefined) {
      result.hideLatencyChart = monitor.hideLatencyChart
    }
    
    return result
  })

  return { props: { compactedStateStr, monitors } }
}
