/*
 * Copyright (c) 2026 Riadh MNASRI. All rights reserved.
 *
 * Content pack loader.
 *
 * The active pack is resolved at build time through static imports, so
 * the whole catalog ships with the app and works offline. To create a
 * new learning app for another topic, add a pack folder and swap the
 * imports below; nothing else in the codebase references GCP.
 */

import type { Module, ModuleRef, Pack } from "./types";
import packManifest from "@/content/packs/gcp/pack.json";
import fundamentals from "@/content/packs/gcp/modules/fundamentals.json";
import compute from "@/content/packs/gcp/modules/compute.json";
import storage from "@/content/packs/gcp/modules/storage.json";
import databases from "@/content/packs/gcp/modules/databases.json";
import networking from "@/content/packs/gcp/modules/networking.json";
import iamSecurity from "@/content/packs/gcp/modules/iam-security.json";
import dataAnalytics from "@/content/packs/gcp/modules/data-analytics.json";
import serverlessMessaging from "@/content/packs/gcp/modules/serverless-messaging.json";
import observabilitySre from "@/content/packs/gcp/modules/observability-sre.json";
import devopsIac from "@/content/packs/gcp/modules/devops-iac.json";
import mlAi from "@/content/packs/gcp/modules/ml-ai.json";
import whatsNew from "@/content/packs/gcp/modules/whats-new.json";

export const pack = packManifest as unknown as Pack;

/** Available modules, keyed by id. Planned modules have no content yet. */
const modules: Record<string, Module> = {
  [fundamentals.id]: fundamentals as unknown as Module,
  [compute.id]: compute as unknown as Module,
  [storage.id]: storage as unknown as Module,
  [databases.id]: databases as unknown as Module,
  [networking.id]: networking as unknown as Module,
  [iamSecurity.id]: iamSecurity as unknown as Module,
  [dataAnalytics.id]: dataAnalytics as unknown as Module,
  [serverlessMessaging.id]: serverlessMessaging as unknown as Module,
  [observabilitySre.id]: observabilitySre as unknown as Module,
  [devopsIac.id]: devopsIac as unknown as Module,
  [mlAi.id]: mlAi as unknown as Module,
  [whatsNew.id]: whatsNew as unknown as Module,
};

export function getModule(id: string): Module | undefined {
  return modules[id];
}

export function availableModules(): Module[] {
  return pack.modules
    .filter((ref) => ref.status === "available")
    .map((ref) => modules[ref.id])
    .filter((m): m is Module => m !== undefined);
}

export function moduleRefs(): ModuleRef[] {
  return pack.modules;
}

/** Every flashcard id in the pack, used to compute the due queue. */
export function allCardIds(): string[] {
  return availableModules().flatMap((m) => m.flashcards.map((c) => c.id));
}

/** Total content items and completed items, for the coverage stat. */
export function coverage(
  lessonsDone: Record<string, string>,
  cards: Record<string, { box: number }>,
  exercises: Record<string, { correct: boolean }>
): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const m of availableModules()) {
    total += m.lessons.length + m.flashcards.length + m.exercises.length;
    done += m.lessons.filter((l) => lessonsDone[l.id]).length;
    // A card counts as covered once it has climbed out of the first boxes.
    done += m.flashcards.filter((c) => (cards[c.id]?.box ?? 0) >= 2).length;
    done += m.exercises.filter((e) => exercises[e.id]?.correct).length;
  }
  return { done, total };
}
