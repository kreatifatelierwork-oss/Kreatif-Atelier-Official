"use client";

import { xp } from "@/content/experience";
import { BREATHS, interaction, launch, layStone, spark } from "./actions";
import type { ActionId } from "./route";

const HOLD: Partial<Record<ActionId, "angleHeld" | "rollHeld" | "breathHeld">> = {
  findTheAngle: "angleHeld",
  roll: "rollHeld",
  breathe: "breathHeld",
};

/**
 * The world's one interaction as a ghost button in its caption block (never a pill on the scene). Holds work with a
 * mouse, a finger or Space / Enter; under reduced motion a hold becomes a press that takes one step.
 */
export function ActionButton({ id, reduced }: { id: ActionId; reduced: boolean }) {
  const hold = HOLD[id];
  const set = (on: boolean) => { if (hold) interaction[hold] = on; };
  const press = () => {
    const now = performance.now();
    if (id === "launch") launch(now);
    else if (id === "layAStone") layStone();
    else if (id === "spark") spark(now);
    else if (reduced) {
      // A press instead of a hold: one clear step.
      if (id === "findTheAngle") interaction.angle = Math.min(1, interaction.angle + 0.34);
      if (id === "roll") interaction.roll = interaction.roll > 0.5 ? 0 : 1;
      if (id === "breathe") interaction.breaths = Math.min(BREATHS, interaction.breaths + 1);
    }
  };
  const label = xp.actions[id];
  const holdable = !!hold && !reduced;
  return (
    <button
      type="button"
      className="xp-btn xp-action"
      data-action={id}
      onClick={holdable ? undefined : press}
      onPointerDown={holdable ? (e) => { e.currentTarget.setPointerCapture(e.pointerId); set(true); } : undefined}
      onPointerUp={holdable ? () => set(false) : undefined}
      onPointerCancel={holdable ? () => set(false) : undefined}
      onKeyDown={holdable ? (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); set(true); } } : undefined}
      onKeyUp={holdable ? (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set(false); } } : undefined}
      onBlur={holdable ? () => set(false) : undefined}
    >
      {label}
    </button>
  );
}
