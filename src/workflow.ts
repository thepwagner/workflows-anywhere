import globby from 'globby'
import * as yaml from 'js-yaml'
import {promises as fs} from 'fs'

export async function listWorkflows(root: string): Promise<string[]> {
  let workflows: string[] = []

  // XXX: this is not good; maybe refactor to a reduce()?
  const patterns = [
    `${root}/**/.github/workflows/*.yml`,
    `${root}/**/.github/workflows/*.yaml`
  ]
  for (const pattern of patterns) {
    const paths = await globby(pattern, {gitignore: true})
    workflows = workflows.concat(
      paths
        .map(path => path.toString())
        .filter(path => !path.startsWith(`${root}/.github/workflows`))
        .filter(path => !path.startsWith(`.github/workflows`))
    )
  }
  return workflows
}

export class Workflow {
  private readonly parsed: any

  constructor(private readonly path: string, body: string) {
    this.parsed = yaml.load(body) || {}
  }

  /** Return any triggers that can be filtered by path */
  get pathTriggers(): string[] {
    const {on} = this.parsed
    if (isPathEvent(on)) {
      return [on]
    }
    if (on instanceof Array) {
      return on.filter(isPathEvent)
    }
    if (on instanceof Object) {
      return Object.keys(on).filter(isPathEvent)
    }

    return []
  }

  /** Returns filename for usage in /.github/workflows/ */
  get mappedPath(): string {
    const split = this.path.split('/.github/workflows/')
    return `${split[0].replace(/\//g, '_')}_${split[1]}`
  }
}

export async function loadWorkflow(path: string): Promise<Workflow> {
  const data = await fs.readFile(path, {encoding: 'utf8'})
  return new Workflow(path, data)
}

function isPathEvent(event: string): boolean {
  return event === 'push' || event === 'pull_request'
}
