import getCustomProcessorUrl from "./worklet-script-processor.js";

let processorString;

class WorkletScriptNode extends AudioWorkletNode {
  /**
   * @constructor
   * @param {BaseAudioContext} context The associated BaseAudioContext.
   * @param 
   */
  constructor(context, bufferSize, numInput, numOutput, processorName, options) {
    super(context, processorName, {
      ...options,
      processorOptions: {
        bufferSize,
        numInput,
        numOutput
      }
    });
  }
}

async function createWorkletScriptNode(context, bufferSize, numInput, numOutput, processFunction, options) {

    const processorName = "worklet-script-processor";

    // Prepare processor string
    const processorURL = getCustomProcessorUrl(processFunction);

    await context.audioWorklet.addModule(processorURL);

    return new WorkletScriptNode(context, bufferSize, numInput, numOutput, processorName, options);
}


export default createWorkletScriptNode