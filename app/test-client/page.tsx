'use client';

import { useState } from 'react';

export default function TestClientPage() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Test Client Component</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}