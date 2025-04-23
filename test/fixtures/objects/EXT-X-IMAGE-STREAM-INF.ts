import {MasterPlaylist, Rendition, Variant, RenditionType, VariantType} from '../../../src/types';

const playlist = new MasterPlaylist({
    variants: createVariants(),
    independentSegments: true,
    version: 4
});

function createVariants() {
    const audioRendition = new Rendition<'AUDIO'>({
        type: 'AUDIO',
        language: 'eng',
        name: 'Alternate Audio',
        autoselect: true,
        isDefault: false,
        channels: '2',
        groupId: 'AAC',
        uri: 'index_audio_3000.m3u8',
    });
    const audio: Array<Rendition<'AUDIO'>> = [audioRendition];

    const variants = [];
    variants.push(
        new Variant({
            uri: 'index_video_3000.m3u8',
            bandwidth: 3643200,
            averageBandwidth: 3511200,
            codecs: 'avc1.64001f,mp4a.40.2',
            resolution: { width: 1280, height: 720 },
            frameRate: 30.000,
            audio,
        }),
    );
    variants.push(
        new Variant({
            uri: 'index_video_3000_I-Frame.m3u8',
            variantType: VariantType.IFrame,
            bandwidth: 1716000,
            averageBandwidth: 1650000,
            codecs: 'avc1.64001f',
            resolution: { width: 1280, height: 720 },
            frameRate: 30.000,
        }),
    );
    variants.push(
        new Variant({
            uri: 'index_video_1700.m3u8',
            bandwidth: 2156000,
            averageBandwidth: 2081200,
            codecs: 'avc1.4d401f,mp4a.40.2',
            resolution: { width: 960, height: 540 },
            frameRate: 30.000,
            audio,

        }),
    );
    variants.push(
        new Variant({
            bandwidth: 972400,
            averageBandwidth: 935000,
            codecs: 'avc1.4d401f',
            resolution: { width: 960, height: 540 },
            frameRate: 30.000,
            variantType: VariantType.IFrame,
            uri: 'index_video_1700_I-Frame.m3u8',
        }),
    );
    variants.push(
        new Variant({
            bandwidth: 1355200,
            averageBandwidth: 1311200,
            uri: 'index_video_1000.m3u8',
            codecs: 'avc1.4d401f,mp4a.40.2',
            resolution: { width: 800, height: 450 },
            frameRate: 30.000,
            audio,
        }),
    );
    variants.push(
        new Variant({
            bandwidth: 572000,
            averageBandwidth: 550000,
            codecs: 'avc1.4d401f',
            variantType: VariantType.IFrame,
            resolution: { width: 800, height: 450 },
            frameRate: 30.000,
            uri: 'index_video_1000_I-Frame.m3u8',
        }),
    );
    variants.push(
        new Variant({
            bandwidth: 783200,
            averageBandwidth: 761200,
            uri: 'index_video_500.m3u8',
            codecs: 'avc1.77.30,mp4a.40.2',
            resolution: { width: 640, height: 360 },
            frameRate: 30.000,
            audio,
        }),
    );
    variants.push(
        new Variant({
            bandwidth: 286000,
            averageBandwidth: 275000,
            codecs: 'avc1.77.30',
            variantType: VariantType.IFrame,
            resolution: { width: 640, height: 360 },
            frameRate: 30.000,
            uri: 'index_video_500_I-Frame.m3u8',
        }),
    );
    variants.push(
        new Variant({
            bandwidth: 554400,
            averageBandwidth: 541200,
            uri: 'index_video_300.m3u8',
            codecs: 'avc1.77.30,mp4a.40.2',
            resolution: { width: 480, height: 270 },
            frameRate: 30.000,
            audio,
        }),
    );
    variants.push(
        new Variant({
            bandwidth: 171600,
            averageBandwidth: 165000,
            codecs: 'avc1.77.30',
            variantType: VariantType.IFrame,
            resolution: { width: 480, height: 270 },
            frameRate: 30.000,
            uri: 'index_video_300_I-Frame.m3u8',
        }),
    );

    variants.push(
        new Variant({
            bandwidth: 40296,
            averageBandwidth: 19008,
            codecs: 'jpeg',
            variantType: VariantType.Image,
            resolution: { width: 480, height: 270 },
            uri: 'index_s3_trickmode.m3u8',
        }),
    );

    return variants;
}

export default playlist;
