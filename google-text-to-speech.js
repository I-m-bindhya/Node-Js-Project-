const gTts = require('gtts');

const speech = "Hai Bindhya...This is from google text to speech...";
const gtts = new gTts(speech,"en")

gtts.save("speech.mp3",()=>{
    console.log("Saved")
});