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

All three choices are remembered between sessions.

Balloons that drift off-screen are gone; the garage tracks how many got away.

## Sound

There are no audio files. Effects are short synthesised blips, and the music is
generated as it plays: a slow four-chord loop in D with a pad, a bass note and
a sparse pentatonic melody, scheduled a beat ahead of the clock so timing never
depends on a JS timer. Browsers block audio until the page has been interacted
with, so it starts on your first click.

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
