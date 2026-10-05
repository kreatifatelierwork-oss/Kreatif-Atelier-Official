"use client";

import { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { onFrame } from "@/components/film/loop";
import { useUi, type Runtime } from "./journey";
import { route } from "./route";
import { SceneItem } from "./SceneItems";
import { anchorFor, FOV, phoneAt, stageView } from "./stage/layout";

type Props = {
  rtRef: { current: Runtime };
  reduced: boolean;
  still: boolean;
  mobile: boolean;
  onEnter: (thing: string) => void;
  onGo: (place: number) => void;
};

type Anchored = { el: HTMLElement | SVGElement; place: number; at: [number, number]; depth: number; world: THREE.Vector3; svg?: boolean };
type Leader = { el: SVGPathElement; place: number; from: Anchored; to: Anchored; side: string };

const v = new THREE.Vector3();
/** Text lifetime in places: full from `before` ahead of the hold to `after` past it; wipes take `wipe`. */
const TEXT = { before: 0.72, after: 0.62, wipe: 0.18 };
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * The text of every place as real HTML (server-rendered, all of it), laid over the world. Each item's lifetime is
 * tied to the camera: it is set at the point its reference frame shows, anchored at a depth in the world, so it
 * appears as its place approaches, moves with parallax as you pass and is gone once the place is behind you. Only the
 * current place is reachable by keyboard and assistive tech; the others are inert.
 */
export const Scenes = forwardRef<HTMLHeadingElement, Props>(function Scenes({ rtRef, reduced, still, mobile, onEnter, onGo }, h1Ref) {
  const place = useUi((s) => s.place);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = root.current;
    if (!box) return;
    const sections = Array.from(box.querySelectorAll<HTMLElement>("[data-place]"));
    let anchored: Anchored[] = [];
    let leaders: Leader[] = [];
    let w = 0, h = 0;
    const collect = () => {
      w = window.innerWidth; h = window.innerHeight;
      const aspect = w / h, fov = mobile ? FOV.mobile : FOV.desktop;
      const byKey = new Map<string, Anchored>();
      anchored = Array.from(box.querySelectorAll<HTMLElement | SVGElement>("[data-at]")).map((el) => {
        const place = Number(el.closest<HTMLElement>("[data-place]")!.dataset.place);
        const raw = el.dataset.at!.split(",").map(Number) as [number, number];
        const at = mobile && !el.closest(".xp-pins") ? phoneAt(raw) : raw;
        const depth = Number(el.dataset.depth);
        const a: Anchored = { el, place, at, depth, world: anchorFor(place, at, depth, fov, aspect), svg: el instanceof SVGElement };
        if (el.dataset.key) byKey.set(el.dataset.key, a);
        return a;
      });
      leaders = Array.from(box.querySelectorAll<SVGPathElement>("[data-leader]")).map((el) => {
        const [a, b] = el.dataset.leader!.split(">");
        return { el, place: Number(el.closest<HTMLElement>("[data-place]")!.dataset.place), from: byKey.get(a)!, to: byKey.get(b)!, side: el.dataset.side ?? "right" };
      }).filter((l) => l.from && l.to);
    };
    collect();
    const pos = new Map<Anchored, [number, number]>();
    const project = (a: Anchored, cam: THREE.PerspectiveCamera | null): [number, number] | null => {
      if (!cam || still) return [a.at[0] * w, a.at[1] * h];
      v.copy(a.world).project(cam);
      if (v.z > 1) return null;
      return [((v.x + 1) / 2) * w, ((1 - v.y) / 2) * h];
    };
    const off = onFrame(() => {
      if (window.innerWidth !== w || window.innerHeight !== h) collect();
      const s = rtRef.current.s;
      const cam = stageView.camera;
      // Visibility by camera position: fully there around the hold, gone a little past half a passage either side.
      for (const sec of sections) {
        const p = Number(sec.dataset.place);
        const d = Math.abs(s - p);
        // Text stays (user decision 2026-10-05): fully there from well before the place until well after it, with a
        // clean wipe in and out at the far ends. Never a blur, never a fade while it can still be read.
        const rel = s - p;
        const reveal = reduced ? (Math.round(s) === p ? 1 : 0)
          : rel < 0 ? smooth((rel + TEXT.before + TEXT.wipe) / TEXT.wipe)
          : 1 - smooth((rel - TEXT.after) / TEXT.wipe);
        const r = Math.max(0, Math.min(1, reveal));
        sec.style.setProperty("--reveal", r.toFixed(3));
        sec.style.visibility = r < 0.002 && !(sec.dataset.card && rel < 0 && rel > -0.8) ? "hidden" : "visible";
        sec.style.opacity = "1";
        sec.style.setProperty("--near", (1 - smooth(d / 0.6)).toFixed(3));
        // A chapter's title card plays on the way in (letterbox bars and title), and is gone by the hold; the very
        // first card is the opening's title and stays at the hold.
        const card = p === 0 ? 1 - smooth(d / 0.35) : 1 - smooth(Math.abs(s - (p - 0.42)) / 0.3);
        sec.style.setProperty("--card", (reduced ? (p === 0 && Math.round(s) === 0 ? 1 : 0) : card).toFixed(3));
      }
      pos.clear();
      for (const a of anchored) {
        if (Math.abs(s - a.place) > 1.2) continue;
        const p = project(a, reduced ? null : cam);
        if (!p) { a.el.style.visibility = "hidden"; continue; }
        a.el.style.visibility = "";
        pos.set(a, p);
        if (a.svg) a.el.setAttribute("transform", `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`);
        else a.el.style.transform = `translate3d(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px, 0)`;
      }
      for (const l of leaders) {
        const a = pos.get(l.from), b = pos.get(l.to);
        if (!a || !b) continue;
        let d: string;
        if (l.side === "up") d = `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
        else {
          // Bend once at 45°, then run level into the label (X01).
          const dy = b[1] - a[1], dir = l.side === "left" ? -1 : 1;
          const mx = a[0] + dir * Math.abs(dy);
          d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${mx.toFixed(1)} ${b[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
        }
        l.el.setAttribute("d", d);
      }
    }, 2);
    return off;
  }, [mobile, reduced, rtRef, still]);

  return (
    <div ref={root} className="xp-scenes">
      {route.map((p) => {
        const here = p.index === place;
        return (
          <section
            key={p.id}
            id={`xp-${p.id}`}
            data-place={p.index}
            data-card={p.items.some((it) => it.k === "card") ? "" : undefined}
            className={`xp-scene is-${p.id} ch-${p.chapter}`}
            data-active={here ? "" : undefined}
            aria-hidden={here ? undefined : true}
            inert={!here}
          >
            <svg className="xp-leaders" aria-hidden="true">
              {p.items.flatMap((it, j) => it.k === "callouts" ? it.items.map((c, k) => (
                <path key={`${j}-${k}`} data-leader={`${p.index}-${j}-${k}-r>${p.index}-${j}-${k}-l`} data-side={c.side ?? "right"} />
              )) : [])}
            </svg>
            {p.items.map((it, j) => (
              <SceneItem key={j} item={it} place={p} j={j} h1Ref={it.k === "card" && it.tag === "h1" ? h1Ref : undefined} onEnter={onEnter} onGo={onGo} />
            ))}
          </section>
        );
      })}
    </div>
  );
});
