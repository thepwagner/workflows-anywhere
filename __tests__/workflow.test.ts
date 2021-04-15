import {listWorkflows} from "../src/workflow"

const testRepoPath = "__tests__/testdata/repo"

describe("listWorkflows", () => {
  it("should list all workflows", async () => {
    const workflows = await listWorkflows(testRepoPath)
    expect(workflows.sort()).toEqual([
      `${testRepoPath}/bar/.github/workflows/bar.yml`,
      `${testRepoPath}/foo/.github/workflows/foo.yaml`,
    ])
  })
})