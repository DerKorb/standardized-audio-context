import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeIIRFilterNodeFakerFactory } from './native-iir-filter-node-faker-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeIIRFilterNodeFakerFactoryFactory = (
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory
) => TNativeIIRFilterNodeFakerFactory;
