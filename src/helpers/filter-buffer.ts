import { TTypedArray } from '../types';

// This implementation as shamelessly inspired by source code of
// tslint:disable-next-line:max-line-length
// {@link https://chromium.googlesource.com/chromium/src.git/+/master/third_party/WebKit/Source/platform/audio/IIRFilter.cpp|Chromium's IIRFilter}.
export const filterBuffer = (
    feedback: number[] | TTypedArray,
    feedbackLength: number,
    feedforward: number[] | TTypedArray,
    feedforwardLength: number,
    minLength: number,
    xBuffer: Float32Array,
    yBuffer: Float32Array,
    bufferIndex: number,
    bufferLength: number,
    input: Float32Array,
    output: Float32Array
) => {
    const inputLength = input.length;

    for (let j = 0; j < inputLength; j += 1) {
        let y = feedforward[0] * input[j];

        for (let k = 1; k < minLength; k += 1) {
            const x = (bufferIndex - k) & (bufferLength - 1); // tslint:disable-line:no-bitwise

            y += feedforward[k] * xBuffer[x];
            y -= feedback[k] * yBuffer[x];
        }

        for (let k = minLength; k < feedforwardLength; k += 1) {
            y += feedforward[k] * xBuffer[(bufferIndex - k) & (bufferLength - 1)]; // tslint:disable-line:no-bitwise
        }

        for (let k = minLength; k < feedbackLength; k += 1) {
            y -= feedback[k] * yBuffer[(bufferIndex - k) & (bufferLength - 1)]; // tslint:disable-line:no-bitwise
        }

        xBuffer[bufferIndex] = input[j];
        yBuffer[bufferIndex] = y;

        bufferIndex = (bufferIndex + 1) & (bufferLength - 1); // tslint:disable-line:no-bitwise

        output[j] = y;
    }

    return bufferIndex;
};
