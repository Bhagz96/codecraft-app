/**
 * VISUAL OUTPUT — Now uses GameScene
 * ====================================
 * Wrapper that passes the result to the GameScene component.
 * Used by DragDropBuilder.
 *
 * Props:
 *   result    – null, "correct", or "incorrect"
 *   scene     – scene ID string
 *   hero      – hero data object
 */

import GameScene from "../game/GameScene";

function VisualOutput({ result, scene = "hero-spawn", hero }) {
  return (
    <GameScene
      sceneId={scene}
      result={result}
      hero={hero}
    />
  );
}

export default VisualOutput;
