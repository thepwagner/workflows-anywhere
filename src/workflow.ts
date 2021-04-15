import globby from 'globby'

export async function listWorkflows(root: string): Promise<string[]> {
  let workflows: string[] = []

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
