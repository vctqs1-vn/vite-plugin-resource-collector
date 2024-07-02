import fs from "node:fs";
import path from "node:path";
import { type Plugin, createLogger } from "vite";

export type VitePluginResourceCollectorOptions = {
    outputDir?: string;
    baseDir?: string;
    mode?: "copy" | "log";
    logType?: "md" | "csv" | "json";
};

function cyan(text: string) {
    return `\u001b[36m${text}\u001b[39m`;
}

export default function vitePluginResourceCollector(options: VitePluginResourceCollectorOptions): Plugin {
    const { outputDir = "build", baseDir = process.cwd(), mode = "log", logType = "md" } = options;
    const logger = createLogger("info", {
        prefix: "[vite-plugin-source-collector]",
    });

    return {
        name: "vite-plugin-source-collector",
        enforce: "pre",
        apply: "build",
        async config(config) {
            config.customLogger = logger;
            config.logLevel = "info";
        },
        buildStart() {
            logger.info(`Collecting source files to ${cyan(outputDir)}`, {
                timestamp: true,
            });
            fs.mkdirSync(outputDir, { recursive: true });
        },

        async transform(_code, id) {
            // Collect files that are transpiled by Vite
            this.addWatchFile(id);
        },

        async generateBundle() {
            const resolvedBaseDir = path.resolve(baseDir);

            const fileName = path.join(
                resolvedBaseDir,
                `${outputDir}/README.${logType}`.replace(baseDir, "")
            );

            const preservedFiles = new Set<string>();

            const loopFile = (filePath: string) => {
                if (!preservedFiles.has(filePath) && fs.existsSync(filePath)) {
                    const destPath = path.join(outputDir, filePath.replace(baseDir, ""));

                    if (mode === "copy") {
                        const content = fs.readFileSync(filePath, "utf-8");
                        fs.mkdirSync(path.dirname(destPath), { recursive: true });
                        fs.writeFileSync(destPath, content);
                    }
                    preservedFiles.add(filePath);
                }
            };

            // Iterate over all the files Vite processed
            for (const id of this.getModuleIds()) {
                if (id.includes("node_modules")) {
                    continue;
                }

                // Skip files with null bytes in the path
                if (id.includes("\x00")) {
                    continue;
                }
                loopFile(id);
            }

            // Generate the README.md file
            fs.mkdirSync(path.dirname(fileName), { recursive: true });
            switch (logType) {
                case "md":
                    generateMarkdownFile({
                        fileName,
                        preservedFiles,
                        baseDir,
                    });
                    break;
                case "csv":
                    generateCSVFile({
                        fileName,
                        preservedFiles,
                        baseDir,
                    });
                    break;
                case "json":
                    generateJSONFile({
                        fileName,
                        preservedFiles,
                        baseDir,
                    });
                    break;
            }

            logger.info(`Collected source files to ${cyan(fileName)}`, {
                timestamp: true,
            });
        },
    };
}
function generateMarkdownFile({
    fileName,
    preservedFiles,
}: {
    fileName: string;
    preservedFiles: Set<string>;
    baseDir: string;
}) {
    let content = `### Vite Plugin Source Collector\n\n`;
    content += `| # | File Name | Size (KB) |\n`;
    content += `| --- | --- | --- |\n`;

    let index = 1;
    for (const filePath of preservedFiles) {
        const stats = fs.statSync(filePath);
        const size = stats.size / 1024;
        content += `| ${index++} | ${filePath} | ${size.toFixed(2)} |\n`;
    }

    fs.writeFileSync(fileName, content);
}

function generateCSVFile({
    fileName,
    preservedFiles,
}: {
    fileName: string;
    preservedFiles: Set<string>;
    baseDir: string;
}) {
    let content = `No,File Name,Size (KB)\n`;
    content += `---,---,---\n`;

    let index = 1;
    for (const filePath of preservedFiles) {
        const stats = fs.statSync(filePath);
        const size = stats.size / 1024;
        content += `${index++},${filePath},${size.toFixed(2)}\n`;
    }

    fs.writeFileSync(fileName, content);
}

function generateJSONFile({
    fileName,
    preservedFiles,
}: {
    fileName: string;
    preservedFiles: Set<string>;
    baseDir: string;
}) {
    const content: Record<string, number> = {};

    for (const filePath of preservedFiles) {
        const stats = fs.statSync(filePath);
        const size = stats.size / 1024;
        content[filePath] = size;
    }

    fs.writeFileSync(fileName, JSON.stringify(content, null, 2));
}
