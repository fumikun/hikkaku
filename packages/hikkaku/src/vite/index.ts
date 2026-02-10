import { createServerModuleRunner, type PluginOption } from 'vite'
import type { ModuleRunner } from 'vite/module-runner'
import type { Project } from '../core'

const BASE_URL = 'https://scratchfoundation.github.io/scratch-gui/'

export interface HikkakuViteInit {
  entry: string
}
export default function hikkaku(init: HikkakuViteInit): PluginOption {
  let runner: ModuleRunner | null = null

  return {
    name: 'vite-plugin-hikkaku',
    config() {
      return {
        environments: {
          hikkaku: {},
          client: {},
        },
      }
    },
    resolveId(source) {
      if (source === '/@virtual/hikkaku-client') {
        return source
      }
    },
    load(id) {
      if (id === '/@virtual/hikkaku-client') {
        return `
          import 'hikkaku/client'
        `
      }
    },
    async hotUpdate(options) {
      if (this.environment.name !== 'hikkaku') return
      if (!runner) {
        throw new Error('Module runner is not initialized.')
      }
      const project: Project = (await runner.import(options.file)).default
      options.server.environments.client.hot.send(
        'hikkaku:project',
        project.toScratch(),
      )
    },
    async configureServer(server) {
      const hikkakuEnv = server.environments.hikkaku
      if (!hikkakuEnv) {
        throw new Error('Hikkaku environment is not configured.')
      }
      await hikkakuEnv.transformRequest(init.entry)
      //server.watcher.add(init.entry)
      runner = createServerModuleRunner(hikkakuEnv)
      server.environments.client.hot.on('vite:client:connect', async () => {
        if (!runner) {
          throw new Error('Module runner is not initialized.')
        }
        const project: Project = (await runner.import(init.entry)).default
        server.environments.client.hot.send(
          'hikkaku:project',
          project.toScratch(),
        )
      })

      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/') {
          const html = (await fetch(BASE_URL).then((res) => res.text()))
            .replace(
              'gui.js',
              'https://scratchfoundation.github.io/scratch-gui/gui.js',
            )
            .replace(
              '</head>',
              '<script src="/@vite/client" type="module"></script><script type="module" src="/@virtual/hikkaku-client"></script></head>',
            )
          res.setHeader('Content-Type', 'text/html')
          res.end(html)
          return
        }
        if (
          req.url?.startsWith('/static/') ||
          req.url?.startsWith('/js/') ||
          req.url?.startsWith('/css/') ||
          req.url?.startsWith('/svgs') ||
          req.url?.startsWith('/images/') ||
          req.url?.startsWith('/session/') ||
          req.url === '/common.css' ||
          req.url === '/projects.css'
        ) {
          const url = new URL(req.url.slice(1), BASE_URL)
          const response = await fetch(url.toString())
          if (!response.ok) {
            res.statusCode = response.status
            res.end(`Error fetching ${url}: ${response.statusText}`)
            return
          }
          res.setHeader(
            'Content-Type',
            response.headers.get('content-type') || 'application/octet-stream',
          )
          res.end(new Uint8Array(await response.arrayBuffer()))
          return
        }
        next()
      })
    },
  }
}
