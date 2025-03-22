import React from 'react';
import RegisterForm from './RegisterForm';

export default function Register({triggerLogin}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'centre',
        alignItems: 'centre',
        height: '100vh'
      }}
    >
      <RegisterForm triggerLogin={triggerLogin}/>
    </div>
  );
}