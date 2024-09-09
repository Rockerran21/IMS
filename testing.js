const fs = require('fs');
const path = require('path');

// Function to display files and directories in a tree format, skipping specified directories and files
function listFiles(directory, prefix = '', level = 0, maxDepth = 2) {
    // Directories to exclude from the search
    const excludedDirectories = ['node_modules', 'myenv', '.git'];
    // Files to exclude from the search
    const excludedFiles = ['.env', '.DS_Store'];

    // Read the contents of the directory
    fs.readdir(directory, (err, files) => {
        if (err) {
            return console.log(`Error reading directory ${directory}: ${err}`);
        }

        files.forEach((file, index) => {
            const fullPath = path.join(directory, file);

            // Get file stats to check if it's a directory or a file
            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    return console.log(`Error getting stats for ${fullPath}: ${err}`);
                }

                // Skip excluded directories
                if (stats.isDirectory() && excludedDirectories.includes(file)) {
                    return; // Skip this directory
                }

                // Skip excluded files
                if (!stats.isDirectory() && excludedFiles.includes(file)) {
                    return; // Skip this file
                }

                // Determine whether this is the last item in the directory to adjust tree lines
                const isLastItem = index === files.length - 1;

                // Print the directory or file name with the appropriate tree-like prefix
                console.log(`${prefix}${isLastItem ? '└──' : '├──'} ${file}`);

                // If it's a directory and the current level is less than maxDepth, recurse
                if (stats.isDirectory() && level < maxDepth) {
                    // Pass the correct prefix for the next level
                    const newPrefix = `${prefix}${isLastItem ? '    ' : '│   '}`;
                    listFiles(fullPath, newPrefix, level + 1, maxDepth);
                }
            });
        });
    });
}

// Start listing from the specified directory
const startDirectory = "/Users/ranjanmarasini/IdeaProjects/IMS"; // Full directory path as a string
listFiles(startDirectory);
