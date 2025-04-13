declare module "*.png"
declare module "*.jpg"
declare module "*.gif"

interface ScreenArray {
  name: string,
  component: React.FC<any>
}

export interface CustomTheme {
  background: string;
  background_disabled: string;
  textField: string;
  text: string;
  placeholder: string;
  btn_primary: string;
};

export interface UserObject {
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

export interface UserProfileResponse extends UserObject {
  isUserAcc: boolean;
  isFollowing: boolean;
}