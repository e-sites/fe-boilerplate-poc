/**
 * Adds global functions or values and make this available in app.global
 */
app.global = {
	screenWidth: require('./screenwidthEm'),
	isTouchDevice: require('./isTouchDevice')
};