// components/Header.jsx

import React from 'react';
import User from './User';
import HighlightIcon from '@mui/icons-material/HighlightSharp';

function Header(props) {
  return (
    <header> 
      <h1><HighlightIcon fontSize='medium' />Keeper App</h1>
      &nbsp;
      <User user={props.user} onLogout={props.onLogout} />
    </header>
  );
}

export default Header;
