/**
 * AVATAR DEFINITIONS
 * ==================
 * 12 cartoon-style hero avatars (6 female, 6 male).
 * Each avatar has distinct skin tones, hair, and accessories.
 * The selected avatar persists with the hero and appears in all scenes.
 */

export const AVATARS = [
  // ── FEMALE ────────────────────────────────────────────────
  {
    id: "f01", gender: "female", name: "Maya",
    skinTone: "#c8824a", hairColor: "#1c0f00", hairStyle: "long",
    eyeColor: "#5a2d0c", eyebrowColor: "#1c0f00", lipColor: "#b5603a",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: true,
    bgColor: "#2d8a9a", outfitColor: "#e91e8c",
  },
  {
    id: "f02", gender: "female", name: "Zoe",
    skinTone: "#f5d0b0", hairColor: "#c0392b", hairStyle: "short",
    eyeColor: "#2d6a30", eyebrowColor: "#8b2020", lipColor: "#e07060",
    hasGlasses: true, hasCap: false, hasBeard: false, hasEarrings: false,
    bgColor: "#c55a4a", outfitColor: "#009688",
  },
  {
    id: "f03", gender: "female", name: "Luna",
    skinTone: "#f5c6a0", hairColor: "#d4a017", hairStyle: "long_bow",
    eyeColor: "#1a6aaa", eyebrowColor: "#a87a10", lipColor: "#d4806a",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: false,
    bgColor: "#7c5cbf", outfitColor: "#9c27b0",
  },
  {
    id: "f04", gender: "female", name: "Sage",
    skinTone: "#d4926a", hairColor: "#7b2d8b", hairStyle: "bob",
    eyeColor: "#8b2daa", eyebrowColor: "#5a1f6a", lipColor: "#c06040",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: true,
    bgColor: "#1e7a5a", outfitColor: "#4caf50",
  },
  {
    id: "f05", gender: "female", name: "Aria",
    skinTone: "#c8824a", hairColor: "#8b3a1a", hairStyle: "curly",
    eyeColor: "#5a3010", eyebrowColor: "#6b2a10", lipColor: "#b5603a",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: false,
    bgColor: "#c05a1a", outfitColor: "#ff6b35",
  },
  {
    id: "f06", gender: "female", name: "Nova",
    skinTone: "#7d4e24", hairColor: "#c8c8d8", hairStyle: "short",
    eyeColor: "#1a7aaa", eyebrowColor: "#5a5a6a", lipColor: "#8a5030",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: true,
    bgColor: "#3a5a9a", outfitColor: "#00d4ff",
  },

  // ── MALE ──────────────────────────────────────────────────
  {
    id: "m01", gender: "male", name: "Kai",
    skinTone: "#d4926a", hairColor: "#1a1a1a", hairStyle: "spiky",
    eyeColor: "#5a2d0c", eyebrowColor: "#1a1a1a", lipColor: "#c06040",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: false,
    bgColor: "#1a3a6a", outfitColor: "#1565c0",
  },
  {
    id: "m02", gender: "male", name: "Max",
    skinTone: "#f5c6a0", hairColor: "#6b4020", hairStyle: "messy",
    eyeColor: "#1a5aaa", eyebrowColor: "#5a3010", lipColor: "#d4806a",
    hasGlasses: true, hasCap: false, hasBeard: false, hasEarrings: false,
    bgColor: "#4a6a3a", outfitColor: "#388e3c",
  },
  {
    id: "m03", gender: "male", name: "Finn",
    skinTone: "#f0b888", hairColor: "#c04010", hairStyle: "cap",
    eyeColor: "#2d6a30", eyebrowColor: "#903010", lipColor: "#d47858",
    hasGlasses: false, hasCap: true, hasBeard: false, hasEarrings: false,
    bgColor: "#7a3a1a", outfitColor: "#d32f2f",
  },
  {
    id: "m04", gender: "male", name: "Omar",
    skinTone: "#7d4e24", hairColor: "#0a0a0a", hairStyle: "short",
    eyeColor: "#2a1a0a", eyebrowColor: "#0a0a0a", lipColor: "#7a4020",
    hasGlasses: false, hasCap: false, hasBeard: true, hasEarrings: false,
    bgColor: "#2a2a3a", outfitColor: "#f57c00",
  },
  {
    id: "m05", gender: "male", name: "Leo",
    skinTone: "#f5c6a0", hairColor: "#0f0f0f", hairStyle: "straight",
    eyeColor: "#2a1a0a", eyebrowColor: "#0f0f0f", lipColor: "#d4806a",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: false,
    bgColor: "#5a2d8a", outfitColor: "#7b1fa2",
  },
  {
    id: "m06", gender: "male", name: "Alex",
    skinTone: "#f5d0b0", hairColor: "#d4b030", hairStyle: "spiky",
    eyeColor: "#4a7aaa", eyebrowColor: "#b09020", lipColor: "#e07060",
    hasGlasses: false, hasCap: false, hasBeard: false, hasEarrings: false,
    bgColor: "#1a7a6a", outfitColor: "#00bcd4",
  },
];

export function getAvatar(id) {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}

export const DEFAULT_AVATAR_ID = "m01";
