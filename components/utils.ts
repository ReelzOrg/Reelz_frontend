// enums create JavaScript objects at runtime and files with extention .d.ts dont create any javascript files
// hence if you export this enum from this file it will throw an error
export enum FollowStatus {
  FOLLOWS = "follows",
  NONE = "none",
  REQUESTED = "requested",
  BLOCKED = "blocked"
};