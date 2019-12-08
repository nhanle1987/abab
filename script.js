var connection;

var dump = console.log;

var isConnected = false;

// var host = "192.168.1.90";
// var host = "h-cm3.ddns.net";
var host = "192.168.1.66";

var connection = new WebSocket(`ws://${host}:86`);
var isPing = true;


const
	REFRESH_KEY = 116,
	SHOW_FIRMWARE_UPDATE = 192,

	ON_HVSW = 49,
	OFF_HVSW = 33,
	ON_HORN = 50,
	OFF_HORN = 64,
	STATUS_REPORT = 112,
	STATUS_RESET = 113,
	STATUS_ARM = "A".charCodeAt(0),
	STATUS_UNARM = "S".charCodeAt(0),
	RESET_CONNECTION = 46,
	CLEAR_CONNECTION = 35
;

function send(data) {
	if(!isConnected) {
		dump("Connecting...");
		return;
	}
	connection.send(data);
}

$(document).ready(function() {
	var doc = $(document);
	
	$("#output_frame").attr("src", "");
	$(".firmware_update").hide();
	$(".status").hide();

	$('input[name="dates"]').daterangepicker({
		timePicker: true,
		startDate: moment().startOf('hour'),
		endDate: moment().startOf('hour').add(32, 'hour'),
		locale: {
			format: 'M/DD hh:mm A'
		}
	});

	$("#form-update").attr({
		action: `http://${host}:8080/update`
	});

	$("#firmware-update").attr({
		href: `http://${host}:8080/reset`
	});

	$("#light").click(function() {
		var $this = $(this);
		send($this.hasClass("active") ? OFF_HVSW : ON_HVSW);
		return false;
	});

	$("#horn").click(function() {
		var $this = $(this);
		send($this.hasClass("active") ? OFF_HORN : ON_HORN);
		return false;
	});

	$("#reset-sensor-status").click(function() {
		send(STATUS_RESET);
		return false;
	});

	$("#clear-all-connection").click(function() {
		// send(CLEAR_CONNECTION);
		// $("<>")
		// $("#output_frame").attr({
			// src: `http://${host}:8080/cc`
		// });
		window.open(`http://${host}:8080/cc`);
		return false;
	});

	$("#arm").click(function() {
		var $this = $(this);
		send($this.hasClass("active") ? STATUS_UNARM : STATUS_ARM);
		return false;
	});
	
	doc.bind("keydown", null, function(evt) {
		if(evt.keyCode === REFRESH_KEY) {
			return true;
		}

		// dump(evt, evt.shiftKey);
		
		evt.preventDefault();
		switch(evt.keyCode) {
			case ON_HVSW:
			case OFF_HVSW:
			case ON_HORN:
			case OFF_HORN:
				send(evt.key.charCodeAt(0));
				break;
			case SHOW_FIRMWARE_UPDATE:
				$(".firmware_update").toggle();
				break;
			case STATUS_REPORT:
			case STATUS_RESET:
			case STATUS_ARM:
			case STATUS_UNARM:
			case CLEAR_CONNECTION:
				send(evt.keyCode);
				break;
			case RESET_CONNECTION:
				if(evt.shiftKey) {
					send(evt.keyCode);
				}
				break;
		};
	});
	function onOpen() {
		connection.send('Ping'); // Send the message 'Ping' to the server
		dump('Connected!');
		isPing = true;
		isConnected = true;
		$(".status").show();
		send(STATUS_REPORT);
		(function ping() {
			isPing && setTimeout(function() {
				ping();
				connection.send("ping");
			}, 2000);
		})();
		this.isClosed = false;
		// console.log(this);
	};
	var $sensorGroup = $("#group-sensor");
	function onMessage(e) {
		dump('Server: ' + e.data);
		str = e.data;
		var tmp;
		if(
			str.startsWith("MAG:") ||
			str.startsWith("MAG:")
		) {
			// dump('Server: ' + e.data);
		}
		if(str.startsWith("MAG:")) {
			tmp = str.substring(4);
			var [sensor, value] = tmp.split("-");

			if(([0, 1, 2, 3, 4, 5, 8]).indexOf(parseInt(sensor, 10)) !== -1) {
				return;
			}

			var divSensor = $(`#sensor-${sensor}`);

			if(divSensor.length <= 0) {
				divSensor = $("<div>").attr({
					id: `sensor-${sensor}`,
					class: "sensor"
				});
				$sensorGroup.append(divSensor);
			}
			divSensor.html(sensor);
			if(value === "1") {
				divSensor.addClass("active");
			} else {
				divSensor.removeClass("active");
			}

			return;
		}
		if(str.startsWith("HVSW:")) {
			tmp = str.substring(5);
			if(tmp === "1") {
				$("#light").addClass("active");
			} else {
				$("#light").removeClass("active");
			}
			return;
		}
		if(str.startsWith("HORN:")) {
			tmp = str.substring(5);
			if(tmp === "1") {
				$("#horn").addClass("active");
			} else {
				$("#horn").removeClass("active");
			}
			return;
		}
		if(str.startsWith("ARM:")) {
			tmp = str.substring(4);
			if(tmp === "1") {
				$("#arm").addClass("active");
			} else {
				$("#arm").removeClass("active");
			}
			return;
		}
		if(str.startsWith("ID:")) {
			var devID = str.match(/[0123456789ABCDEF]+$/ig)[0];
			if (!devID) {
				return;
			}
			$(".status-box").text(`[${devID}]`);
			return;
		}
		isConnected = true;
		$(".status").show();
	};
	function onError(error) {
		dump('WebSocket Error ' + error);
		this.close();
		this.isClosed = true;
		isPing = false;
		connection = new WebSocket(`ws://${host}:8181`);
		setupSocket();
		// connection = new WebSocket(`ws://${host}:8181`);
	};
	function setupSocket() {
		connection.onopen = onOpen;
		connection.onclose = connection.onerror = onError;
		connection.onmessage = onMessage;
	}
	setupSocket();

	// console.log(connection);
});