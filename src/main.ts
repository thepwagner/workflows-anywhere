import * as core from '@actions/core'
import {listWorkflows} from './workflow'

async function run(): Promise<void> {
  try {
    // Find workflow files in the repository:
    const workflows = await listWorkflows('.')
    core.info(workflows.join('\n'))
    // Map each to the real workflow directory:

    // Find mapped workflows that no longer exist:
    // Delete each:
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
