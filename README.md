# Tsxtension

`tsxtension` is a package designed to help developers create configurations for Chrome extension projects efficiently. This tool simplifies the process of setting up and managing Chrome extension manifest files and other related assets.

## Features

- Simplifies Chrome extension manifest creation
- Supports various configuration options for background scripts, action settings, content scripts, and more
- Integrates easily with assets like images and CSS modules

## Installation

To install `tsxtension`, run:

```bash
npm install tsxtension
```

## Example Directory Structure

Here's an example directory structure for a project using `tsxtension`:

```plaintext
src/
  @types/
  action/
    index.html
    index.tsx
    main.module.css
  assets/
    logo.jpg
  background/
    service-worker.ts
  content/
    scripts/
      contentScript1.ts
      contentScript2.ts
  config.ts
package-lock.json
package.json
tsconfig.json
```

## Example Configuration

To use `tsxtension` in your project, import it and create a configuration file:

```typescript
import logo from "./src/assets/logo.jpg";
import { Config } from "tsxtension";

export const config: Config = {
    name: "my_extension",
    srcDirectory: "src",
    background: {
        serviceWorker: "background/service-worker.js",
    },
    icons: {
        "16": logo,
    },
    action: {
        directory: "action",
        entrypoint: "index.js",
        defaultIcons: {
            "64": logo
        },
        defaultTitle: "My Extension",
        defaultPopup: "index.html",
    },
    contentScripts: [
        {
            matches: ["https://github.com/*"],
            js: ["content/scripts/contentScript1.js", "content/scripts/contentScript2.js"],
        },
    ],
    manifestVersion: 3,
    version: "1.0.0"
};
```

## Usage

This is how you can call this package:

```json
"scripts": {
  "dev": "tsxtension src/config.ts dist --watch",
  "build": "tsxtension src/config.ts dist"
}
```

### Explanation

- `src/config.ts`: This is the entry point configuration file for `tsxtension`.
- `dist`: This is the output directory where the built files will be placed.
- `--watch`: This flag enables watch mode, which monitors the files for changes and automatically rebuilds the project when changes are detected.