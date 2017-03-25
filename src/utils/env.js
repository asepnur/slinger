module.exports = {
    get : () => {
        return process.env.NODE_ENV || 'development'
    },
    isDevelopment : () => {
        return (process.env.NODE_ENV === 'development') ? true : false
    },
    isStaging : () => {
        return (process.env.NODE_ENV === 'staging') ? true : false
    },
    isProduction : () => {
        return (process.env.NODE_ENV === 'production') ? true : false
    }
}