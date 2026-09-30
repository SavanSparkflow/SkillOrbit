import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Chapter from '../models/Chapter.js';
import Lesson from '../models/Lesson.js';
import Review from '../models/Review.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillorbit'
    );
    console.log('📦 Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Chapter.deleteMany({});
    await Lesson.deleteMany({});
    await Review.deleteMany({});
    await Quiz.deleteMany({});

    console.log('🧹 Old collections cleared.');

    // 1. Create Instructor & Student Users
    const teacherUser = await User.create({
      name: 'Prof. Aarav Mehta',
      email: 'teacher@skillorbit.com',
      password: 'password123',
      role: 'teacher',
      headline: 'Senior Principal Engineer & Fullstack Architect (Ex-Google, Microsoft)',
      bio: 'Over 12+ years building enterprise SaaS, teaching over 150k+ students worldwide in Fullstack, AI, and Cloud Architecture.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    });

    const teacher2 = await User.create({
      name: 'Diya Patel',
      email: 'diya@skillorbit.com',
      password: 'password123',
      role: 'teacher',
      headline: 'Lead Product Designer & Design System Expert',
      bio: 'Passionate about Figma, UI/UX interaction design, and accessible design systems.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    });

    const studentUser = await User.create({
      name: 'Savan Kotadiya',
      email: 'student@skillorbit.com',
      password: 'password123',
      role: 'student',
      headline: 'Aspiring Full Stack Web Developer',
      bio: 'Loving coding and building modern web apps with React & Node.js.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    });

    console.log('👤 Users created successfully.');

    // 2. Create Courses with Chapters & Lessons
    const course1 = await Course.create({
      title: 'Full Stack MERN 2026: Master LMS, SaaS & Cloud Deployment',
      subtitle: 'Build enterprise-grade SaaS web applications from scratch with MongoDB, Express, React 19, and Node.js.',
      description: 'Master modern full-stack web development with this comprehensive masterclass. We cover authentication, database modeling, REST APIs, real-time streaming, state management with Zustand, Tailwind CSS, payment gateways, and cloud deployment.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      price: 2499,
      originalPrice: 7999,
      category: 'Web Development',
      level: 'All Levels',
      language: 'Gujarati / English',
      instructor: teacherUser._id,
      isPublished: true,
      isFeatured: true,
      enrollmentCount: 1420,
      averageRating: 4.9,
      totalReviews: 312,
      learningOutcomes: [
        'Build production-ready MERN stack apps from scratch',
        'Master JWT Authentication, secure cookies & role-based authorization',
        'State management with Zustand and TanStack Query',
        'Video streaming integration with HLS and Cloudinary',
        'Deploy backend to Render/Railway and frontend to Vercel with custom domains',
      ],
      requirements: [
        'Basic understanding of HTML, CSS, and modern JavaScript (ES6+)',
        'A computer with Node.js and VS Code installed',
      ],
      chapters: [],
    });

    // Course 1 Chapters & Lessons
    const c1_ch1 = await Chapter.create({
      title: 'Chapter 1: Architecture & Backend Foundations',
      courseId: course1._id,
      position: 1,
      lessons: [],
    });

    const c1_l1 = await Lesson.create({
      title: '1.1 Welcome & Full System Architecture Overview',
      description: 'Introduction to MERN stack, MVC pattern, and database modeling.',
      chapterId: c1_ch1._id,
      courseId: course1._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 540,
      position: 1,
      isFreePreview: true,
      resources: [
        { title: 'Course Source Code on GitHub', url: 'https://github.com' },
        { title: 'Architecture Diagram PDF', url: 'https://example.com/arch.pdf' },
      ],
    });

    const c1_l2 = await Lesson.create({
      title: '1.2 Setting up Express, MongoDB Atlas & Mongoose Models',
      description: 'Connecting to MongoDB, creating robust schemas and error handlers.',
      chapterId: c1_ch1._id,
      courseId: course1._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 720,
      position: 2,
      isFreePreview: false,
    });

    const c1_l3 = await Lesson.create({
      title: '1.3 JWT Authentication & Secure HTTP-Only Cookies',
      description: 'Implementing bcrypt hashing, JWT issuance and route protection.',
      chapterId: c1_ch1._id,
      courseId: course1._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 860,
      position: 3,
      isFreePreview: false,
    });

    c1_ch1.lessons = [c1_l1._id, c1_l2._id, c1_l3._id];
    await c1_ch1.save();

    const c1_ch2 = await Chapter.create({
      title: 'Chapter 2: Frontend Engineering with React & Tailwind',
      courseId: course1._id,
      position: 2,
      lessons: [],
    });

    const c1_l4 = await Lesson.create({
      title: '2.1 Vite + React Setup & Tailwind CSS Custom Design System',
      description: 'Building custom theme tokens, buttons, glassmorphic cards, and loaders.',
      chapterId: c1_ch2._id,
      courseId: course1._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: 640,
      position: 1,
      isFreePreview: true,
    });

    const c1_l5 = await Lesson.create({
      title: '2.2 Building the LMS Video Learning Room & Progress Tracking',
      description: 'Implementing interactive video player, checklist, and dynamic completion state.',
      chapterId: c1_ch2._id,
      courseId: course1._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      duration: 980,
      position: 2,
      isFreePreview: false,
    });

    c1_ch2.lessons = [c1_l4._id, c1_l5._id];
    await c1_ch2.save();

    course1.chapters = [c1_ch1._id, c1_ch2._id];
    await course1.save();

    // Course 2: UI/UX Design System
    const course2 = await Course.create({
      title: 'Modern UI/UX Design with Figma: From Wireframe to Interactive SaaS',
      subtitle: 'Learn professional design principles, typography, color theory, auto-layout, design tokens and micro-interactions in Figma.',
      description: 'Craft stunning, high-converting interfaces and reusable design systems for web and mobile apps. Learn how to work like a senior product designer in high-growth tech companies.',
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800',
      price: 1999,
      originalPrice: 5999,
      category: 'UI/UX Design',
      level: 'Beginner',
      language: 'English',
      instructor: teacher2._id,
      isPublished: true,
      isFeatured: true,
      enrollmentCount: 980,
      averageRating: 4.8,
      totalReviews: 184,
      learningOutcomes: [
        'Master Figma components, variants, variables, and Auto Layout 5.0',
        'Create professional design systems used by Fortune 500 companies',
        'UX Research, user journeys, wireframing, and interactive prototyping',
      ],
      requirements: ['No prior design experience needed. A free Figma account is all you need.'],
      chapters: [],
    });

    const c2_ch1 = await Chapter.create({
      title: 'Chapter 1: Figma Foundations & Design Systems',
      courseId: course2._id,
      position: 1,
      lessons: [],
    });

    const c2_l1 = await Lesson.create({
      title: '1.1 Introduction to Modern UI Design & Tooling',
      description: 'Overview of Figma interface, tools, frames, and vector graphics.',
      chapterId: c2_ch1._id,
      courseId: course2._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      duration: 480,
      position: 1,
      isFreePreview: true,
    });

    const c2_l2 = await Lesson.create({
      title: '1.2 Typography, Color Palettes & Contrast Accessibility',
      description: 'Choosing fonts, pairing rules, HSL scales, and WCAG AA accessibility rules.',
      chapterId: c2_ch1._id,
      courseId: course2._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      duration: 710,
      position: 2,
      isFreePreview: false,
    });

    c2_ch1.lessons = [c2_l1._id, c2_l2._id];
    await c2_ch1.save();
    course2.chapters = [c2_ch1._id];
    await course2.save();

    // Course 3: Python AI/ML
    const course3 = await Course.create({
      title: 'Python, Machine Learning & Generative AI Masterclass',
      subtitle: 'Build real-world LLM chatbots, Computer Vision models, and data science pipelines with PyTorch and LangChain.',
      description: 'Comprehensive guide into modern Artificial Intelligence. Learn Python data analytics with Pandas/NumPy, Deep Learning with PyTorch, and LLM applications with LangChain & OpenAI APIs.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
      price: 2999,
      originalPrice: 8999,
      category: 'Data Science & AI',
      level: 'Intermediate',
      language: 'Gujarati / English',
      instructor: teacherUser._id,
      isPublished: true,
      isFeatured: true,
      enrollmentCount: 2310,
      averageRating: 5.0,
      totalReviews: 480,
      learningOutcomes: [
        'Data analysis with Pandas, NumPy, Matplotlib and Seaborn',
        'Deep Learning models with PyTorch',
        'Build custom AI Agents and RAG systems with LangChain',
      ],
      requirements: ['Basic programming knowledge in any language is helpful.'],
      chapters: [],
    });

    const c3_ch1 = await Chapter.create({
      title: 'Chapter 1: Python for Data Science & AI',
      courseId: course3._id,
      position: 1,
      lessons: [],
    });

    const c3_l1 = await Lesson.create({
      title: '1.1 Setting up Anaconda, Jupyter & Essential Python',
      description: 'Environment setup, virtual environments, and numpy array computations.',
      chapterId: c3_ch1._id,
      courseId: course3._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: 890,
      position: 1,
      isFreePreview: true,
    });

    c3_ch1.lessons = [c3_l1._id];
    await c3_ch1.save();
    course3.chapters = [c3_ch1._id];
    await course3.save();

    // Course 4: Cloud & DevOps Free Starter
    const course4 = await Course.create({
      title: 'Docker, Kubernetes & AWS Cloud DevOps Bootcamp',
      subtitle: 'Zero to hero DevOps guide: Containerization, CI/CD pipelines with GitHub Actions, and AWS deployment.',
      description: 'Learn modern DevOps practices. Containerize apps with Docker, manage multi-container setups with Docker Compose, orchestrate with Kubernetes, and deploy to AWS ECS and EKS.',
      thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=800',
      price: 0, // Free
      originalPrice: 2999,
      category: 'Cloud & DevOps',
      level: 'All Levels',
      language: 'English',
      instructor: teacherUser._id,
      isPublished: true,
      isFeatured: false,
      enrollmentCount: 3840,
      averageRating: 4.9,
      totalReviews: 540,
      learningOutcomes: [
        'Understand Docker containers, images, and networking',
        'Automate testing and deployment with GitHub Actions CI/CD',
        'Deploy scalable microservices to AWS',
      ],
      requirements: ['Basic familiarity with Linux command line.'],
      chapters: [],
    });

    const c4_ch1 = await Chapter.create({
      title: 'Chapter 1: Docker Fundamentals',
      courseId: course4._id,
      position: 1,
      lessons: [],
    });

    const c4_l1 = await Lesson.create({
      title: '1.1 Docker Containers vs Virtual Machines Explained',
      description: 'Understanding containers, Docker architecture and daemon.',
      chapterId: c4_ch1._id,
      courseId: course4._id,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: 620,
      position: 1,
      isFreePreview: true,
    });

    c4_ch1.lessons = [c4_l1._id];
    await c4_ch1.save();
    course4.chapters = [c4_ch1._id];
    await course4.save();

    // Add student enrolled course
    studentUser.enrolledCourses = [course1._id, course4._id];
    await studentUser.save();

    // Add some reviews
    await Review.create({
      user: studentUser._id,
      course: course1._id,
      rating: 5,
      comment: 'This course is phenomenal! The explanation of MERN stack in Gujarati + English made complex topics so easy to understand. Best LMS course on the internet!',
    });

    await Review.create({
      user: studentUser._id,
      course: course2._id,
      rating: 5,
      comment: 'Super crisp Figma tutorials. The design system module helped me redesign my whole agency portfolio!',
    });

    // 3. Create Interactive MCQ Quiz
    await Quiz.create({
      title: 'MERN Architecture & Express Foundation Quiz',
      courseId: course1._id,
      chapterId: c1_ch1._id,
      passingScore: 70,
      questions: [
        {
          question: 'What does the MVC pattern stand for in MERN backend development?',
          options: [
            'Model-View-Controller',
            'Multiple-Variable-Cache',
            'MongoDB-Vite-Chrome',
            'Main-Virtual-Component',
          ],
          correctAnswerIndex: 0,
          explanation: 'MVC stands for Model (Database rules), View (JSON/UI output), and Controller (Business logic).',
        },
        {
          question: 'Why should JWT tokens ideally be stored in HTTP-Only cookies rather than localStorage in production?',
          options: [
            'To reduce API latency',
            'To protect against Cross-Site Scripting (XSS) attacks',
            'Because cookies allow larger file uploads',
            'To compress JSON responses',
          ],
          correctAnswerIndex: 1,
          explanation: 'HTTP-only cookies cannot be accessed by client-side JavaScript, which protects tokens from XSS vulnerabilities.',
        },
        {
          question: 'Which middleware in Express is commonly used to prevent brute-force and DDoS attacks by limiting client requests?',
          options: [
            'express-rate-limit',
            'cookie-parser',
            'mongoose',
            'bcryptjs',
          ],
          correctAnswerIndex: 0,
          explanation: 'express-rate-limit caps incoming requests from an IP address within a set time window.',
        },
      ],
    });

    console.log('✅ Demo Seed Data successfully loaded into database!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
