const{createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
    'api',
    createProxyMiddleware({
        target: "https://webyacht.herokuapp.com/:8080",
        changeOrigin:true,
    })
    );
    app.use(
    'ws-stomp',
    createProxyMiddleware({
        target: "https://webyacht.herokuapp.com/:8080",
        ws: true
    })
    )
};