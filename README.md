# Navigation Game

Balloons drift slowly across the sky, each one carrying a car on a timber deck
slung underneath. Prick a balloon with the pin and it sinks gently to the road,
where the car drives itself home. Fill the garage.

No build step, no dependencies — plain canvas and JavaScript.

## Play

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 4321
```

- **Click** a balloon's envelope to pierce it. The pin's tip is the hit point.
- **G** opens the garage.
- **Standard / Fast / Crazy** set how quickly balloons drift — 1x, 2x and 5x,
  with balloons sent up proportionally more often so the sky stays as full.
  The descent stays slow at every setting.
- **Effects** and **Music** are independent toggles. A pill is filled with a
  lit dot when that setting is *in force*, empty when it isn't — the same rule
  as the speed picker, so nothing has to be inferred from a label.
- The dropdown beside them picks the **track**. Choosing one turns the music on.

Every choice is remembered between sessions.

Balloons that drift off-screen are gone; the garage tracks how many got away.

## Sound

There are no audio files. Effects are short synthesised blips, and the music is
generated as it plays.

Three tracks share one engine — a track is a chord loop, a written-out melody
and a few tone settings, so adding a fourth is a data change:

| Track | |
| --- | --- |
| **Drift** | 78 bpm, F major sevenths, long echo — the default |
| **Sunny** | 104 bpm, brighter and busier, three notes to the beat |
| **Nocturne** | 62 bpm, A minor, sparse, mostly pad and space |

Each is a pad of detuned pairs, a bass, a stereo music-box arpeggio and the
melody, all with an echo send. Notes are scheduled half a second ahead of the
audio clock, so timing never rides on a JS timer. Switching track ducks out of
one and into the other rather than cutting.

Browsers block audio until the page has been interacted with, so playback
starts on your first tap or click.

### On phones

Mobile browsers are stricter, and the player accounts for it: the context is
unlocked with a silent one-sample buffer inside the first gesture, every
gesture gets another go at resuming rather than only the first, returning to
the tab resumes as well, and a scheduler that has fallen behind while the tab
was backgrounded skips to the present instead of dumping every missed note out
at once.

An iPhone puts Web Audio in the *ambient* audio session by default, which the
side ring/silent switch mutes — while Safari still shows the tab as playing
audio, so the page looks broken rather than muted. The game claims the
*playback* session instead (`navigator.audioSession.type`), which is what a
game with a soundtrack is for and plays through the switch. That needs iOS
16.4 or newer; on anything older the switch really does have the last word.

`audio-check.html` reports all of this on the device itself.

## The cars

18 models across four rarities — common, rare, epic and legendary — from the
Bean to the Aurora. Rarity sets both how often a model turns up and the colour
of the balloon carrying it, so a gold envelope is worth chasing. Each is drawn
from a short spec (length, body and roof height, cabin extents, wheel size,
plus flags like `knobby`, `roofRack` or `engine`), so a new model is a few
lines in `js/cars.js`.

The collection is saved to `localStorage`.

## Layout

| File | What's in it |
| --- | --- |
| `js/cars.js` | The catalogue and the side-view drawing routine |
| `js/balloons.js` | Flight, the pierce, and the slow descent |
| `js/garage.js` | The collection, its storage, and the overlay |
| `js/music.js` | The generated soundtrack |
| `js/game.js` | Scene, loop, input, effects |
