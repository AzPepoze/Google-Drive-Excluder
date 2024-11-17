const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");

/**
 * Recursively find and symlink all "node_modules" folders from inputDir to outputDir.
 * @param {string} inputDir - The directory to search for "node_modules".
 * @param {string} outputDir - The directory where symlinks will be created.
 */
function Node_modules_Symlinker(inputDir, outputDir) {
	const handleNodeModules = (inputPath, outputPath) => {
		console.log(`---------------------`);
		console.log("From", inputPath);
		console.log("To", outputPath);

		if (!fs.existsSync(outputPath)) {
			console.log(`Cloning : ${inputPath} to ${outputPath}`);
			fs.copySync(inputPath, outputPath);
			console.log(`Cloned!`);
		} else {
			console.log(`Already cloned! Skip clone : ${inputPath} to ${outputPath}`);
		}

		try {
			fs.rmSync(inputPath, { recursive: true, force: true });
		} catch (error) {
			console.error("Error removing original directory:", error);
			return;
		}

		console.log(`Symlinking : ${inputPath} to ${outputPath}`);

		try {
			fs.symlinkSync(outputPath, inputPath, "dir");
			console.log(`Symlink created: ${inputPath} -> ${outputPath}`);
		} catch (error) {
			console.error("Error creating symlink:", error);
		}

		console.log(`------------------------\n\n`);
	};

	// Watch for changes
	const watcher = chokidar.watch(inputDir, {
		ignored: /(^|[\/\\])\../, // Ignore dotfiles
		persistent: true,
		depth: 3, // Adjust as needed to limit watching depth
	});

	watcher
		.on("addDir", (dirPath) => {
			if (path.basename(dirPath) === "node_modules") {
				const relativePath = path.relative(inputDir, dirPath);
				const outputPath = path.join(outputDir, relativePath);

				handleNodeModules(dirPath, outputPath);
			}
		})
		.on("error", (error) => console.error(`Watcher error: ${error}`));
}

const args = process.argv.slice(2);

if (args.length < 2) {
	console.error("Usage: <exe> <inputDir> <outputDir>");
	process.exit(1);
}

const inputDir = path.resolve(args[0]);
const outputDir = path.resolve(args[1]);

try {
	Node_modules_Symlinker(inputDir, outputDir);
} catch (error) {
	console.error("Error creating symlinks:", error);
}
