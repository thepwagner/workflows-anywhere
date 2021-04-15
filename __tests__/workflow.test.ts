import { listWorkflows, Workflow } from "../src/workflow"

const testRepoPath = "__tests__/testdata/repo"
const testWorkflowPath = "test/.github/workflows/test.yaml"

describe("listWorkflows", () => {
  it("should list all workflows", async () => {
    const workflows = await listWorkflows(testRepoPath)
    expect(workflows.sort()).toEqual([
      `${testRepoPath}/bar/.github/workflows/bar.yml`,
      `${testRepoPath}/foo/.github/workflows/foo.yaml`,
    ])
  })
})

describe("Workflow", () => {
  describe("#pathTriggers", () => {
    it("should parse simple workflow", () => {
      const wf = new Workflow("testWorkflowPath", `on: [push]`)
      expect(wf.pathTriggers).toEqual(["push"])
    })
  })
})