
class DummyWorkletProcessor {
  constructor(options) {

    


    return;
  }
}

class WorkletScriptProcessor extends DummyWorkletProcessor {
  constructor(options) {

    if (options) {

      console.log(options);

      if (options.context) {
        var context = options.context;
      }

      if (options.scopeVariables) {
        var scope = options.scopeVariables;
      }
    }

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
  
  // We cannot instantiate AudioWorkletProcessor outside of WorkletNode creation
  processorString = processorString.replace("DummyWorkletProcessor", "AudioWorkletProcessor");

  console.log(processFunction.toString())

  let functionContents = processFunction.toString();

  // Strip outermost brackets and everything outside of it
  functionContents = functionContents.replace(/^[^{]+\{/g, '');
  functionContents = functionContents.replace(/\}$/g, '');
  
  const processorRegex = /audioprocess+\(event\) \{([^}]*)\}/g
  const processorContents = processorRegex.exec(processorString)[1].trim();

  // Replace the body
  processorString = processorString.replace(processorContents, functionContents);

  // prepare for instantiate
  processorString = processorString.concat("\nregisterProcessor('worklet-script-processor', WorkletScriptProcessor)");

  console.log(processorString);

  return window.URL.createObjectURL(new Blob([processorString], {
    type: "application/javascript; charset=utf-8"
  }));
}

export default getCustomProcessorUrl;