import defaultAvatar from '../assets/default-avatar.jpg';
import woman1 from '../assets/avatars/woman1.svg';
import woman2 from '../assets/avatars/woman2.svg';
import woman3 from '../assets/avatars/woman3.svg';
import man1 from '../assets/avatars/man1.svg';
import man2 from '../assets/avatars/man2.svg';
import man3 from '../assets/avatars/man3.svg';
import child1 from '../assets/avatars/child1.svg';
import child2 from '../assets/avatars/child2.svg';
import senior1 from '../assets/avatars/senior1.svg';
import senior2 from '../assets/avatars/senior2.svg';

const avatarMap = {
  // Legacy / incorrect URLs
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&top=longHairBigHair&facialHairProbability=0': woman1,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&top=bun&facialHairProbability=0': woman2,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&top=hijab&facialHairProbability=0': woman3,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&top=shortHair&facialHair=beardLight&facialHairProbability=100': man1,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&top=shortHair&facialHair=moustacheFancy&facialHairProbability=100': man2,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&top=shortHair&facialHair=beardMajestic&facialHairProbability=100': man3,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lilou&top=bob&facialHairProbability=0': child1,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&top=shortHair&facialHairProbability=0': child2,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace&top=curly&hairColor=silverGray&facialHairProbability=0': senior1,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=George&top=sides&hairColor=white&facialHair=beardLight&facialHairProbability=100': senior2,

  // Corrected URLs
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&top=bigHair&facialHairProbability=0': woman1,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&top=shortRound&facialHair=beardLight&facialHairProbability=100': man1,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&top=shortWaved&facialHair=moustacheFancy&facialHairProbability=100': man2,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&top=theCaesar&facialHair=beardMajestic&facialHairProbability=100': man3,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&top=shortFlat&facialHairProbability=0': child2,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace&top=curly&hairColor=e8e1e1&facialHairProbability=0': senior1,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=George&top=sides&hairColor=ffffff&facialHair=beardLight&facialHairProbability=100': senior2
};

export const getAvatarUrl = (url) => {
  if (!url) return defaultAvatar;
  return avatarMap[url] || url;
};
