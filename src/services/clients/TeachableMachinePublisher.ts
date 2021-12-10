import * as speechCommands from '@tensorflow-models/speech-commands';
import {
  SpeechCommandRecognizer,
  SpeechCommandRecognizerResult,
} from '@tensorflow-models/speech-commands';
import { TeachableConfig } from '../../utils/loadConfig';

export type TeachableMachineResultCallback = (
  className: string,
  probability: number | Float32Array
) => void;

export default class TeachableMachinePublisher {
  private recognizer?: SpeechCommandRecognizer;
  private url: string;
  private overlapFactor: number;
  private probabilityThreshold: number;
  private ignoreBGclass: boolean;

  public constructor(config: TeachableConfig) {
    this.url = config.url;
    this.overlapFactor = config.overlapFactor;
    this.probabilityThreshold = config.probabilityThreshold;
    this.ignoreBGclass = config.ignoreBGclass;
  }

  public start = async (
    callback: TeachableMachineResultCallback
  ): Promise<void> => {
    const recognizer = await this.createModel();
    const classLabels = recognizer.wordLabels();
    let startIndex = this.ignoreBGclass ? 1 : 0;

    recognizer.listen(
      async (result: SpeechCommandRecognizerResult): Promise<void> => {
        for (let i = startIndex; i < classLabels.length; i++) {
          callback(classLabels[i], result.scores[i]);
        }
      },
      {
        includeSpectrogram: true,
        probabilityThreshold: this.probabilityThreshold,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: this.overlapFactor,
      }
    );
  };

  public stop = (): void => {
    if (this.recognizer) this.recognizer.stopListening();
  };

  private createModel = async (): Promise<SpeechCommandRecognizer> => {
    const checkpointURL = this.url + 'model.json';
    const metadataURL = this.url + 'metadata.json';

    const recognizer = speechCommands.create(
      'BROWSER_FFT',
      undefined,
      checkpointURL,
      metadataURL
    );

    await recognizer.ensureModelLoaded();
    this.recognizer = recognizer;
    return recognizer;
  };
}
