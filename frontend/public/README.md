This folder is intended to contain the public assets (images) used by the frontend.

Currently, the repository's original `public/` directory at the project root still contains the image assets (e.g. `HTFgroupPhoto.JPG`, `google-logo.png`, etc.).

If you want the frontend to be self-contained, copy the files from the project-root `public/` into this folder. I can do that for you — say "yes, copy images" and I'll copy all image files into `frontend/public/` so running the frontend from `frontend/` works without changes.

Alternatively, you can run the dev server from the repository root (where the original `package.json` used to be) and it will serve the root `public/` folder — but the recommended approach is to install and run inside `frontend/` and keep the images here.
