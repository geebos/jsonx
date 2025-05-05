import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import JsonViewer from './JsonViewer.tsx';

const arr = new Array<number>();
for (let i = 0; i < 10000; i++) {
  arr.push(i);
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <JsonViewer json={{
        'name': 'John Doe',
        'age': 30,
        'array': arr,
        'object': {
          'key1': 'value1',
          'key2': 'value2',
          'null': null,
          'object2': {
            'array2': [
              '234',
              '234',
            ],
            'object3': {
              'key3': 'value3',
            },
          },
        },
      }}/>
    </StrictMode>,
);
