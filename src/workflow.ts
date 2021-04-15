import globby from 'globby'
import * as yaml from 'js-yaml'
import * as path from 'path'
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
        .map(p => p.toString())
        .filter(p => !p.startsWith(`${root}/.github/workflows`))
        .filter(p => !p.startsWith(`.github/workflows`))
    )
  }
  return workflows
}

export class Workflow {
  private readonly parsed: any

  constructor(private readonly fn: string, body: string) {
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
    const split = this.fn.split('/.github/workflows/')
    return `${split[0].replace(/\//g, '_')}_${split[1]}`
  }

  get mappedContent(): string {
    const {on} = this.parsed

    if (isPathEvent(on)) {
      return this.replaceTriggers([on])
    }
    if (on instanceof Array) {
      return this.replaceTriggers(on.filter(isPathEvent))
    }

    return ''
  }

  private replaceTriggers(triggers: string[]): string {
    const clone = Object.assign({}, this.parsed)
    clone['on'] = triggers.reduce((on: any, trigger) => {
      on[trigger] = {paths: [this.relPath()]}
      return on
    }, {})

    return yaml.dump(clone, {noCompatMode: true})
  }

  private relPath(): string {
    return path.join(this.fn.replace(/.github\/workflows\/.*/, ''), '**')
  }
}

export async function loadWorkflow(fn: string): Promise<Workflow> {
  const data = await fs.readFile(fn, {encoding: 'utf8'})
  return new Workflow(fn, data)
}

function isPathEvent(event: string): boolean {
  return event === 'push' || event === 'pull_request'
}
