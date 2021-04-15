import * as core from '@actions/core'
import {listWorkflows, loadWorkflow} from './workflow'
import {promises as fs} from 'fs'

async function run(): Promise<void> {
  try {
    // Find workflow files in the repository:
    const paths = await listWorkflows('.')
    core.info(`Found ${paths.length} workflows`)

    // Map each to the real workflow directory:
    for (const path of paths) {
      const wf = await loadWorkflow(path)
      if (wf.pathTriggers.length === 0) {
        continue
      }
      core.info(`Mapping workflow ${path}...`)

      await fs.writeFile(`.github/workflows/${wf.mappedPath}`, `TODO:`)
    }

    // Find mapped workflows that no longer exist:
    // Delete each:
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
