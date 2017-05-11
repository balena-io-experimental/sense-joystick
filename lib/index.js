const Promise = require('bluebird');
const glob = require('glob');
const fs = require('mz/fs');
const _ = require('lodash');
const path = require('path');
const events = require('events');

const globAsync = Promise.promisify(glob);

const KEY_UP = 103;
const KEY_LEFT = 105;
const KEY_RIGHT = 106;
const KEY_DOWN = 108;
const KEY_ENTER = 28;

const STATE_RELEASE = 0;
const STATE_PRESS = 1;
const STATE_HOLD = 2;

const getStickFilename = () => {
	return globAsync('/sys/class/input/event*')
	.map((file) => {
		fileName = path.join(file, 'device', 'name');
		return fs.readFile(fileName)
			.then((content) => {
				return {
					filename: path.join('/dev', 'input', path.basename(file)),
					contents: content.toString().trim()
				};
			});
	})
	.then((objs) => {
		return _.find(objs, { contents: 'Raspberry Pi Sense HAT Joystick' });
	})
	.get('filename');
};

const valueToString = (value) => {
	switch(value) {
		case STATE_RELEASE:
			return 'release';
		case STATE_PRESS:
			return 'press';
		case STATE_HOLD:
			return 'hold';
	}
};

const codeToString = (code) => {
	switch(code) {
		case KEY_UP:
			return 'up';
		case KEY_LEFT:
			return 'left';
		case KEY_RIGHT:
			return 'right';
		case KEY_DOWN:
			return 'down';
		case KEY_ENTER:
			return 'click';
	}
};

const emitJoystickEvent = (joystick, eventObj) => {
	joystick.emit(valueToString(eventObj.value), codeToString(eventObj.code));
};

module.exports.getJoystick = () => {
	var joystickStream;

	return getStickFilename()
	.then((filename) => {
		joystick = new events.EventEmitter();

		joystickStream = fs.createReadStream(filename);
		joystickStream.on('data', (data) => {
			const timestamp = data.readUInt32LE(0);
			const timestampMs = data.readUInt32LE(4);
			const type = data.readUInt16LE(8);
			const code = data.readUInt16LE(10);
			const value = data.readUInt32LE(12);

			emitJoystickEvent(joystick, {
				timestamp,
				timestampMs,
				type,
				code,
				value
			});
		});

		return joystick;
	});
};

