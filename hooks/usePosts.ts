import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getData } from '@/utils';
import { PostWithMediaObject } from '@/utils/types';

/**
 * Custom hook to fetch user posts (limits to 9 posts per request)
 * @returns {posts: PostWithMediaObject[], fetchPosts: () => Promise<void>}
 */
export const usePosts = (): {posts: PostWithMediaObject[], fetchPosts: () => Promise<void>} => {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);

  const [posts, setPosts] = useState<PostWithMediaObject[]>([]);
  const [postOffset, setPostOffset] = useState(0);
  const [haveMorePosts, setHaveMorePosts] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!haveMorePosts) return;

    const url = `${baseurl}/api/user/posts?page=${postOffset}`;
    const userPosts = await getData(url, token);
    const data = await userPosts?.json();

    if(data.posts.length > 0) {
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setPostOffset(prevOffset => prevOffset + 1);
    } else {
      setHaveMorePosts(false);
    }
  }, [postOffset, haveMorePosts]);

  return { posts, fetchPosts };
};