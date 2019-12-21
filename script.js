var connection = new WebSocket('ws://192.168.1.66:86');

const gearContainer = $('.gear');
const steeringContainer = $('.steering');
const steeringIndicator = steeringContainer.find('.indicator');
const gearIndicator = gearContainer.find('.indicator');
const gearValueDiv = gearContainer.find('.val');
const steeringValueDiv = steeringContainer.find('.val');

console.log(gearContainer, steeringContainer);

const gearObj = {};
const steeringObj = {};

const steeringVisualize = () => {
	steeringValueDiv.html(steeringObj.value);
	steeringIndicator.css({
		transform: `translateX(${steeringObj.posX}px)`
	});
}
const gearVisualize = () => {
	// gearValueDiv.html(evt.touches[0].clientY - gearObj.center);
	gearValueDiv.html(gearObj.value);
	gearIndicator.css({
		transform: `translateY(${gearObj.posY}px)`
	});
}

function sendValue() {
	const absGearValue = Math.abs(gearObj.value);
	const absSteeringValue = Math.abs(steeringObj.value);
	connection.send(
		String.fromCharCode(gearObj.value > 0 ? 1 : 2) +
		String.fromCharCode(absGearValue > 50 ? 50 : absGearValue) +
		String.fromCharCode(steeringObj.value > 0 ? 1 : 2) +
		String.fromCharCode(absSteeringValue > 50 ? 50 : absSteeringValue)
	)
}

gearContainer
	.bind('touchstart', evt => {
		gearObj.conHeight = $(evt.target).height();
		gearObj.center = gearObj.conHeight / 2;


		const posY = evt.touches[0].clientY - gearObj.center;
		gearObj.posY = posY;
		gearObj.value = -1 * (Math.ceil((posY / gearObj.center) * 50));
		gearVisualize();
		sendValue();
	})
	.bind('touchmove', evt => {
		// console.log(evt, evt.touches[0].clientY);
		// 50 max
		const posY = evt.touches[0].clientY - gearObj.center;
		gearObj.posY = posY;
		gearObj.value = -1 * (Math.ceil((posY / gearObj.center) * 50));
		gearVisualize();
		sendValue();
	})
	.bind('touchend', evt => {
		gearObj.posY = 0;
		gearObj.value = 0;
		sendValue();
		gearVisualize();
	});

steeringContainer
	.bind('touchstart', evt => {
		steeringObj.conWidth = $(evt.target).width();
		steeringObj.center = steeringObj.conWidth / 2;


		const posX = evt.touches[0].clientX - steeringObj.center;
		steeringObj.posX = posX;
		steeringObj.value = Math.ceil((posX / steeringObj.center) * 50);
		steeringVisualize();
		sendValue();
	})
	.bind('touchmove', evt => {
		// console.log(evt, evt.touches[0].clientX);
		const posX = evt.touches[0].clientX - steeringObj.center;
		steeringObj.posX = posX;
		steeringObj.value = Math.ceil((posX / steeringObj.center) * 50);
		steeringVisualize();
		sendValue();
	})
	.bind('touchend', evt => {
		steeringObj.posX = 0;
		steeringObj.value = 0;
		steeringVisualize();
		sendValue();
	});

$('.inner-warpper').bind('touchstart touchmove touchend', evt => {
	evt.preventDefault();
	evt.stopPropagation();
});

// _.debounce
connection.onopen = function () {
	// connection.send('Ping'); // Send the message 'Ping' to the server
	console.log('Connected!');
};
connection.onclose = connection.onerror = function (error) {
	console.log('WebSocket Error ' + error);
	connection.close();
};
connection.onmessage = function (e) {
	console.log('server', e.data);
}
