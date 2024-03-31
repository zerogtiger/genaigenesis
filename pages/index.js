import React, { useEffect, useState } from 'react';
import Index from '../components/Index';
const { GoogleGenerativeAI } = require("@google/generative-ai");


export default function Home() {
  const [userIn, setUserIn] = useState("");
  const [sentences, setSentences] = useState([]);
  const [facts, setFacts] = useState([]);
  const [factsOrig, setFactsOrig] = useState([]);
  const [urls, setUrls] = useState([]);
  const [verdict, setVerdict] = useState([]);
  const [finalPercent, setFinalPercent] = useState(1.0);

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI('AIzaSyBPzz2sfZS2Zh7onhJdq-eJDwuNAeF0N4Q');

  // For text-only input, use the gemini-pro model
  let model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const setUserContent = () => {
    document.getElementById('out').innerHTML = "VerifAing...";
    setUserIn(document.getElementById('userIn').value);
    setFinalPercent(1.0);
  };

  useEffect(() => {
    // console.log(userIn);
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
    const prompt = "extract the given statements from the following text and list them in point form: \n" + userIn;
    model.generateContent(prompt).then((value) => {
      const text = value.response.text();
      setFactsOrig(text);
      // console.log(text);
      const split = text.split("\n");
      // console.log(split);
      for (let i = split.length - 1; i >= 0; i--) {
        if (split[i].substring(0, 2) === "- " || split[i].substring(0, 2) === "* ") {
          split[i] = split[i].substring(2);
        }
        else {
          split.splice(i, 1);
        }
      }
      for (let i = split.length; i >= 0; i--) {
        if (split[i] && split[i].match("Statement") && split[i].match("Statement").length > 0 || split[i] === "") {
          split.splice(i, 1);
        }
      }
      console.log(split);
      setFacts(split);
    })
    // console.log(sentences);
    // code on calling Gemini
    // const prompt = "Write a story about a magic backpack."

    // model.generateContent(prompt).then((value) => { console.log(value.response.text()) })
    // const response = await result.response;
    // const text = response.text();
    // console.log(text);

  }, [sentences]);

  useEffect(() => {
    //     verify each of these statements and provide an external source for each. format as: 
    // statement
    // 1a. validity (verified/partially verified/unverifiable)
    // 1b. external source
    const prompt = "verify each of these statements and provide an external source for each. format as: \n statement\n 1a. validity (verified/partially verified/unverifiable)\n 1b. external source" + factsOrig;
    console.log(prompt);
    model.generateContent(prompt).then((value) => {
      const text = value.response.text();
      console.log(text);
      const tmpverdict = [0, 0, 0];
      // console.log();
      tmpverdict[2] = text.toLowerCase().split("verified").length - 1;
      tmpverdict[1] = text.toLowerCase().split("partially verified").length - 1
      tmpverdict[0] = text.toLowerCase().split("unverifiable").length - 1
      setVerdict(tmpverdict);
      const urls = getURL(text);
      setUrls(urls);
      console.log(tmpverdict);
      let tmpFP = finalPercent;
      tmpFP *= ((tmpverdict[2] - tmpverdict[1]) / (tmpverdict[0] + tmpverdict[2]));
      tmpFP *= (1 - (tmpverdict[0]) / (tmpverdict[0] + tmpverdict[2]));
      setFinalPercent(tmpFP);
      // console.log(urls);
      // const split = text.split("\n");
      // const fact = [];
      // const verdict = [];
      // console.log(split);
      // for (let i = split.length - 1; i >= 0; i--) {
      //   if (i % 3 === 0) {
      //     fact.push(split[i]);
      //   }
      //   else if (i % 3 === 0) {
      //     verdict.push(split[i] === "Verified" ? 2 : split[i] === "Partially verified" ? 1 : 0);
      //   }
      // }
      // console.log(text);
      // console.log(fact);
      // console.log(verdict);
      // console.log(urls);
      //
      // setFacts(fact);
      // setVerdict(verdict);
      // setUrls(urls);
    })
  }, [facts]);

  const getURL = (text) => {
    var matches = text.match(/\bhttps?:\/\/\S+/gi);
    return matches;
  }

  useEffect(() => {
    if (userIn === "" || urls === null) {

    }
    else {
      const S = sentences.length
      const F = facts.length // number of facts
      const I = URL.length // ideal sources length
      const T = userIn.length
      let FR = Math.trunc(T / 250); // number of fact queries
      let SR = Math.trunc(T / 50); // number of sentence queries
      FR = 2; // rate limit issues
      for (let i = 0; i < FR; i++) {
        const A = Math.trunc(Math.random(F));  // fact 1
        const B = Math.trunc(Math.random(F));  // fact 2
        const C = Math.trunc(Math.random(I)); // sources
        model.generateContent("Is the following facts mentioned in this source? Please give the verdict as either Present or Not present\n Fact:" + facts[A] + " " + facts[B] + "\n Source: " + urls[C]).then((value) => {
          const text = value.response.text();
          console.log(text);
          if (text === "Not present")
            setFinalPercent(finalPercent * 0.9)
        })
      }
      SR = 2; // rate limit issues
      for (let i = 0; i < SR; i++) {
        const A = Math.random(S);  // sentences
        const B = Math.random(I);  // sources
        model.generateContent("Is the following statements mentioned in this source? Please give the verdict as either Present or Not present\n Fact:" + sentences[A] + "\n Source: " + urls[B]).then((value) => {
          const text = value.response.text();
          console.log(text);
          if (text === "Not present")
            setFinalPercent(finalPercent * 0.9)
        })
      }
    }
  }, [urls]);

  useEffect(() => {
    if (Number.isNaN(finalPercent) || !urls || !facts) {
      document.getElementById('out').innerHTML = "VerifAing...";
    }
    else {
      let final = "Final Score " + Math.trunc(finalPercent * 100.0) + "/100\n";
      final += "Extracted facts:\n";
      facts.forEach((element) => final += "- Found statement: " + element + "\n");
      final += "Sources referenced:\n";
      urls.forEach((element) => final += "- Source referenced: " + element + "\n");
      console.log(finalPercent);
      document.getElementById('out').innerHTML = final;
    }
  }, [finalPercent])

  return (
    <>
      <Index setUserContent={setUserContent} finalPercent={finalPercent} />
    </>
  );
}
