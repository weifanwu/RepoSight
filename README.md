# Repo Reader

## Description

Repo Reader is a web application built with **Next.js** that allows users to upload a folder, convert its structure into a JSON format, and visualize the structure using **ReaFlow**. ReaFlow is a visualization tool that helps to render the folder structure dynamically. This app is ideal for users who want to analyze and visualize their project directory structures for better understanding or project management.

### Features:
1. **Upload Folders**: Allows users to upload folders to the application.
2. **Convert Folder Structure to JSON**: Converts the folder structure into a JSON format for easy manipulation and analysis.
3. **Render JSON using ReaFlow**: Renders the JSON representation of the folder structure using ReaFlow for visualization.

## Development Tools:

- **Repo Virtualization Tool**: [ReaFlow](https://reaflow.dev/?ref=jsoncrack.com)
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

### Steps to Run the App:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo-name/repo-reader.git
   cd repo-reader
   ```

2. **Install dependencies**:

   Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

   Or, if you're using Yarn:

   ```bash
   yarn install
   ```

3. **Run the application**:

   To start the development server, use the following command:

   ```bash
   npm run dev
   ```

   Or with Yarn:

   ```bash
   yarn dev
   ```

   The application will now be available at:

   ```
   http://localhost:3000
   ```

4. **Upload a Folder**:

   - Go to the main page of the app.
   - Use the upload functionality to select and upload a folder from your local machine.
   - The app will process the folder structure and display it in JSON format.

5. **Visualize the Folder Structure**:

   After uploading the folder and converting the structure into JSON, the app will render the structure dynamically using **ReaFlow**.

## Troubleshooting

- If you encounter issues related to the Node.js version, make sure to check your version using:

  ```bash
  node -v
  ```

  If the version is incorrect, switch to the correct one using `nvm`.

- If there are any missing dependencies or build issues, try deleting `node_modules` and the `package-lock.json` file, then reinstall the dependencies:

  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## Contributing

If you'd like to contribute to the development of Repo Reader, feel free to fork the repository and create a pull request. Please make sure to follow the standard JavaScript and Next.js best practices.