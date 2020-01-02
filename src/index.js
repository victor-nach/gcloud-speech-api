const recorder = require('node-record-lpcm16');
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
// Creates a client

const dotenv = require('dotenv');

dotenv.config();

const client = new speech.SpeechClient();
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-NG';
const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  single_utterance: true,
  interimResults: true,
};
// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error) 
  .on('data', data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : `\n\nReached transcription time limit, press Ctrl+C\n`
    )
  );
//   console.log(record);
// Start recording and send the microphone input to the Speech API
recorder
  .record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '1.0',
  })
  .stream()
  .on('error', console.error)
  .pipe(recognizeStream);


console.log('Listening, press Ctrl+C to stop.');