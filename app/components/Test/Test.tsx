import React from 'react';

const Test = () => {
  return (
    <div>
      <h1>CLI commands</h1>
      <button onClick={() => console.log('test')}>Install</button>
      <button onClick={() => console.log('test')}>Uninstall</button>
      <button onClick={() => console.log('test')}>Reinstall</button>
      <button onClick={() => console.log('test')}>Reboot</button>
    </div>
  );
};

export default Test;
