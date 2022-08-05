import React from 'react';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthenticated, load_user } from '../actions/auth';
import Box from '@material-ui/core/Box';


function Layout({ children, checkAuthenticated, load_user }) {


  useEffect(() => {
    checkAuthenticated();
  }, [checkAuthenticated]);

  useEffect(() => {
    load_user();
  }, [load_user]);

  return (
    <Box>
      {children}
    </Box>
  );
}



export default connect(null, { checkAuthenticated, load_user })(Layout);
