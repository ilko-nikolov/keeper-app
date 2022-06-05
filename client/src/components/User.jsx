// components/User.jsx

import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

function User(props) {
  return (
    <div className="user">
    {props.user && (
      <div className='welcome-message'>
        <h2>Welcome, {props.user}</h2>
        &nbsp;
        <a href='#' onClick={props.onLogout} ><LogoutIcon fontSize='large' color='action'/></a>
      </div>
    )}
    </div>
  );
}

export default User;