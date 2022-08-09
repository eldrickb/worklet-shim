import getCustomProcessorUrl from "./worklet-script-processor.js";

let processorString;

class WorkletScriptNode extends AudioWorkletNode {
  /**
   * @constructor
   * @param {BaseAudioContext} context The associated BaseAudioContext.
   * @param 
   */
  constructor(context, bufferSize, numInput, numOutput, options) {

    // TODO merge options better

    const thisOptions = {
      
      processorOptions: {
        bufferSize,
        sampleRate: context.sampleRate,
        numInput,
        numOutput,
      }
    }

    super(context, "worklet-script-processor", {
      ...options,
      ...thisOptions
    });
  }
}

async function createWorkletScriptNode(context, processFunction, bufferSize, options, numInput, numOutput) {
    const processorName = "worklet-script-processor";

    // Prepare processor string
    const processorURL = getCustomProcessorUrl(processFunction);

    await context.audioWorklet.addModule(processorURL);

    return new WorkletScriptNode(context, bufferSize, numInput, numOutput, options);
}


export default createWorkletScriptNode