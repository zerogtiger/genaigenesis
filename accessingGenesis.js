// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyC6R3u8ROnjDKTCns8A3o_S5nY9tc8rH4g");

// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

// ...
async function run() {
  const promptText = "how many pieces of gum to chew a day to meet nutritional goals, please cite sources"


  const result = await model.generateContent(promptText);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
