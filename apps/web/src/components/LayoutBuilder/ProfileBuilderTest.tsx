// Test imports one at a time
import { useState } from 'react';

import { WIDGET_DEFINITIONS, DEFAULT_DEVICE, DEVICE_PRESETS } from '@peloton/shared';

export function ProfileBuilderTest() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Test 9: No DEVICE_PRESET_LIST</h1>
      <p>WIDGET_DEFINITIONS: {Object.keys(WIDGET_DEFINITIONS).length}</p>
      <p>DEFAULT_DEVICE: {DEFAULT_DEVICE}</p>
      <p>DEVICE_PRESETS: {Object.keys(DEVICE_PRESETS).length}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Clicked {count} times
      </button>
    </div>
  );
}
