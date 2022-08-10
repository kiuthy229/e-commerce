import React from 'react'
import './Cart.css';
export default function Success() {
  return (
    <div className='success'>
      <div className='title'>Thank you for shopping with SunClothing ! 💚</div>
      <div><a id='homepageRedirect' href='/'>Return to Homepage</a></div>
    </div>
  );
}
