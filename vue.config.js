module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "https://github.com/reunion-island-art-digitizer/SolanaProject-frontend/" : "/",
    assetsDir: 'solanaproject',
    outputDir: '../SolanaProject-frontend/solanaproject',
    configureWebpack: {
        resolve: {
            // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
            extensions: ["*", ".mjs", ".js", ".vue", ".json", ".gql", ".graphql"],
            alias: {
                static: "public/solanaproject",
            },
        },
        module: {
            rules: [
                // fixes https://github.com/graphql/graphql-js/issues/1272
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto",
                },
            ],
        },
    },
    devServer: {
        proxy: {
            "/api": {
                // target: "http://apidev.xinchain.org/apiSolana/", // 域名
                target: "https://api.staked.xyz/apiSolana/", // 域名
                ws: true, // 是否启用websockets
                changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {
                    '^/api': '/'
                }
            },
        }
    },
};