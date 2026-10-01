"use client";

import Link from "next/link";
import { useEffect } from "react";

export function Redirect() {
  useEffect(() => { window.location.replace(`/${window.location.search}${window.location.hash}`); }, []);
  return <p style={{ padding: "2rem", fontFamily: "var(--font-outfit)" }}><Link href="/">Kreatif Atelier</Link></p>;
}
