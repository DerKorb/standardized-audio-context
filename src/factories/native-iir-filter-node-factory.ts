import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeIIRFilterNodeFactoryFactory } from '../types';

export const createNativeIIRFilterNodeFactory: TNativeIIRFilterNodeFactoryFactory = (createNativeIIRFilterNodeFaker) => {
    return (nativeContext, options) => {
        // Bug #9: Safari does not support IIRFilterNodes.
        if (nativeContext.createIIRFilter === undefined) {
            return createNativeIIRFilterNodeFaker(nativeContext, options);
        }

        const nativeIIRFilterNode = nativeContext.createIIRFilter(<number[]> options.feedforward, <number[]> options.feedback);

        assignNativeAudioNodeOptions(nativeIIRFilterNode, options);

        return nativeIIRFilterNode;
    };
};
