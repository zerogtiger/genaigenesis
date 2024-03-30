import React, { useState } from 'react';
import Index from '../components/Index';

export default function Home() {
  const [userIn, setUserIn] = useState("");

  const setUserContent = () => {
    setUserIn(document.getElementById('userIn').value);
    console.log(document.getElementById('userIn').value);
  };

  return (
    <>
      <Index setUserContent={setUserContent} />
    </>
  );
}
