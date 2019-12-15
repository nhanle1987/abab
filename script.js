const gearContainer = $('.gear');
const steeringContainer = $('.steering');
const steeringIndicator = steeringContainer.find('.indicator');
const gearIndicator = gearContainer.find('.indicator');
const gearValueDiv = gearContainer.find('.val');
const steeringValueDiv = steeringContainer.find('.val');

console.log(gearContainer, steeringContainer);

const gearObj = {};
const steeringObj = {};

gearContainer
	.bind('touchstart mousedown', evt => {
		gearObj.conHeight = $(evt.target).height();
		gearObj.center = gearObj.conHeight / 2;
	})
	.bind('touchmove mousemove', evt => {
		console.log(evt, evt.touches[0].clientY);
		gearValueDiv.html(evt.touches[0].clientY - gearObj.center);
		// steeringIndicator.css({

		// });
	});

steeringContainer
	.bind('touchstart mousedown', evt => {
		steeringObj.conWidth = $(evt.target).width();
		steeringObj.center = steeringObj.conWidth / 2;
	})
	.bind('touchmove mousemove', evt => {
		console.log(evt, evt.touches[0].clientX);
		steeringValueDiv.html(evt.touches[0].clientX - steeringObj.center);
		// steeringIndicator.css({

		// });
	});

$('.inner-warpper').bind('touchstart touchmove touchend', evt => {
	evt.preventDefault();
	evt.stopPropagation();
});

// _.debounce