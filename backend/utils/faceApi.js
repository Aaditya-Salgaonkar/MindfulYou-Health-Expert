const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

const loadModels = async () => {
  if (modelsLoaded) return;

  const modelPath = path.join(__dirname, '..', 'models');
  await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
  await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);

  modelsLoaded = true;
};

const detectEmotionFromImage = async (base64Image) => {
  await loadModels();

  // ✅ Load from base64 string
  const img = await canvas.loadImage(base64Image);

  // ✅ Detect all faces
  const detections = await faceapi
    .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  // ✅ Handle no faces
  if (!detections.length) return { emotion: null, confidence: null };

  // ✅ Get emotions from the first face
  const expressions = detections[0].expressions;

  // ✅ Sort emotions by confidence
  const sorted = Object.entries(expressions)
    .sort((a, b) => b[1] - a[1]);

  const [topEmotion, confidence] = sorted[0];

  return { emotion: topEmotion, confidence };
};

module.exports = { detectEmotionFromImage };
