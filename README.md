# Node_modules_Symlinker

## Overview

`Node_modules_Symlinker` is a tool to recursively find `node_modules` folders and symlink to another folders.

I created this cuz I want to exclude node_modules folders in Google Drive

## Features

-    Auto link if you created new `node_modules` folder

## Installation

-    [Download executable](https://github.com/AzPepoze/Node_modules_Symlinker/releases)

## Usage (Command-Line)

```
Node_modules_Symlinker.exe <inputDir> <outputDir>
```

### Example:

```
Node_modules_Symlinker.exe "C:/Google_Drive" "C:/node_modules_storage"
```
