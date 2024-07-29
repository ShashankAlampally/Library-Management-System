import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const Item = (props) => {
  return (
    <div className='d-flex flex-column align-items-center'>
      <div>
      {props.data}
      </div>
      <div className='mt-2'>
        <p>
          {props.name}
        </p>
      </div>
    </div>
  )
}

export default Item
