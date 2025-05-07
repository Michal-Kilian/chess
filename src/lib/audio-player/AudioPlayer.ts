import { Accessor, createSignal, Setter } from 'solid-js';

export type MoveSoundType =
    | "moveSelf"
    | "moveOpponent"
    | "moveCheck"
    | "capture"
    | "castle"
    | "promote"
    | "premove"
    | "gameStart"
    | "gameEnd"
    | "illegal"
    | "tenseconds"
    | "notify";


export class AudioPlayer {
    private static sounds: Map<MoveSoundType, HTMLAudioElement> = new Map();

    private static soundFiles: Record<MoveSoundType, string> = {
        "moveSelf": "src/assets/audio/move-self.mp3",
        "moveOpponent": "src/assets/audio/move-opponent.mp3",
        "moveCheck": "src/assets/audio/move-check.mp3",
        "capture": "src/assets/audio/capture.mp3",
        "castle": "src/assets/audio/castle.mp3",
        "promote": "src/assets/audio/promote.mp3",
        "premove": "src/assets/audio/premove.mp3",
        "gameStart": "src/assets/audio/game-start.mp3",
        "gameEnd": "src/assets/audio/game-end.mp3",
        "illegal": "src/assets/audio/illegal.mp3",
        "tenseconds": "src/assets/audio/tenseconds.mp3",
        "notify": "src/assets/audio/notify.mp3",
    };

    private static _isMutedSignal: Accessor<boolean>;
    private static _setIsMutedSignal: Setter<boolean>;


    static {
        [AudioPlayer._isMutedSignal, AudioPlayer._setIsMutedSignal] = createSignal(false);

        for (const soundType in AudioPlayer.soundFiles) {
            const type = soundType as MoveSoundType;
            const filePath = AudioPlayer.soundFiles[type];

            const audio = new Audio(filePath);
            audio.load();

            audio.onerror = (event: string | Event) => {
                console.error(`Error loading audio file "${filePath}" for type "${type}":`, event);
            };

            AudioPlayer.sounds.set(type, audio);
        }
    }

    public static playSound(moveSoundType: MoveSoundType): void {
        if (AudioPlayer._isMutedSignal()) {
            return;
        }

        const soundToPlay = AudioPlayer.sounds.get(moveSoundType);

        if (!soundToPlay) {
            console.warn(`No audio element found for sound type "${moveSoundType}"`);
            return;
        }

        soundToPlay.currentTime = 0;

        soundToPlay.play().catch(error => {
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.warn(`Failed to play sound for type "${moveSoundType}":`, error);
            } else if (error.name === 'NotAllowedError') {
                console.info("Autoplay prevented. User interaction is needed to play audio.");
            }
        });
    };

    public static get isMutedSignal(): Accessor<boolean> {
        return AudioPlayer._isMutedSignal;
    };

    public static toggleMute(): void {
        const currentState = AudioPlayer._isMutedSignal();
        const newState = !currentState;

        AudioPlayer.sounds.forEach(audio => {
            audio.muted = newState;
        });

        AudioPlayer._setIsMutedSignal(newState);
    };

    private constructor() {
        throw new Error("AudioPlayer is a static utility class and should not be instantiated.");
    };
}
