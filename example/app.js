senseJoystick = require('../lib/index.js');

senseJoystick.getJoystick()
.then((joystick) => {
	joystick.on('press', (val) => { console.log('Pressed ' + val); });
	joystick.on('release', (val) => { console.log('Released ' + val); });
	joystick.on('hold', (val) => { console.log('Holding ' + val); });
});
