import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    // Find workflow files in the repository:
    // Map each to the real workflow directory:

    // Find mapped workflows that no longer exist:
    // Delete each:
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
