module.exports = {
    success : (code, data, req, res) => {
        let url = req.path
        let template = JSON.stringify({
            code : code,
            url : url,
            data : data,
            server : 'slinger'
        })
        res.writeHead(code, {'Content-Type': "application/json"})
        res.write(template)
        res.end()
    },
    err : (code, message, req, res) => {
        let template = JSON.stringify({
            code : code,
            message: message,
            server : 'slinger'
        })
        res.writeHead(code, {'Content-Type': "application/json"})
        res.write(template)
        res.end()
    }
}