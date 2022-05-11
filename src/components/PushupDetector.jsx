import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'
import Webcam from 'react-webcam';

const GOING_DOWN = 0
const GOING_UP = 1
const phaseNames = ['GOING_DOWN', 'GOING_UP']

const PushupDetector = ({setPushupCount, pushupCount}) => {
  //const [pushupCount, setPushupCount] = useState(0)
  const [pushUpPhase, setPushUpPhase] = useState(GOING_DOWN)
  const [aiReady, setAiReady] = useState(false)
  const [detector, setDetector] = useState()
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const pushUpPhaseRef = useRef(GOING_DOWN)

  useEffect(() => {
    pushUpPhaseRef.current = pushUpPhase
  }, [pushUpPhase])

  const webcamstyle = {
    zindex: 9,
    width: 460,
    height: 346,
    borderRadius: "20px",
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  }

  const canvasstyle = {
    zindex: 10,
    width: 460,
    height: 346,
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  }

  const cameraContainerStyle = {
    height: "400px",
    width: "500px",
  }

  const videoConstraints = {
    facingMode: "user"
  }  

  const runPoseDetector = async () => {
    await tf.ready()
    setAiReady(true)
    setInterval(() => {
      detect()
    }, 200);
  }

  const calculateHandAngle = (shoulderPos, elbowPos, wristPos) => {
    //find vector components
    var dAx = shoulderPos.x - elbowPos.x;
    var dAy = shoulderPos.y - elbowPos.x;
    var dBx = wristPos.x - elbowPos.x;
    var dBy = wristPos.y - elbowPos.y;
    var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    if(angle < 0) {angle = angle * -1;}
    var degree_angle = angle * (180 / Math.PI);
    return degree_angle | 0;
  }

  const drawHand = (ctx, shoulderPos, elbowPos, wristPos) => {
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 2
    ctx.moveTo(shoulderPos.x, shoulderPos.y);
    ctx.lineTo(elbowPos.x, elbowPos.y);
    ctx.lineTo(wristPos.x, wristPos.y);
    ctx.stroke();
    ctx.closePath();
  }

  const initSetup = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    setDetector(detector)
  }

  const detect = async () => {
    const webcam = webcamRef.current;
    if(!detector || !webcam || webcam?.video?.readyState !== 4) {
      return
    }

    // Get Video Properties
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;    

    const poses = await detector.estimatePoses(webcam.video);
    if(!poses) {
      return
    }

    const leftShoulder = poses[0].keypoints[5];
    const rightShoulder = poses[0].keypoints[6];
    const leftElbow = poses[0].keypoints[7];
    const rightElbow = poses[0].keypoints[8];
    const leftWrist = poses[0].keypoints[9];
    const rightWrist = poses[0].keypoints[10];

    const leftScoreTotal = leftShoulder.score + leftElbow.score + leftWrist.score;
    const rightScoreTotal = rightShoulder.score + rightElbow.score + rightWrist.score;

    const angleLeft = calculateHandAngle(leftShoulder, leftElbow, leftWrist);
    const angleRight = calculateHandAngle(rightShoulder, rightElbow, rightWrist);
    //console.log(JSON.stringify(poses))
    //console.log('angleLeft: ' + angleLeft + '/' + leftScoreTotal)
    //console.log('angleRight: ' + angleRight + '/' + rightScoreTotal)

    if(((angleLeft > 130 && leftScoreTotal > 1.8) || 
        (angleRight > 130 && rightScoreTotal > 1.8)) && 
        pushUpPhaseRef.current === GOING_UP) {
      setPushupCount(prevPushupCount => prevPushupCount + 1)
      setPushUpPhase(GOING_DOWN)
    } else if(((angleLeft < 110 && leftScoreTotal > 1.8) ||
        (angleRight < 110 && rightScoreTotal > 1.8)) && 
        pushUpPhaseRef.current === GOING_DOWN) {
      setPushUpPhase(GOING_UP)
    }

    // Draw on canvas
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    drawHand(ctx, poses[0].keypoints[5], poses[0].keypoints[7], poses[0].keypoints[9])
    drawHand(ctx, poses[0].keypoints[6], poses[0].keypoints[8], poses[0].keypoints[10])

  }

  useEffect(() => {
    runPoseDetector()
  }, [detector])

  useEffect(() => {
    initSetup()
    return () => {
      initSetup()
    }
  }, [])

  return (
    <div>
      <h1>Pushup Detector {!aiReady && ' - Loading...'}</h1>
      <h2>COUNT: {pushupCount} PHASE: {phaseNames[pushUpPhase]}</h2>
      <div id="camera" style={cameraContainerStyle}>
        <Webcam 
          ref={webcamRef}
          style={webcamstyle} 
          audio={false}
          videoConstraints={videoConstraints}
        />
        <canvas 
          ref={canvasRef} 
          style={canvasstyle} />
      </div>
    </div>
  )
}

export default PushupDetector
