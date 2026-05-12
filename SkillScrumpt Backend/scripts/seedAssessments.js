const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assessment = require('../models/Assessment');

dotenv.config();

const categories = {
  'Programming': ['Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'JavaScript', 'C', 'Perl', 'Scala', 'Haskell', 'Dart', 'R', 'MATLAB', 'Shell Scripting'],
  'Web Development': ['React.js', 'Angular', 'Vue.js', 'Node.js', 'Next.js', 'Svelte', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'ASP.NET Core', 'Ruby on Rails', 'GraphQL', 'REST API Design', 'HTML5 & CSS3', 'Tailwind CSS', 'Bootstrap', 'WebSockets', 'PWA'],
  'Mobile Development': ['React Native', 'Flutter', 'SwiftUI', 'Android Jetpack Compose', 'Ionic', 'Xamarin', 'Mobile UI Design', 'Firebase for Mobile', 'App Store Optimization', 'Mobile Security'],
  'Data & AI': ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Analysis with Python', 'Big Data Engineering', 'SQL Mastery', 'NoSQL Databases', 'Data Visualization', 'TensorFlow', 'PyTorch', 'Apache Spark', 'Power BI', 'Tableau'],
  'Cloud & DevOps': ['AWS Cloud Practitioner', 'Azure Fundamentals', 'Google Cloud Platform', 'Docker & Containers', 'Kubernetes Orchestration', 'Terraform (IaC)', 'Jenkins CI/CD', 'GitHub Actions', 'Linux Administration', 'Serverless Computing', 'Microservices Architecture'],
  'Cybersecurity': ['Ethical Hacking', 'Network Security', 'Application Security', 'Penetration Testing', 'Cryptography', 'Cloud Security', 'Incident Response', 'Identity & Access Management', 'SIEM Operations', 'Zero Trust Architecture'],
  'Design & UX': ['UI Design Principles', 'UX Research', 'Figma Mastery', 'Adobe Creative Suite', 'Design Systems', 'Responsive Design', 'Interaction Design', 'Prototyping', 'Visual Branding', 'Typography for Web'],
  'Professional & Management': ['Project Management', 'Agile & Scrum', 'Product Management', 'Digital Marketing', 'Business Analytics', 'Technical Writing', 'Public Speaking', 'Leadership Skills', 'Customer Success', 'HR Management']
};

const generateAssessments = () => {
  const allAssessments = [];
  let skillCount = 0;

  for (const [category, skills] of Object.entries(categories)) {
    for (const skill of skills) {
      skillCount++;
      const testId = `${skill.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-INT-${skillCount.toString().padStart(3, '0')}`;
      
      const assessment = {
        testId,
        title: `${skill} (Intermediate)`,
        description: `Advanced validation of ${skill} expertise. This assessment evaluates practical knowledge, architectural patterns, and troubleshooting capabilities in ${category}.`,
        duration: 90,
        difficulty: 'Intermediate',
        reward: `${skill} Verified Badge`,
        category: category,
        cutoffScore: 70,
        isProctored: true,
        questions: []
      };

      // Generate 60 MCQs
      for (let i = 1; i <= 60; i++) {
        assessment.questions.push({
          question: `Q${i}: In a professional ${skill} environment, what is the most critical consideration when implementing a scalable solution?`,
          type: 'mcq',
          options: [
            'Maintainability and architectural integrity',
            'Short-term performance hacks',
            'Minimal documentation for faster delivery',
            'Legacy compatibility without refactoring'
          ],
          correctAnswer: 0,
          points: 1
        });
      }

      // Add 3 Coding Challenges
      const isCoding = ['Programming', 'Web Development', 'Mobile Development', 'Data & AI'].includes(category);
      const language = isCoding ? (skill.toLowerCase().includes('python') ? 'python' : 'nodejs20') : 'text';

      for (let j = 1; j <= 3; j++) {
        assessment.questions.push({
          question: `Technical Challenge ${j}: ${isCoding ? 'Implement' : 'Describe'} a complex ${skill} workflow that optimizes for concurrency and data integrity.`,
          type: 'coding',
          language: language,
          initialCode: language === 'python' ? '# Python Solution\ndef process_data():\n    pass' : language === 'nodejs20' ? '// Node.js Solution\nfunction processData() {\n}' : '// Provide your detailed response here',
          testCases: [{ input: 'payload_01', output: 'success_01', isPublic: true }],
          points: 10
        });
      }

      allAssessments.push(assessment);
    }
  }

  return allAssessments;
};

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillscrumpt';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear all existing assessments to start fresh with the 100+ list
    await Assessment.deleteMany({});
    console.log('Cleared all existing assessments');

    const assessments = generateAssessments();
    await Assessment.insertMany(assessments);
    console.log(`${assessments.length} assessments seeded successfully with unique IDs!`);

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
