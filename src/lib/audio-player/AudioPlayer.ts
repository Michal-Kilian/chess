export type MoveSoundType =
    | "move"
    | "check"
    | "capture"
    | "castle"
    | "promote";

const moveSelfSoundFile: string = "/src/assets/audio/move-self.mp3";
const moveCheckSoundFile: string = "/src/assets/audio/move-check.mp3";
const captureSoundFile: string = "/src/assets/audio/capture.mp3";
const castleSoundFile: string = "/src/assets/audio/castle.mp3";
const promoteSoundFile: string = "/src/assets/audio/promote.mp3";

const moveSelfSound: HTMLAudioElement = new Audio(moveSelfSoundFile);
const moveCheckSound: HTMLAudioElement = new Audio(moveCheckSoundFile);
const captureSound: HTMLAudioElement = new Audio(captureSoundFile);
const castleSound: HTMLAudioElement = new Audio(castleSoundFile);
const promoteSound: HTMLAudioElement = new Audio(promoteSoundFile);

moveSelfSound.load();
moveCheckSound.load();
captureSound.load();
castleSound.load();
promoteSound.load();

export const playMoveSound = (moveSoundType: MoveSoundType) => {
    let moveSound: HTMLAudioElement;

    switch (moveSoundType) {
        case "move":
            moveSound = moveSelfSound;
            break;
        case "check":
            moveSound = moveCheckSound;
            break;
        case "capture":
            moveSound = captureSound;
            break;
        case "castle":
            moveSound = castleSound;
            break;
        case "promote":
            moveSound = promoteSound;
            break;
        default:
            moveSound = moveSelfSound;
    }

    moveSound.currentTime = 0;
    moveSound.play().catch(error => {
        console.warn("Failed to play a sound:", error);
    });
};