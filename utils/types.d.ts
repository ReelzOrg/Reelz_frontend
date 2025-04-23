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

export interface CustomTheme {
  background: string;
  background_disabled: string;
  textField: string;
  text: string;
  placeholder: string;
  btn_primary: string;
  mode: "dark" | "light";
};

export interface UserObject {
  _id: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
  post_count: number;
  profile_picture: string | null;
  is_private: boolean;
}

//remove the isFollowing property
export interface UserProfileResponse extends UserObject {
  isUserAcc: boolean;
  isFollowing: boolean;
}

export interface PostWithMediaObject {
  _id: string;
  user_id: string;
  caption: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
  updatedAt: string;
  media_items: MediaItem[];
}

export interface MediaItem {
  _id: string;
  mediaUrl: string;
  mediaType: string;
  position: number;
  updatedAt: string;
}