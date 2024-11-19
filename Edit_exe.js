const { load } = require("resedit/cjs");
const fs = require("fs");
const util = require("util");

const renameFile = util.promisify(fs.rename);
const unlinkFile = util.promisify(fs.unlink);

const Input = "./build/Google_Drive_Excluder.exe";
const Output = "./dist/Google_Drive_Excluder.exe";

load().then(async (ResEdit) => {
	try {
		// Check if the file exists
		if (!fs.existsSync(Input)) {
			throw new Error(`File ${Input} not found.`);
		}

		let data = fs.readFileSync(Input);
		let exe = ResEdit.NtExecutable.from(data);
		let res = ResEdit.NtExecutableResource.from(exe);

		// Replace the icon resource
		let iconFile = ResEdit.Data.IconFile.from(fs.readFileSync("./src/Logo.ico"));
		ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
			res.entries, // destination entries
			1, // icon group ID
			1033, // language (en-US)
			iconFile.icons.map((item) => item.data) // icon data
		);

		// Modify version info
		let viList = ResEdit.Resource.VersionInfo.fromEntries(res.entries);
		let vi = viList[0];
		vi.fixedInfo.fileVersionLS = 0;
		vi.setStringValues(
			{ lang: 1033, codepage: 1200 },
			{
				FileVersion: "1.0.0",
				FileDescription: "Google_Drive_Excluder",
				ProductName: "Google_Drive_Excluder",
			}
		);
		vi.outputToResourceEntries(res.entries);

		// Output the modified binary
		res.outputResource(exe, true);
		let newBinary = exe.generate();
		fs.writeFileSync(Output, Buffer.from(newBinary));

		// Replace the original file with the Output one
		await unlinkFile(Input);
		// await renameFile(Output, Input);
		console.log("Executable has been successfully modified and replaced.");
	} catch (error) {
		console.error("Error during executable modification:", error);
	}
});
