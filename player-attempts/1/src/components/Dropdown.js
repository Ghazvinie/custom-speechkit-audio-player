import React from 'react';
import '../Dropdown.css'

function Dropdown() {
    return (
        <div className='dropdown-container' style={{backgroundColor: 'red'}}>
            <h2>Like what you hear?</h2>
            <h3>Subscribe to hear this article and more</h3>
            <button className='signup-btn' value='hello'>Subscribe</button>
            <p className='signin-or'>or</p>
            <button className='signup-btn' value='hello'>Sign In</button>

        </div>

    )
}

export default Dropdown;