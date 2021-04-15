<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# workflows-anywhere

Do you wish you could scatter `.github/workflows/` files around your monorepo?

This Action lets you, by crawling the repository and porting any discovered workflows to the root `/.github/workflows` directory where GitHub will find them.

[Example repository](https://github.com/thepwagner/workflows-anywhere-example)

## Sample

```yaml
name: 'update workflows'
on:
  push:
    paths:
      - "**/.github/workflows/*.yml"
      - "**/.github/workflows/*.yaml"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        token: ${{ secrets.MY_GITHUB_PAT }} # A Personal Access Token is required to push workflow files
    - uses: thepwagner/workflows-anywhere@main

    # Commit and push
    - run: |
       git config --global user.email "noreply@github.com"
       git config --global user.name "workflows-anywhere"
       git add .github/workflows
       git commit -m'remapped workflows' --allow-empty
       git push
```
