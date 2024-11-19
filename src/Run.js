const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const micromatch = require("micromatch");

/**
 * Recursively find and symlink all matched folders from inputDir to outputDir.
 * @param {string} inputDir - The directory to search for matching folders.
 * @param {string} outputDir - The directory where symlinks will be created.
 * @param {string[]} patterns - Glob patterns to match folder names.
 */
function FolderSymlinker(inputDir, outputDir, patterns) {
	const handleFolder = (inputPath, outputPath) => {
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
		ignored: /(^|[\/\\])\../,
		persistent: true,
		depth: 3,
	});

	watcher
		.on("addDir", (dirPath) => {
			const relativePath = path.relative(inputDir, dirPath);
			if (micromatch.isMatch(relativePath, patterns)) {
				const outputPath = path.join(outputDir, relativePath);
				handleFolder(dirPath, outputPath);
			}
			// else {
			// 	console.log(`Ignoring folder: ${relativePath}`);
			// }
		})
		.on("error", (error) => console.error(`Watcher error: ${error}`));
}

const args = process.argv.slice(2);

if (args.length < 3) {
	console.error("Usage: Google_Drive_Excluder.exe <inputDir> <outputDir> <patterns>");
	console.error(
		'Example patterns: "**/node_modules", "**/node_modules | **/otherfolder", "**/src/**/node_modules"'
	);
	process.exit(1);
}

const inputDir = path.resolve(args[0]);
const outputDir = path.resolve(args[1]);
const patterns = args[2].split("|").map((p) => p.trim());

try {
	console.log(inputDir, outputDir, patterns);
	FolderSymlinker(inputDir, outputDir, patterns);
} catch (error) {
	console.error("Error creating symlinks:", error);
}
