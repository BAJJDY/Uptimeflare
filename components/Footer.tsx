import { Divider } from '@mantine/core'
import { pageConfig } from '@/uptime.config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const defaultFooter =
    `<p style="text-align: center; font-size: 12px; margin-top: 10px;"> 由 <a href="https://github.com/lyc8503/UptimeFlare" target="_blank">Uptimeflare</a> 强力驱动 © ${currentYear} </p>`

  return (
    <>
      <Divider mt="lg" />
      <div dangerouslySetInnerHTML={{ __html: pageConfig.customFooter ?? defaultFooter }} />
    </>
  )
}
