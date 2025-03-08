 
 

import React from 'react'; 
const Loading: React.FC = () => {
  return (
    <div className="loading" style={{
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'display': 'flex',
        'justifyContent': 'center',
        'alignItems': 'center',
        'backgroundColor': 'rgba(255, 255, 255, 0.8)', 
        'zIndex': 9999
    }}>
      加载中...
    </div>
  );
};

export default Loading;