import globby from 'globby'
import * as yaml from 'js-yaml'

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
    this.parsed = yaml.load(body)
  }

  /** Return any triggers that can be filtered by path */
  get pathTriggers(): string[] {
    const {on} = this.parsed
    return on
  }
}
