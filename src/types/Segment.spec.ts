import ByteRange from './ByteRange';
import DateRange from './DateRange';
import Key from './Key';
import MediaInitializationSection from './MediaInitializationSection';
import Segment from './Segment';
import SpliceInfo from './SpliceInfo';
import PartialSegment from './PartialSegment';

describe('Segment', () => {
    let segment: Segment;
    beforeEach(() => {
        segment = new Segment({
            duration: 5,
            uri: 'theuri',
        });
    });
    describe('constructor', () => {
        it('should allow construction with minimal/default values', () => {
            expect(segment).toBeDefined();
            expect(segment.type).toBe('segment');
            expect(segment.uri).toBe('theuri');
            expect(segment.duration).toBe(5);
            expect(segment.data).toBeUndefined();
            expect(segment.title).toBeUndefined();
            expect(segment.discontinuity).toBeFalse();
            expect(segment.byterange).toBeUndefined();
            expect(segment.dateRange).toBeUndefined();
            expect(segment.discontinuitySequence).toBe(0);
            expect(segment.key).toBeNull();
            expect(segment.map).toBeNull();
            expect(segment.markers).toBeArrayOfSize(0);
            expect(segment.mediaSequenceNumber).toBe(0);
            expect(segment.mimeType).toBeUndefined();
            expect(segment.parts).toBeArrayOfSize(0);
            expect(segment.programDateTime).toBeUndefined();
        });

        it('should allow construction with explicit values', () => {
            const dateRate = new DateRange({ id: 'foo' });
            const key = new Key({ method: 'NONE' });
            const map = new MediaInitializationSection({ uri: 'baz' });
            const part = new PartialSegment({ uri: 'biz' });
            const byteRange: ByteRange = {
                length: 8,
                offset: 3,
            };
            const marker = new SpliceInfo({ type: 'IN' });

            const result = new Segment({
                duration: 5,
                uri: 'theuri',
                data: 'thedata',
                title: 'thetitle',
                discontinuity: true,
                byterange: byteRange,
                dateRange: dateRate,
                discontinuitySequence: 9,
                key: key,
                map: map,
                markers: [marker],
                mediaSequenceNumber: 100,
                mimeType: 'text',
                parts: [part],
                programDateTime: new Date(100),
            });
            expect(result).toBeDefined();
            expect(result.type).toBe('segment');
            expect(result.uri).toBe('theuri');
            expect(result.duration).toBe(5);
            expect(result.data).toBe('thedata');
            expect(result.title).toBe('thetitle');
            expect(result.discontinuity).toBeTrue();
            expect(result.byterange).toBe(byteRange);
            expect(result.dateRange).toBe(dateRate);
            expect(result.discontinuitySequence).toBe(9);
            expect(result.key).toBe(key);
            expect(result.map).toBe(map);
            expect(result.markers).toEqual([marker]);
            expect(result.mediaSequenceNumber).toBe(100);
            expect(result.mimeType).toBe('text');
            expect(result.parts).toEqual([part]);
            expect(result.programDateTime).toEqual(new Date(100));
        });
    });

    describe('get endTime()', () => {
        it('should return null if no programDateTime is specified', () => {
            segment = new Segment({ uri: 'uri', duration: 5 });
            expect(segment.endTime).toBeNull();
        });

        it('should return new date based off programDateTime and duration if programDateTime is specified', () => {
            segment = new Segment({ uri: 'uri', duration: 5, programDateTime: new Date(0) });
            expect(segment.endTime).toEqual(new Date(5000)); // duration is 5 seconds
        });
    });
});
