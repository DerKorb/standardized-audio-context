import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { spy/*, stub*/ } from 'sinon';
import { unpatchedOfflineAudioContextConstructor } from '../../../../src/unpatched-offline-audio-context-constructor';
import { window as wndw } from '../../../../src/window';

describe('offlineAudioContextConstructor', function () {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(function () {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                { provide: unpatchedOfflineAudioContextConstructor, useFactory: unpatchedOfflineAudioContextConstructor },
                { provide: wndw, useValue: window }
            ]);
        /* eslint-enable indent */

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createBufferSource()', function () {

        // bug #14

        it('should not resample an oversampled AudioBuffer', function (done) {
            var audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200),
                audioBufferSourceNode = offlineAudioContext.createBufferSource(),
                eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = (Math.random() * 2) - 1;
            }

            audioBuffer.copyToChannel(new Float32Array(eightRandomValues), 0);

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.start(0);
            audioBufferSourceNode.connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((buffer) => {
                    var channelData = new Float32Array(4);

                    buffer.copyFromChannel(channelData, 0);

                    expect(channelData[0]).to.closeTo(eightRandomValues[0], 0.0000001);
                    expect(channelData[1]).to.closeTo(eightRandomValues[2], 0.0000001);
                    expect(channelData[2]).to.closeTo(eightRandomValues[4], 0.0000001);
                    expect(channelData[3]).to.closeTo(eightRandomValues[6], 0.0000001);

                    done();
                });
        });

    });

    describe('decodeAudioData()', function () {

        // bug #3

        it('should reject the promise with a TypeError', function (done) {
            offlineAudioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err).to.be.an.instanceOf(TypeError);

                    expect(err.message).to.equal("Failed to execute 'decodeAudioData' on 'BaseAudioContext': parameter 1 is not of type 'ArrayBuffer'.");

                    done();
                });
        });

        // bug #6

        it('should not call the errorCallback at all', function (done) {
            var errorCallback = spy();

            offlineAudioContext.decodeAudioData(null, function () {}, errorCallback);

            setTimeout(function () {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

    });

});
