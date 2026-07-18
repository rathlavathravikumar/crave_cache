export function getRestaurantImage(filename: string) {
  return `/images/restaurants/${filename}`;
}

export function getFoodItemImage(filename: string) {
  return `/images/fooditems/${filename}`;
}

export function getUserImage(filename: string) {
  return `/images/users/${filename}`;
}

export function getOtherImage(filename: string) {
  return `/images/others/${filename}`;
}

export const placeholder = {
  restaurant: '/images/others/hero.png',
  food: '/images/others/hero.png',
  user: '/images/others/react.svg',
};
