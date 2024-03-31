import React, { useEffect, useState } from 'react';
import Index from '../components/Index';
const { GoogleGenerativeAI } = require("@google/generative-ai");


export default function Home() {
  const [userIn, setUserIn] = useState("");
  const [sentences, setSentences] = useState([]);
  const [facts, setFacts] = useState([]);

  
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBPzz2sfZS2Zh7onhJdq-eJDwuNAeF0N4Q');

// ...

// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

// ...

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
    const prompt = "Write a story about a magic back  pack."

    model.generateContent(prompt).then((value) => {console.log(value)})
    // const response = await result.response;
    // const text = response.text();
    // console.log(text);

  }, [sentences]);



  return (
    <>
      <Index setUserContent={setUserContent} />
    </>
  );
}
