Images folder (served from /images)

Structure:
- /images/restaurants    -> restaurant images
- /images/fooditems      -> food item images
- /images/users          -> user avatars
- /images/others         -> misc images

Usage:
- Place image files in the appropriate folder.
- In the app, reference them from the public root, e.g. `/images/restaurants/<filename>.jpg`.
- Alternatively import images from `src/assets` if you need bundling or hashing.
