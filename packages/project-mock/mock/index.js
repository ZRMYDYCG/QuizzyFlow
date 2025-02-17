const questionMock = require('./modules/question')
const userMock = require('./modules/user')
const statisticsMock = require('./modules/statistics')

module.exports = [...questionMock, ...userMock, ...statisticsMock]
