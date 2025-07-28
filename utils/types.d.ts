declare module "*.png"
declare module "*.jpg"
declare module "*.gif"
declare module "*.ttf"

interface ScreenArray {
  name: string,
  component: React.FC<any>
}

export interface SimpleImage {
  fileSize: number;
  mimeType: string;
  uri: string;
  width: number;
  height: number;
}

export interface MediaData {
  mimeType: string;
  uri: string;
  name: string
}

export interface MultiMediaData {
  mimeType: string[];
  uri: string[];
  name: string[]
}

export interface CustomTheme {
  background: string;
  background_disabled: string;
  textField: string;
  text: string;
  placeholder: string;
  btn_primary: string;
  mode: "dark" | "light";
};

//change to BasicUserObject
export interface BasicUserObject {
  _id: string;
  username: string;
  first_name: string;
  last_name: string | null;
  profile_picture: string | null;
}

//TODO: change the id to _id (the key '_id' here should be same as the the key in typesenseFuns.js file in the server )
export interface MinUserObject {
  id: string,
  username: string;
  first_name: string;
  last_name: string;
  created_at: number;
}

export interface UserObject {
  _id: string | null;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
  post_count: number;
  profile_picture: string | null;
  dob: string | null;
  phone: string | null;
  gender: "male" | "female" | "other" | null;
  websites: string[];
  is_private: boolean;
}

// enums create JavaScript objects at runtime and files with extention .d.ts dont create any javascript files
//hence if you export this enum from this file it will throw an error
// export enum FollowStatus {
//   FOLLOWS = "follows",
//   NONE = "none",
//   REQUESTED = "requested",
//   BLOCKED = "blocked"
// };

// export interface FollowTypes {
//   followStatus: FollowStatus.FOLLOWS | FollowStatus.NONE | FollowStatus.REQUESTED | FollowStatus.BLOCKED;
// }

//remove the isFollowing property
export interface UserProfileResponse extends UserObject {
  isUserAcc?: boolean;
  followStatus?: FollowStatus.FOLLOWS | FollowStatus.NONE | FollowStatus.REQUESTED | FollowStatus.BLOCKED;
}

export interface PostWithMediaObject {
  _id: string;
  user_id?: string;
  caption: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  createdAt: string;
  updatedAt: string;
  media_items: MediaItem[];
  isEmpty?: boolean;
  // mediaUrl: string;
  // mediaType: string;
}

export interface MediaItem {
  _id: string;
  media_url: string;
  media_type: string;
  position: number;
  updated_at: string;
  media_alt?: string;
}