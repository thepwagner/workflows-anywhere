import {listWorkflows, Workflow} from '../src/workflow'

const testRepoPath = '__tests__/testdata/repo'
const testWorkflowPath = 'test/.github/workflows/test.yaml'

describe('listWorkflows', () => {
  it('should list all workflows', async () => {
    const workflows = await listWorkflows(testRepoPath)
    expect(workflows.sort()).toEqual([
      `${testRepoPath}/bar/.github/workflows/bar.yml`,
      `${testRepoPath}/foo/.github/workflows/foo.yaml`
    ])
  })
})

describe('Workflow', () => {
  describe('#pathTriggers', () => {
    function expectPathTriggers(workflow: string, triggers: string[]) {
      const wf = new Workflow(testWorkflowPath, workflow)
      expect(wf.pathTriggers).toEqual(triggers)
    }
    it('should parse string triggers', () => {
      expectPathTriggers(`on: push`, ['push'])
      expectPathTriggers(`on: pull_request`, ['pull_request'])
      expectPathTriggers(`on: issue_comment`, [])
    })

    it('should parse array triggers', () => {
      expectPathTriggers(`on: [push]`, ['push'])
      expectPathTriggers(`on: ["push"]`, ['push'])
      expectPathTriggers(`on: ['push']`, ['push'])
      expectPathTriggers(`on: [pull_request]`, ['pull_request'])
      expectPathTriggers(`on: [push, pull_request]`, ['push', 'pull_request'])
      expectPathTriggers(`on: [push, issue_comment]`, ['push'])
    })

    it('should parse object triggers', () => {
      expectPathTriggers(`on:\n  push:\n`, ['push'])
      expectPathTriggers(`on:\n  push:\n    branches: main\n`, ['push'])
      expectPathTriggers(`on:\n  issue_comment:\n`, [])
    })
  })

  describe('#mappedPath', () => {
    it('should return mapped path', () => {
      const wf = new Workflow(testWorkflowPath, 'on: push')
      expect(wf.mappedPath).toEqual('test_test.yaml')
    })
  })
})
