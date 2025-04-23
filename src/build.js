const fs = require('fs');
const path = require('path');

// Function to read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

// Function to combine components into a single HTML file
function buildStaticSite() {
  // Read all component files
  const navbar = readFile(path.join(__dirname, 'components', 'navbar.html'));
  const hero = readFile(path.join(__dirname, 'components', 'hero.html'));
  const about = readFile(path.join(__dirname, 'components', 'about.html'));
  const education = readFile(path.join(__dirname, 'components', 'education.html'));
  const learnings = readFile(path.join(__dirname, 'components', 'learnings.html'));
  const research = readFile(path.join(__dirname, 'components', 'research.html'));

  // Read the base template
  const baseTemplate = readFile(path.join(__dirname, 'templates', 'base.html'));

  // Replace placeholders with actual content
  const finalHTML = baseTemplate
    .replace('<!-- NAVBAR_PLACEHOLDER -->', navbar)
    .replace('<!-- HERO_PLACEHOLDER -->', hero)
    .replace('<!-- ABOUT_PLACEHOLDER -->', about)
    .replace('<!-- EDUCATION_PLACEHOLDER -->', education)
    .replace('<!-- LEARNINGS_PLACEHOLDER -->', learnings)
    .replace('<!-- RESEARCH_PLACEHOLDER -->', research);

  // Write the final HTML file
  const outputPath = path.join(__dirname, '..', 'index.html');
  fs.writeFileSync(outputPath, finalHTML);

  console.log('Static site built successfully!');
}

// Run the build
buildStaticSite(); 