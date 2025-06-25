# MathArt

A dynamic, interactive web app for exploring Art through recursive harmonic motion and randomized parameters.

## Live Demo

[Live on GitHub Pages](https://jiaqi-tang.github.io/MathArt/)

Key Features

- **Recursive Art Pieces**: Implements nestation of motions and shape with customizable parameters
- **Interactive Art Pages**: Users can explore and fine-tune art in real-time
- **Curated Gallery Pages**: Themed static pieces highlighting aesthetic and to spark creativity
- **Component-Based Architecture**: Modular React components make the site easily extendable

## About This Project

This site home for dynamic, interactive MathArt. It is built on a personal fascination on nestations with randomness, and as I'd like to call it — _structured chaos_.

This project exists to bring those ideas to life. It’s a space for visual experimentation, where small changes ripple outward into entirely new art pieces. Visitors can explore curated galleries or generate their own versions through interactive tools. The goal isn’t just to present finished pieces, but to invite play, customization, and creative discovery. At its core, this project is about sharing a sense of visual curiosity, and perhaps helping others explore abstract mathematical art that I wish I had more exposure to growing up.

More features and galleries coming soon!

---

## Tech Stack

| Area             | Tech Used        |
| ---------------- | ---------------- |
| Language         | TypeScript       |
| Framework        | React            |
| Rendering Engine | Pixi.js          |
| Bundler          | Vite             |
| Styling          | CSS              |
| Deployment       | GitHub Pages     |
| Debugging        | Chrome Dev Tools |

## Technical Highlights

**Modulazation, Abstraction, and Scalability**

- React structure is modular and extensible, using a generic page wrapper shared across Art and Gallery pages to maintain consistent layout and styling
- Page-specific logic and content are stored external data files for maintainability.
- Custom components (e.g., buttons, headers, art pieces) promote reuse and scalability as more pages, galleries, and art pieces are added.
- Encapsulated Pixi.js rendering and logic within custom classes for better abstraction, allowing React components to remain clean and declarative.

**Nestations and Recursions**

- Core art logic leverages Pixi’s container hierarchy to build recursive, harmonic structures.
- Each shape is nested within a container placed around its parent, allowing recursive transformations (position, rotation, etc.) to propagate naturally.
- This structure enables visually intricate results from minimal parameter changes, changes applied to the root container will automatically recuse through all its children.

**Performance and Optimization**

- Solved floating-point instability in motion calculations by storing previous parameters and avoiding recalculations every frame, improving both precision and frame stability.
- Added explicit cleanup of custom classes to prevent memory bloat.
- Avoids unnecessary re-rendering by reusing and updating existing containers on interaction, preserving smooth visuals during user input.

**Interactivity and UX**

- Built an intuitive, interactive system for customizing art using sliders, numeric inputs, color pickers, single/multi-select buttons (textual and graphical)
- Art canvas automatically fits screen and supports zooming, optimizing space usage and user focus.
- Designed for responsiveness, with visual feedback such as hover effects and dynamic elements for improved user engagement.

## Learnings and Initiative

This project began with only a concept: _Can something feel both structured and unpredictable?_ That led to the concept of nestations, layering harmonic motions within each other. With no prior experience in React, Pixi.js, or Vite, I took on the challenge of turning an abstract artistic and mathematical idea into a polished, interactive web platform.

To bring this idea to life:

- I independently researched and compared front-end frameworks, ultimately selecting React for its component model and scalable structure.
- I chose Pixi.js for its performance with nested, animated graphics — specifically because of its container hierarchy, which closely matched my vision of recursive art generation.
- I selected Vite to streamline the build and development experience, ensuring fast feedback while experimenting with graphical outputs.
- I learned each tool from scratch and integrated them into a cohesive system that supports modular growth, reusability, and future extensibility.

More than just implementing code, this project demonstrates my ability to:

- Translate abstract concepts into concrete, usable systems
- Evaluate and select technologies that match project goals
- Build robust, creative software from the ground up

This MathArt site reflects my drive to explore ideas through code — and to shape that exploration into something interactive, accessible, and expressive.
