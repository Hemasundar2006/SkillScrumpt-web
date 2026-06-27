const fs = require('fs');
const path = require('path');

const updateGitignore = (dir) => {
  const gitignorePath = path.join(dir, '.gitignore');
  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf8');
  }
  if (!content.includes('.env')) {
    fs.appendFileSync(gitignorePath, '\n.env\n');
    console.log(`Added .env to ${gitignorePath}`);
  }
};

updateGitignore(path.join(__dirname, 'SkillScrumpt Frontend'));
updateGitignore(path.join(__dirname, 'SkillScrumpt Backend'));
