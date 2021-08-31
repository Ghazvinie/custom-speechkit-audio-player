import React, { useRef } from 'react';

function ProgressBar(props) {

    const progressRef = useRef(null);
    const filledRef = useRef(null);

    return (
        <div className="progress" ref={progressRef} onClick={(e) => progressClick(e)}>
            <div className="progress-filled" ref={filledRef} ></div>
        </div>
    );
};

export default ProgressBar;