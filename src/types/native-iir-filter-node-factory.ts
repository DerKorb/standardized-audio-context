import { IIIRFilterOptions } from '../interfaces';
import { TNativeContext } from './native-context';
import { TNativeIIRFilterNode } from './native-iir-filter-node';

export type TNativeIIRFilterNodeFactory = (nativeContext: TNativeContext, options: IIIRFilterOptions) => TNativeIIRFilterNode;
