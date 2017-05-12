# sense-joystick

A node module to interface with the sense-hat library on the raspberry pi.

## Interface

The module exposes a single function; `getJoystick`, which returns a promise
that resolves with an event emitter. The events that can be subscribed to are:

* press - Emitted when a joystick direction is pressed
* release - Emitted when a joystick direction is released
* hold - Emmitted periodically when a joystick direction is held down

Each event is coupled with a direction, which is one of:

* left
* right
* up
* down
* click (When pressing the joystick inwards)

## Examples

### Capturing button presses

```javascript
senseJoystick = require('sense-joystick');

senseJoystick.getJoystick()
.then((joystick) => {
	joystick.on('press', (direction) => {
		console.log('Got button press in the direction: ', direction);
	}
});
```

