# Open Panda Frontend

See the main repo readme for the most up-to-date documentation on running this project as a static site.

## Storybook

### _Note: (Storybook is deprecated)_

To better display the components available on the site, their properties, and the states they might appear in, a Storybook app is included in this repo.

- Each component that's developed must have its own story
- Use `npm run storybook` to run Storybook locally
- Or `npm run storybook-build` to generate a static Storybook UI website
- Storybook automatically deploys to [https://data-preservation-programs.github.io/open-panda](https://data-preservation-programs.github.io/open-panda) using Github pages. The static build is stored in `docs` branch under `docs` folder