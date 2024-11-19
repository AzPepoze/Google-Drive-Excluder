# Google Drive Excluder

## Overview

`Google Drive Excluder` is a tool to recursively find `folders that match the pattern` and symlink to another folders.

I created this cuz I want to exclude node_modules folders in Google Drive (Mirror mode only)

## Features

-    Auto link if you created new folder

## Installation

-    [Download](https://github.com/AzPepoze/Google-Drive-Excluder/releases)
-    Extract zip file

## Usage

-    Edit the `Run.bat` as you want.

### Format

```
Google_Drive_Excluder.exe <inputDir> <outputDir> <patterns>
```

### Example < patterns >

`"**/node_modules"` folder that named "node_modules"

`"**/node_modules|**/otherfolder"` folder that named "node_modules" and "otherfolder"

`"**/src/**/some_folder"` folder that named "some_folder" anywhere in "src"

### Example

```
Google_Drive_Excluder.exe "C:/Google_Drive" "C:/node_modules_storage" "node_modules"
```

-    Run `Run.bat` or `Run (No console).vbs` (I recommand to use `Run.bat` for the first time to see any typo/bug)
