function logger (req, res, next) {
    const agora = new Date().toISOString();
    const metodo = req.method;
    const url = req.url;
    const ipBruto = req.ip || req.connection.remoteAddress || '';
    const ip = ipBruto.replace('::ffff:', '').replace('::1', '127.0.0.1'); 

    console.log(`[${agora}] ${metodo} ${url} - IP: ${ip}`);

    next();
}
module.exports = logger;