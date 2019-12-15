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

gearContainer
	.bind('touchstart', evt => {
		gearObj.conHeight = $(evt.target).height();
		gearObj.center = gearObj.conHeight / 2;
	})
	.bind('touchmove', evt => {
		// console.log(evt, evt.touches[0].clientY);
		// 255 max
		const posY = evt.touches[0].clientY - gearObj.center;
		gearObj.posY = posY;
		gearObj.value = -1 * (Math.ceil((posY / gearObj.center) * 255));
		gearVisualize();
	})
	.bind('touchend', evt => {
		gearObj.posY = 0;
		gearObj.value = 0;
		gearVisualize();
	});

steeringContainer
	.bind('touchstart', evt => {
		steeringObj.conWidth = $(evt.target).width();
		steeringObj.center = steeringObj.conWidth / 2;
	})
	.bind('touchmove', evt => {
		// console.log(evt, evt.touches[0].clientX);
		const posX = evt.touches[0].clientX - steeringObj.center;
		steeringObj.posX = posX;
		steeringObj.value = Math.ceil((posX / steeringObj.center) * 255);
		steeringVisualize();
	})
	.bind('touchend', evt => {
		steeringObj.posX = 0;
		steeringObj.value = 0;
		steeringVisualize();
	});

$('.inner-warpper').bind('touchstart touchmove touchend', evt => {
	evt.preventDefault();
	evt.stopPropagation();
});

// _.debounce