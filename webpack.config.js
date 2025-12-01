const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node', // VS Code extensions run in a Node.js-context
    mode: 'production', // This will be overridden by the build script

    entry: './src/extension.ts', // The entry point of this extension
    output: {
        // The bundle is stored in the 'out' folder (check package.json)
        path: path.resolve(__dirname, 'out'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2'
    },
    externals: {
        vscode: 'commonjs vscode' // The vscode-module is created on-the-fly and must be excluded
    },
    resolve: {
        // Support reading TypeScript and JavaScript files
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    devtool: 'source-map',
    infrastructureLogging: {
        level: "log", // Enables logging required for problem matchers
    },
};

module.exports = config;

