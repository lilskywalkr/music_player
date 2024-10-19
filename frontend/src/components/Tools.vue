<script setup>
import {Howl, Howler} from 'howler';
import {ref, onMounted, defineEmits} from 'vue'
import { getMusic } from '@@/requestHandler';
import * as META_TOOLS from 'music-metadata';

// references
const audios = ref(null);
const musicBlobs = ref(null);
const audiosIterator = ref(0);
const sound = ref(null);
const stop = ref(false);

// emits
const emit = defineEmits(['metadata']);

class Sound {
    #src;
    #html5;
    #volume;
    #loop;

    // this is a reference to the Howl sound instance
    soundReference

    constructor(src, html5, volume, loop) {
        this.#src = src;
        this.#html5 = html5,
        this.#volume = volume,
        this.#loop = loop

        this.#initSound();
    }

    #initSound() {
        this.soundReference = new Howl({
            src: this.#src,
            html5: this.#html5,
            format: ['dolby', 'webm', 'mp3', 'ogg'],
            volume: this.#volume,
            loop: this.#loop
        });
    }

    playSound() {
        // if the sound is not initiated
        if (!this.soundReference) {
            this.#initSound();
        }
        this.soundReference.play();
    }

    pauseSound() {
        // if the sound instance exists
        if (this.soundReference) {
            this.soundReference.pause();
        }
    }

    destroyCurrentSound() {
        // if the sound instance exists
        if (this.soundReference) {
            this.soundReference.stop();
            this.soundReference.unload();
            this.soundReference = null;
            sound.value = null;
        }
    }
}

const instantiate = async (fileLink) => {
    console.log("track link: ", fileLink)
    if (!sound.value) {
        sound.value = new Sound(fileLink, true, 0.8, false);
        sound.value.soundReference.on("end", () => console.log("Finished!"));
    }
};

const getMusicBuffers = async () => {
    const music = await getMusic(); // getting music files ad buffers from mysql
    const musicBuffers = music.map(e => e.file.data);   // mapping over the array of objects and returning arrays of buffers
    musicBlobs.value = musicBuffers.map(buffer => new Blob([new Uint8Array(buffer)], { type: 'audio/mpeg' }));  // converting buffers to blobs
    const musicBlobsUrls = musicBlobs.value.map(blob => URL.createObjectURL(blob));   // creating urls to blobs

    // getting metadata from blob music file
    const metadata = await META_TOOLS.parseBlob(musicBlobs.value[0]);
    sendMetaData(metadata)  // emitting metadata to parent component

    console.log(musicBlobsUrls)
    return musicBlobsUrls
}

const nextAudio = async () => {
    // If the sound is initianted
    if (sound.value) {
        sound.value.destroyCurrentSound();
        // circulating the iterator
        await instantiate(audios.value[(audiosIterator.value += (audiosIterator.value < audios.value.length - 1 ? 1 : -audiosIterator.value))]);

        // If the music is playing keep playing
        if (!!stop.value) {
            sound.value.playSound();
        }
    } else {
        // circulating the iterator
        await instantiate(audios.value[(audiosIterator.value += (audiosIterator.value < audios.value.length - 1 ? 1 : -audiosIterator.value))]);
    }

    // getting metadata from blob music file and emitting it to parent component
    const metadata = await META_TOOLS.parseBlob(musicBlobs.value[audiosIterator.value]);
    sendMetaData(metadata)
}

const prevAudio = async () => {
    // If the sound is initianted
    if (sound.value) {
        sound.value.destroyCurrentSound();
        // circulating the iterator
        await instantiate(audios.value[(audiosIterator.value += (audiosIterator.value < 1 ? -audiosIterator.value + (audios.value.length - 1) : -1))]);
        
        // If the music is playing keep playing
        if (!!stop.value) {
            sound.value.playSound();
        }
    } else {
        // circulating the iterator
        await instantiate(audios.value[(audiosIterator.value += (audiosIterator.value < 1 ? -audiosIterator.value + (audios.value.length - 1) : -1))]);
    }

    // getting metadata from blob music file and emitting it to parent component
    const metadata = await META_TOOLS.parseBlob(musicBlobs.value[audiosIterator.value]);
    sendMetaData(metadata)
}

const sendMetaData = (metada) => {
  emit('metadata', metada);
};

onMounted(async () => {
    audios.value = await getMusicBuffers();
})
</script>

<template>
    <div class="tools">
        <div class="buttons">
            <button @click="prevAudio" ref="prevButton" class="tools_prev">
                <img src="$/icons/prev.png" alt="prev button">
            </button>

            <button @click="async () => {await instantiate(audios[audiosIterator]); sound.playSound(); stop = !stop}" v-if="!stop" ref="playButton" class="tools_play">
                <img src="$/icons/play.png" alt="play button">
            </button>

            <button @click="() => {sound.pauseSound(); stop = !stop}" v-else ref="pauseButton" class="tools_pause">
                <img src="$/icons/pause.png" alt="pause button">
            </button>
            
            <button @click="nextAudio" ref="nextButton" class="tools_next">
                <img src="$/icons/next.png" alt="next button">
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .tools {
        width: 10em;
        // background: red;
        
        .buttons {
            width: 100%;
            display: flex;
            justify-content: space-between;

            button {
                border: none;
                background: transparent;
                cursor: pointer;

                img {
                    width: 2em;
                }
            }
        }
    }
</style>