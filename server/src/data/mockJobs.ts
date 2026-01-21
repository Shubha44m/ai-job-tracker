export const MOCK_JOBS = [
    {
        id: '1',
        title: 'Senior Frontend Engineer (React/TS)',
        company: 'CloudScale',
        location: 'Remote',
        type: 'Full-time',
        description: 'Lead our frontend team in building complex dashboards. Requires 5+ years of React experience.',
        skills: ['React', 'TypeScript', 'Tailwind', 'Architecture'],
        postedAt: new Date(Date.now() - 604800000).toISOString() // 7 days ago
    },
    {
        id: '2',
        title: 'Python Backend Developer',
        company: 'AI Solutions',
        location: 'Bengaluru, India',
        type: 'Full-time',
        description: 'Build robust APIs using FastAPI and Django. Knowledge of NLP or computer vision is a huge plus.',
        skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL'],
        postedAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Junior AI Engineer',
        company: 'NeuralNet',
        location: 'Remote',
        type: 'Internship',
        description: 'Assist in developing chatbots and computer vision tools using OpenAI and OpenCV.',
        skills: ['Python', 'OpenCV', 'NLP', 'TensorFlow'],
        postedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
        id: '4',
        title: 'UX/UI Designer',
        company: 'DesignFirst',
        location: 'London, UK',
        type: 'Contract',
        description: 'Create user-centered designs and prototypes using Figma and Adobe XD.',
        skills: ['Figma', 'UI/UX', 'Prototyping'],
        postedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
        id: '5',
        title: 'Fullstack Developer (Python/React)',
        company: 'FinTech Hub',
        location: 'Hybrid',
        type: 'Full-time',
        description: 'Looking for a versatile developer comfortable with both Django backends and React frontends.',
        skills: ['Python', 'Django', 'React', 'CSS'],
        postedAt: new Date(Date.now() - 432000000).toISOString() // 5 days ago
    }
];
