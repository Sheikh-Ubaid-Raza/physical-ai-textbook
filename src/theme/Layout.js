import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import ChatWidget from '../components/ChatWidget/ChatWidget';

export default function Layout(props) {
  return (
    <>
      <OriginalLayout {...props}>
        {props.children}
      </OriginalLayout>
      <ChatWidget />
    </>
  );
}