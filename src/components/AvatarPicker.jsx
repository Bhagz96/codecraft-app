/**
 * AVATAR PICKER
 * =============
 * Grid of selectable cartoon hero avatars shown during hero creation.
 *
 * Props:
 *   selectedId  – currently selected avatar id
 *   onSelect    – callback(avatarId)
 */

import { useState } from "react";
import { AVATARS } from "../data/avatars";
import AvatarFace from "./game/AvatarFace";

function AvatarPicker({ selectedId, onSelect }) {
  const [filter, setFilter] = useState("all"); // "all" | "female" | "male"

  const visible = filter === "all" ? AVATARS : AVATARS.filter((a) => a.gender === filter);

  return (
    <div>
      {/* Gender filter tabs */}
      <div className="flex gap-2 mb-4">
        {["all", "female", "male"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
              filter === f
                ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                : "bg-[#0d1117] border border-[#30363d] text-gray-500 hover:text-gray-300"
            }`}
          >
            {f === "all" ? "All" : f === "female" ? "Female" : "Male"}
          </button>
        ))}
      </div>

      {/* Avatar grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {visible.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className="group rounded-xl transition-transform hover:scale-105 active:scale-95"
          >
            <AvatarFace
              avatar={avatar}
              size={68}
              selected={selectedId === avatar.id}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default AvatarPicker;
