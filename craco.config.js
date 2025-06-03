const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@views': path.resolve(__dirname, 'src/views'),
            '@framework': path.resolve(__dirname, 'src/framework'),
            '@config': path.resolve(__dirname, 'src/config'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@layout': path.resolve(__dirname, 'src/layout'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@pageStyles': path.resolve(__dirname, 'src/styles/page-styles'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@src': path.resolve(__dirname, 'src/'),



        },
    },
}
