/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    reactStrictMode: true,
    //distDir: 'build',

    webpack: (config, {isServer}) => {
        config.resolve.extensions.push(".ts", ".tsx");
        //config.resolve.fallback = {fs: false};
        config.resolve.fallback = {child_process: false};
        config.resolve.fallback = {
            ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
            // by next.js will be dropped. Doesn't make much sense, but how it is
            fs: false, // the solution
        };

        config.plugins.push(
            new NodePolyfillPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: './node_modules/onnxruntime-web/dist/ort-wasm.wasm',
                        to: 'static/chunks',
                    },
                    {
                        from: './node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
                        to: 'static/chunks',
                    },
                    {
                        from: './node_modules/onnxruntime-web/dist/*.wasm',
                        to: 'static/chunks'
                    },
                    {
                        from: './neural-network/models',
                        to: 'static/chunks/pages'
                    }
                ],
            }),
        );

        return config;
    }
}
