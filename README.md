# FlowBoard

A sophisticated storyboarding application with two distinct modes for writers, thinkers, and world-builders.

## Features

### Dual Mode System

**Flow Mode** - For structured thinking and visualized process flows
- Design process flows and connect scenes
- Build logic-driven node diagrams
- Perfect for linear narratives and precise story architecture

**Story Branching Mode** - For narrative paths and decision branches
- Map branching narratives on a cosmic canvas
- Watch your story expand into a constellation of decisions
- Create interactive story planning with multiple paths

### Core Features

- **Advanced Text Handling**: Smart text wrapping with character limits (60 for titles, 500 for descriptions)
- **Arabic Support**: Full RTL text support with character-by-character wrapping
- **Node Management**: Create, edit, connect, and organize nodes
- **Visual Tools**: Zoom controls, pan navigation, and selection tools
- **Save/Load System**: Local storage for preserving your work
- **Toast Notifications**: User-friendly feedback system
- **Responsive Design**: Works on desktop and tablet devices

### Technical Features

- **Modern Stack**: Pure HTML5, CSS3, and vanilla JavaScript
- **Canvas Rendering**: High-performance graphics with WebGL fallback
- **Local Storage**: Persistent data storage without backend
- **Component Architecture**: Modular and maintainable codebase
- **Cross-browser Compatible**: Works on all modern browsers

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flowboard.git
cd flowboard
```

2. Start a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Or simply open index.html in your browser
```

3. Open `http://localhost:8000` in your browser

## Usage

### Creating Your First Board

1. Choose your mode from the landing screen:
   - **Flow Mode** for linear storytelling
   - **Story Branching Mode** for interactive narratives

2. Use the toolbar to:
   - **Move Tool**: Drag nodes and pan the canvas
   - **Add Node**: Create new nodes
   - **Sub-Node**: Add child nodes
   - **Connect**: Link nodes together
   - **Delete**: Remove elements

3. Edit nodes by:
   - Double-clicking text for inline editing
   - Right-clicking for context menu
   - Using the Properties sidebar

### Keyboard Shortcuts

- **Space**: Hold to pan the canvas
- **Enter**: Finish text editing
- **Delete**: Remove selected nodes
- **Ctrl+Z**: Undo action
- **Ctrl+Y**: Redo action

## File Structure

```
flowboard/
|-- index.html          # Main application file
|-- script.js           # Core application logic
|-- style.css           # Complete styling
|-- branching-mode.js   # Story branching mode features
|-- README.md           # This file
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Space Grotesk font by Flaming Type
- Cinzel font by Nindi Arts
- Unsplash for cosmic background images
- The open-source community for inspiration and tools

## Future Updates

Planned features include:
- Cloud synchronization
- Collaboration tools
- Export to PDF/JSON
- Advanced theming
- Mobile app version

Optimized for Desktop: This tool is designed for a professional world-building experience on large screens.

---

**FlowBoard** - Where your story becomes a constellation.
