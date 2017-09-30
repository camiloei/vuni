import {
  createGame,
  START_EVT,
  RENDER_EVT,
  UPDATE_EVT,
  LOAD_COMPLETE_EVT,
  ASSET_TYPE_IMAGE
} from "./index";

import {
  createSprite,
  createAnimatedSprite,
  renderGroup,
  renderSprite,
  createAnimationClip,
  renderAnimatedSprite
} from "./extensions/sprite";

import createCamera from "./extensions/camera";

const camera = createCamera(
  { x: 0, y: 0, width: 800, height: 600 },
  { x: 0, y: 0, width: 5000, height: 5000 }
);

let game = createGame(800, 600);
game.extend(camera);

let player;
const playerAnimationIdle = createAnimationClip(0, 4, 0.3);

let enemy;

game.load([
  { resId: "knight", type: ASSET_TYPE_IMAGE, src: "knight.png" },
  { resId: "floor", type: ASSET_TYPE_IMAGE, src: "floor.png" },
  { resId: "anim", type: ASSET_TYPE_IMAGE, src: "anim.png" }
]);

game.on(LOAD_COMPLETE_EVT, () => {
  player = createSprite("player", "anim", 50, 50, 80, 80, 200);
  enemy = createSprite("enemy", "knight", 300, 300, 80, 80, 10, true, false);
  player = createAnimatedSprite(
    player,
    { rows: 2, columns: 2, cropSize: 16 },
    { idle: playerAnimationIdle },
    "idle"
  );
  const sprites = game.registerEntity(player, enemy);
  game.start();
});

game.on(UPDATE_EVT, dt => {
  if (game.keys.left) {
    player.x -= player.speed * dt;
  }
  if (game.keys.right) {
    player.x += player.speed * dt;
  }
  if (game.keys.up) {
    player.y -= player.speed * dt;
  }
  if (game.keys.down) {
    player.y += player.speed * dt;
  }

  camera.follow(player, 800 / 2, 600 / 2);
});

game.on(RENDER_EVT, ({ ctx, cache }) => {
  camera.render([enemy], renderSprite, ctx, cache);
  camera.render([player], renderAnimatedSprite, ctx, cache);
});
