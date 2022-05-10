import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs'
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'
import Webcam from 'react-webcam';

const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

const PushupDetector = () => {
  const [pushupCount, setPushupCount] = useState(0)
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const webcamstyle = {
    textAlign: "center",
    zindex: 9,
    width: 460,
    height: 346,
    borderRadius: "20px",
  }

  const videoConstraints = {
    facingMode: "user"
  }  

  const runPoseDetector = async () => {
    setInterval(() => {
      detect()
    }, 1000);
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
    return degree_angle;
  }

  const detect = async () => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    if(!webcam || !canvas || webcam?.video?.readyState !== 4) {
      return
    }
    const poses = await detector.estimatePoses(webcam.video);
    const angleLeft = calculateHandAngle(poses[0].keypoints[5], poses[0].keypoints[7], poses[0].keypoints[9])
    const angleRight = calculateHandAngle(poses[0].keypoints[6], poses[0].keypoints[8], poses[0].keypoints[10])
    console.log(JSON.stringify(poses))
    console.log('angleLeft: ' + angleLeft + ' angleRight: ' + angleRight)
}

  useEffect(() => {
    runPoseDetector()
  }, [])

  return (
    <div>
      <h1>Pushup Detector</h1>
      <h2>{pushupCount}</h2>
      <div id="camera">
        <Webcam 
          ref={webcamRef}
          style={webcamstyle} 
          audio={false}
          videoConstraints={videoConstraints}
        />
        <canvas ref={canvasRef} style={webcamstyle} />
      </div>
    </div>
  )
}

export default PushupDetector
