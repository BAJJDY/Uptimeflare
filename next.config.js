/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

// 暂时注释掉 Cloudflare 绑定设置，避免开发环境错误
// if (process.env.NODE_ENV === 'development') {
//   const { setupDevBindings } = require('@cloudflare/next-on-pages/next-dev')
//   setupDevBindings({
//     bindings: {
//       UPTIMEFLARE_STATE: {
//         type: 'kv',
//         id: 'UPTIMEFLARE_STATE',
//       },
//     },
//   })
// }
