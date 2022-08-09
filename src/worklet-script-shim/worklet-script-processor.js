
class DummyWorkletProcessor {
  constructor(options) {
    return;
  }
}

class WorkletScriptProcessor extends DummyWorkletProcessor {
  constructor(options) {
    console.log("Worklet constructor called");
    console.log(options);
    super(options);
  }

  process(inputs, outputs, params) {
    this.audioprocess({
      playbackTime: 0,
      inputBuffer: inputs[0],
      outputBuffer: outputs[0],
    });
  }

  audioprocess(event) {
    console.log("AudioProcess not yet defined.");
  }
}

function getCustomProcessorUrl(processFunction) {
  let processorString = WorkletScriptProcessor.toString();
  
  // cannot instantiate AudioWorkletProcessor outside of WorkletNode creation
  processorString = processorString.replace("DummyWorkletProcessor", "AudioWorkletProcessor");

  const functionRegex = /\{([^}]*)\}/g
  const functionContents = functionRegex.exec(processFunction)[1].trim();
  
  const processorRegex = /audioprocess+\(event\) \{([^}]*)\}/g
  const processorContents = processorRegex.exec(processorString)[1].trim();

  processorString = processorString.replace(processorContents, functionContents);

  // prepare for instantiate
  processorString = processorString.concat("\nregisterProcessor('worklet-script-processor', WorkletScriptProcessor)");

  return window.URL.createObjectURL(new Blob([processorString], {
    type: "application/javascript; charset=utf-8"
  }));
}


export default getCustomProcessorUrl;