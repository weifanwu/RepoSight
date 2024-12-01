# RepoSight

This RepoSight provides a user-friendly way to explore large GitHub repositories, enabling developers to quickly understand the structure and purpose of the codebase. It combines interactive visualization and AI-assisted summaries to make onboarding easier for new developers.

## Features
- **Repo Visualization**: View a graphical representation of the repository using React Flow.
- **AI Summaries**: Click on folder names to get instant AI-generated summaries of their contents.
- **Quick Navigation**: Simplifies exploring complex repository structures.

## Built With
- **React Flow**: For interactive repository visualization.
- **Next.js**: As the main framework.
- **Node.js**: Requires Node.js v21.5.0.

## Development Tools:

- **Repo Virtualization Tool**: [React Flow](https://reactflow.dev/)
- **Framework**: [Next.js](https://nextjs.org/)
- **Node.js Version**: v21.5.0

## Setup & Installation

Follow these steps to set up and run the Repo Reader application:

### Prerequisites

1. **Node.js**: The application requires Node.js v21.5.0. To ensure you're using the correct version of Node.js, install it from [here](https://nodejs.org/) or use **nvm** (Node Version Manager) to manage your Node.js versions.

   To install Node.js v21.5.0 using **nvm**:

   ```bash
   nvm install 21.5.0
   nvm use 21.5.0
   ```

2. **Yarn (Optional)**: You can use Yarn as an alternative to npm if you prefer. Install it from [here](https://yarnpkg.com/getting-started/install).

## Installation

> **Note**: This project requires the `--legacy-peer-deps` flag when installing dependencies due to compatibility issues.

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git  
   cd <repo-name>
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to view the application in your browser.

## How to Contribute

We welcome contributions to enhance the functionality of this project! Follow the steps below to get started.

1. Fork the repository

Start by forking the repository to your own GitHub account.

2. Create a new branch for your feature or bug fix

Once you've forked the repository, create a new branch for your changes:

```bash
git checkout -b <feature-branch-name>
```

3. Commit your changes with a clear message

After making your changes, commit them with a clear and concise message that describes what you've done:

```bash
git commit -m "Description of changes"
```

4. Push to your branch

Push your changes to the newly created branch on your forked repository:

```bash
git push origin <feature-branch-name>
```

## Contributing Guidelines: Issue Priority Levels

1. **P0 (Critical)**
- **Definition**: Requires **immediate action** due to major disruptions or system outages.
- **Impact**: May result in severe downtime, data loss, or critical functionality being unusable.

2. **P1 (High)**
- **Definition**: Significant issues needing **urgent attention** but not as critical as P0.
- **Impact**: Can affect user experience or project timelines but do not cause immediate system failure.

3. **P2 (Medium)**
- **Definition**: Important issues that should be resolved but can wait until higher-priority items are addressed.
- **Impact**: Affects functionality but does not halt overall progress.

4. **P3 (Low)**
- **Definition**: Minor issues with little impact on the overall functionality of the software.
- **Impact**: Can be scheduled for future releases without major disruption.

5. **P4 (Negligible)**
- **Definition**: Issues with minimal impact on users or functionality, often deferred to the backlog.
- **Impact**: Low priority and considered only when time permits.

If you'd like to contribute to the development of Repo Reader, feel free to fork the repository and create a pull request. If you have some new ideas, you can also create new issues and dicuss with other developers. Please make sure to follow the standard JavaScript and Next.js best practices.
