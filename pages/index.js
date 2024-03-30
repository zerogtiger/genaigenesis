import React, { useEffect, useState } from 'react';
import Index from '../components/Index';

export default function Home() {
  const [userIn, setUserIn] = useState("");
  const [sentences, setSentences] = useState([]);
  const [facts, setFacts] = useState([]);

  const setUserContent = () => {
    setUserIn(document.getElementById('userIn').value);
  };

  useEffect(() => {
    console.log(userIn);
    const sentences = [];
    const words = userIn.split(".");
    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j <= words.length; j++) {
            sentences.push(words.slice(i, j).join("."));
        }
    }
    setSentences(sentences);
  }, [userIn]);

  useEffect(() => {
    console.log(sentences);
    // code on calling Gemini
    

  }, [sentences]);

  return (
    <>
      <Index setUserContent={setUserContent} />
    </>
  );
}
