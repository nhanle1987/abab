const searchParams = function () {
	function urldecode(str) {
		return decodeURIComponent((str + '').replace(/\+/g, '%20'));
	}

	function transformToAssocArray(prmstr) {
		var params = {};
		var prmarr = prmstr.split("&");
		for (var i = 0; i < prmarr.length; i++) {
			var tmparr = prmarr[i].split("=");
			params[tmparr[0]] = urldecode(tmparr[1]);
		}
		return params;
	}

	var prmstr = window.location.search.substr(1);
	return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}();
var ip = searchParams['ip'];
// var ie = some.has('ie') // true

var connection = new WebSocket(`ws://${ip ? ip : '192.168.1.66'}:86`);

const gearContainer = $('.gear');
const steeringContainer = $('.steering');
const statusContainer = $('.status');
const steeringIndicator = steeringContainer.find('.indicator');
const gearIndicator = gearContainer.find('.indicator');
const gearValueDiv = gearContainer.find('.val');
const steeringValueDiv = steeringContainer.find('.val');

let isConnected = false;

const maskContainer = $('.mask');

const gearContainerBounding = gearContainer.get(0).getBoundingClientRect();
const steeringContainerBounding = steeringContainer.get(0).getBoundingClientRect();
console.log(steeringContainerBounding);

maskContainer
	.bind('touchstart touchmove touchend', evt => {
		Object.keys(evt.touches).forEach(key => {
			const touch = evt.touches[key];
			if (
				touch.clientX >= gearContainerBounding.left &&
				touch.clientX <= gearContainerBounding.right &&
				touch.clientY >= gearContainerBounding.top &&
				touch.clientY <= gearContainerBounding.bottom
			) {
				gearObj.conHeight = gearContainer.height();
				gearObj.center = gearObj.conHeight / 2;
				const posY = touch.clientY - gearObj.center;
				gearObj.posY = posY;
				gearObj.value = -1 * (Math.ceil((posY / gearObj.center) * 20));
				gearVisualize();
				console.log(gearObj);
			} else if (
				touch.clientY >= steeringContainerBounding.top &&
				touch.clientY <= steeringContainerBounding.bottom &&
				touch.clientX >= steeringContainerBounding.left &&
				touch.clientX <= steeringContainerBounding.right
			) {
				steeringObj.conWidth = steeringContainer.width();
				steeringObj.center = steeringObj.conWidth / 2;
				const posX = touch.clientX - steeringObj.center;
				steeringObj.posX = posX;
				steeringObj.value = Math.ceil((posX / steeringObj.center) * 20);
				steeringVisualize();
			} else {
				gearObj.posY = 0;
				gearObj.value = 0;
				// /sendValue();
				gearVisualize();
				steeringObj.posX = 0;
				steeringObj.value = 0;
				steeringVisualize();
			}
		});
		sendValue();
	});

const baseValue = 30;

statusContainer.html('Connecting...');

const gearObj = {};
const steeringObj = {};

const steeringVisualize = () => {
	steeringValueDiv.html(steeringObj.value);
	steeringIndicator.css({
		transform: `translateX(${steeringObj.posX}px)`
	});
}
const gearVisualize = () => {
	gearValueDiv.html(gearObj.value);
	gearIndicator.css({
		transform: `translateY(${gearObj.posY}px)`
	});
}

function sendValue() {
	let absGearValue = Math.abs(gearObj.value);
	let absSteeringValue = Math.abs(steeringObj.value);
	absGearValue > 20 ? 20 : absGearValue;
	absGearValue = absGearValue > 0 ? absGearValue + baseValue : 0;
	absSteeringValue > 20 ? 20 : absSteeringValue;
	absSteeringValue = absSteeringValue > 0 ? absSteeringValue + baseValue : 0;
	isConnected && connection.send(
		String.fromCharCode(gearObj.value > 0 ? 1 : 2) +
		String.fromCharCode(absGearValue) +
		String.fromCharCode(steeringObj.value > 0 ? 1 : 2) +
		String.fromCharCode(absSteeringValue)
	);
}

gearContainer
	.bind('touchstart', evt => {
		gearObj.conHeight = $(evt.target).height();
		gearObj.center = gearObj.conHeight / 2;


		const posY = evt.touches[0].clientY - gearObj.center;
		gearObj.posY = posY;
		gearObj.value = -1 * (Math.ceil((posY / gearObj.center) * 20));
		gearVisualize();
		sendValue();
	})
	.bind('touchmove', evt => {
		// console.log(evt, evt.touches[0].clientY);
		// 20 max
		const posY = evt.touches[0].clientY - gearObj.center;
		gearObj.posY = posY;
		gearObj.value = -1 * (Math.ceil((posY / gearObj.center) * 20));
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
		steeringObj.value = -1 * Math.ceil((posX / steeringObj.center) * 20);
		steeringVisualize();
		sendValue();
	})
	.bind('touchmove', evt => {
		// console.log(evt, evt.touches[0].clientX);
		const posX = evt.touches[0].clientX - steeringObj.center;
		steeringObj.posX = posX;
		steeringObj.value = -1 * Math.ceil((posX / steeringObj.center) * 20);
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
	console.log('Connected!');
	statusContainer.html('Connected!');
	isConnected = true;
};
connection.onclose = connection.onerror = function (error) {
	console.log('WebSocket Error ' + error);
	statusContainer.html('Disconnected!');
	isConnected = false;
	connection.close();
};
connection.onmessage = function (e) {
	console.log('server', e.data);
}
