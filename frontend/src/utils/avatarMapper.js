import defaultAvatar from '../assets/default-avatar.jpg';
import avatar2 from '../assets/avatar2.png';

const avatarMap = {
  'avatar2': avatar2,
  'default-avatar': defaultAvatar
};

export const getAvatarUrl = (url) => {
  if (!url) return defaultAvatar;
  return avatarMap[url] || url;
};
