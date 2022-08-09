// Copyright (c) 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const context = new AudioContext();

import createWorkletScriptNode from "./worklet-script-shim/worklet-script-node.js";

// Wait for user interaction to initialize audio, as per specification.
document.addEventListener('click', (element) => {
  init();
}, {once: true});

/**
 * Defines overall audio chain and initializes all functionality.
 */
async function init() {
  if (context.state === 'suspended') {
    await context.resume();
  }

  // Get user's microphone and connect it to the AudioContext.
  const micStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0,
    },
  });

  const micSourceNode = context.createMediaStreamSource(micStream);

  // Prepare buffer for recording.
  const recordBuffer = context.createBuffer(
      2,
      // 10 seconds seems reasonable for demo purposes.
      context.sampleRate * 10,
      context.sampleRate,
  );

  // Obtain samples passthrough function for visualizers
  const spNode = await setupScriptProcessor(recordBuffer);

  const monitorNode = context.createGain();
  const inputGain = context.createGain();
  const medianEnd = context.createGain();

  setupMonitor(monitorNode);
  setupRecording(recordBuffer);

  micSourceNode
      .connect(inputGain)
      .connect(medianEnd)
      .connect(spNode)
      .connect(monitorNode)
      .connect(context.destination);
}

async function setupScriptProcessor(recordBuffer) {

  let scriptNode = await createWorkletScriptNode(context, 128, 2, 2, (event) => {
    console.log("Real audio process called")
    console.log(event)
    console.log(event.inputBuffer.getChannelData(channel))
  });

  return scriptNode

}