declare module "*.png"
declare module "*.jpg"
declare module "*.gif"

import { placeholder } from "@/contants/assets"

type ScreenArray = {
  name: string,
  component: React.FC<any>
}

export interface UserObject {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
  post_count: number;
  profile_picture: string | null;
  dob: string | null;
}