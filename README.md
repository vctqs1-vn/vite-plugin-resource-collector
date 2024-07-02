# @vctqs1/vite-plugin-resource-collector

![GitHub](https://img.shields.io/github/license/vctqs1-vn/vite-plugin-resource-collector)
![npm](https://img.shields.io/npm/v/@vctqs1/vite-plugin-resource-collector)

A Vite plugin designed to help developers collect and log transpiled source files during the build process.

## Installation

You can install the plugin via npm or yarn:

```bash
npm install @vctqs1/vite-plugin-resource-collector --save-dev
```

or

```bash
yarn add @vctqs1/vite-plugin-resource-collector --dev
```

## Usage

To use the plugin, add it to your Vite configuration (`vite.config.js`):

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import resourceCollector from '@vctqs1/vite-plugin-resource-collector';

export default defineConfig({
  plugins: [
    resourceCollector({
      outputDir: 'build/raw-sources',
      mode: 'log', // or 'copy' to copy and log
    }),
  ],
});
```

### Options

- `baseDir` (optional, default: cwd()): Specifies the base directory to search for source files.
- `outputDir` (optional, default: 'build/raw-sources'): Specifies the directory where collected source files will be stored.
- `mode` (optional, default: 'log'): Specifies the mode of operation. Use `'copy'` to copy source files and `'log'` to log file paths only.
- `logType` (optional, default: 'md'): Specifies the type of log file to generate. Use `'md'`, `'csv'`, or `'json'`.

## Example

Suppose you have a Vite project with the following directory structure:

```
my-vite-project/
├── src/
│   ├── main.ts
│   └── components/
│       └── Button.ts
└── vite.config.js
```

After configuring and running Vite with this plugin, the plugin will collect transpiled source files into the specified `outputDir` directory.

When building the project, the plugin will log the following output:

```
9:47:59 PM [manabie][vite-plugin-source-collector] Collecting source files to /Users/vctqs1/Documents/developer/manabie/school-portal-admin/src/squads/payment/build/payment-sf-raw

...
...

9:48:24 PM [manabie][vite-plugin-source-collector] Collected source files to /Users/vctqs1/Documents/developer/manabie/school-portal-admin/src/squads/payment/build/payment-sf-raw/README.md
```

README.md:

```markdown
### Vite Plugin Source Collector

| # | File Name | Size (KB) |
| --- | --- | --- |
| 1 | /Users/vctqs1/Documents/developer/manabie/school-portal-admin/src/squads/payment/exports/applications/payment-sf.tsx | 11.10 |
| 2 | /Users/vctqs1/Documents/developer/manabie/school-portal-admin/src/only-for-temporary/polyfill.js | 0.37 |

```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Additional Notes:

- **Compatibility**: Ensure your Vite version is compatible with this plugin. Check compatibility in the [npm package](https://www.npmjs.com/package/@vctqs1/vite-plugin-resource-collector) or GitHub repository.
- **Contributing**: Contributions are welcome! Feel free to fork and submit pull requests.
- **Issues**: If you encounter any issues or have suggestions, please [report them](https://github.com/vctqs1-vn/vite-plugin-resource-collector/issues).
