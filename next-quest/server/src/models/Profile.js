import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },

    state: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /** Monotonic counter the client uses for last-write-wins. */
    revision: { type: Number, default: 0 },

    /** Last-known display name (handy for future UIs). */
    displayName: { type: String, default: "Quester" },
  },
  {
    timestamps: true,
    versionKey: false,
    minimize: false,
  },
);

export const Profile = mongoose.model("Profile", ProfileSchema);
