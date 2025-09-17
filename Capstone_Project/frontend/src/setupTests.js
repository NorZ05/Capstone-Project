
import '@testing-library/jest-dom';
import React from 'react';

// Provide a minimal HTMLCanvasElement.getContext shim for Chart.js in jsdom tests
if (typeof HTMLCanvasElement !== 'undefined' && !HTMLCanvasElement.prototype.getContext) {
	HTMLCanvasElement.prototype.getContext = function() {
		return {
			fillRect: () => {},
			clearRect: () => {},
			getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4) }),
			putImageData: () => {},
			createImageData: () => [],
			setTransform: () => {},
			drawImage: () => {},
			save: () => {},
			restore: () => {},
			beginPath: () => {},
			moveTo: () => {},
			lineTo: () => {},
			closePath: () => {},
			stroke: () => {},
			fillText: () => {},
			measureText: () => ({ width: 0 }),
			transform: () => {},
			rotate: () => {},
			translate: () => {},
			scale: () => {},
			arc: () => {},
			fill: () => {},
			strokeRect: () => {}
		};
	};
}

// Mock react-chartjs-2 to avoid Chart.js DOM issues in tests
jest.mock('react-chartjs-2', () => {
	const React = require('react');
	return {
		Line: (props) => React.createElement('div', { 'data-testid': 'line-chart' }),
		Bar: (props) => React.createElement('div', { 'data-testid': 'bar-chart' })
	};
});
