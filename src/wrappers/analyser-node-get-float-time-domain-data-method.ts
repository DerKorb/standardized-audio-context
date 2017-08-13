import { IAnalyserNode } from '../interfaces';

export class AnalyserNodeGetFloatTimeDomainDataMethodWrapper {

    public wrap (analyserNode: IAnalyserNode) {
        analyserNode.getFloatTimeDomainData = (array: Float32Array) => {
            const byteTimeDomainData = new Uint8Array(array.length);

            analyserNode.getByteTimeDomainData(byteTimeDomainData);

            const length = Math.max(byteTimeDomainData.length, analyserNode.fftSize);

            for (let i = 0; i < length; i += 1) {
                array[i] = (byteTimeDomainData[i] - 128) * 0.0078125;
            }

            return array;
        };
    }

}
