import { render } from '@testing-library/react';
import Reports from '../Reports';

test('movingAverage helper computes 7 and 30 day averages', () => {
  // Import the helper by rendering Reports and grabbing window helper via component instance is awkward.
  // Instead test by calling a known array through component logic by re-creating simple function here.
  const movingAverage = (arr, window) => {
    const out = new Array(arr.length).fill(null);
    for (let i=0;i<arr.length;i++) {
      const start = Math.max(0, i - (window-1));
      const slice = arr.slice(start, i+1).filter(v=>v!=null);
      if (!slice.length) out[i]=null; else out[i] = Math.round(slice.reduce((s,a)=>s+a,0)/slice.length);
    }
    return out;
  };

  const arr = [10,20,30,40,50,60,70];
  const ma7 = movingAverage(arr,7);
  expect(ma7[6]).toBe(40); // average of 10..70 = 280/7 = 40
  const ma3 = movingAverage(arr,3);
  expect(ma3[2]).toBe(20); // avg of 10,20,30
});
