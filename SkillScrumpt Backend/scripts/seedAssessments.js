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
        cutoffScore: 90,
        isProctored: true,
        questions: []
      };

      // Skill-specific templates for better quality
      const getSkillSpecificTemplates = (skillName) => {
        const lowerSkill = skillName.toLowerCase();
        if (lowerSkill.includes('react')) {
          return [
            `What is the primary purpose of the Virtual DOM in ${skillName}?`,
            `How does ${skillName} handle prop drilling in large-scale applications?`,
            `What are the advantages of using Functional Components over Class Components in ${skillName}?`,
            `Explain the reconciliation process in ${skillName}.`,
            `How do you optimize performance for a large list in ${skillName}?`
          ];
        }
        if (lowerSkill.includes('python')) {
          return [
            `What is the difference between a list and a tuple in ${skillName}?`,
            `How does ${skillName} handle memory management and garbage collection?`,
            `What is a decorator in ${skillName} and when should you use it?`,
            `Explain the difference between 'is' and '==' in ${skillName}.`,
            `What are generators in ${skillName} and how do they differ from iterators?`
          ];
        }
        return [];
      };

      const skillTemplates = getSkillSpecificTemplates(skill);
      const questionTemplates = [
        ...skillTemplates,
        `What is the primary architectural benefit of using ${skill} in a production-scale system?`,
        `When debugging a high-latency issue in a ${skill} environment, which tool/pattern is most effective?`,
        `How does ${skill} handle internal state management compared to industry alternatives?`,
        `Which of the following is a security best practice specifically for ${skill} implementations?`,
        `In a microservices architecture, how should ${skill} components ideally communicate?`,
        `What is the time complexity of the core data structure used by ${skill} for lookup operations?`,
        `How do you implement effective error boundary patterns within a ${skill} application?`,
        `What is the recommended strategy for horizontal scaling of ${skill} instances?`,
        `Which design pattern is most commonly used in ${skill} to decouple business logic?`,
        `How does ${skill} ensure data consistency during concurrent write operations?`
      ];

      // Options templates to provide variety
      const optionsTemplates = [
        [
          `Optimized ${skill} performance and maintainability`,
          `Legacy compatibility with non-${skill} systems`,
          `Reducing development time at the cost of scalability`,
          `Minimal configuration overhead for small teams`
        ],
        [
          `High-fidelity ${skill} reactive state management`,
          `Direct memory access without abstraction layers`,
          `Compiled-time optimization for low-end hardware`,
          `Native support for legacy ${skill} plugins`
        ],
        [
          `Distributed architecture with ${skill} micro-kernels`,
          `Monolithic deployment for simplified orchestration`,
          `Event-driven synchronization between ${skill} nodes`,
          `Stateless execution within a virtualized sandbox`
        ],
        [
          `Strict type safety and compile-time validation`,
          `Dynamic interpretation for rapid prototyping`,
          `Garbage-collected memory with deterministic cleanup`,
          `Just-in-time compilation for adaptive performance`
        ]
      ];

      // Generate 20 MCQs
      for (let i = 0; i < 20; i++) {
        const template = questionTemplates[i % questionTemplates.length];
        const optionsRaw = optionsTemplates[i % optionsTemplates.length];
        const correctIdx = Math.floor(Math.random() * 4);
        
        const options = optionsRaw.map((optText, idx) => ({
          text: optText,
          isCorrect: idx === correctIdx
        }));
        
        assessment.questions.push({
          id: i + 1,
          question: template,
          type: 'mcq',
          options: options,
          points: 1
        });
      }

      // Add 3 Coding Challenges
      const isCoding = ['Programming', 'Web Development', 'Mobile Development', 'Data & AI'].includes(category);
      const language = isCoding ? (skill.toLowerCase().includes('python') ? 'python' : 'nodejs20') : 'text';

      const codingChallenges = [
        `Implement a ${skill} utility function that handles asynchronous retry logic with exponential backoff.`,
        `Refactor the following ${skill} code snippet to improve its time complexity from O(n^2) to O(n log n).`,
        `Create a robust validation schema for a ${skill} data model ensuring strict type integrity.`
      ];

      for (let j = 0; j < 3; j++) {
        assessment.questions.push({
          question: `Technical Challenge ${j + 1}: ${isCoding ? 'Implement' : 'Describe'} ${codingChallenges[j]}`,
          type: 'coding',
          language: language,
          initialCode: language === 'python' ? `# Python Solution\ndef solution():\n    # Your code for ${skill} here\n    pass` : language === 'nodejs20' ? `// Node.js Solution\nfunction solution() {\n    // Your code for ${skill} here\n}` : `// Provide your detailed response regarding ${skill} here`,
          testCases: [{ input: 'test_input', output: 'expected_output', isPublic: true }],
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
