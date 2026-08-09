import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

from sqlalchemy.orm import Session
from ..database.models import Skill, CareerRole, RoleSkill, User, Profile, UserSkill
from .auth import hash_password


def seed_skills(db: Session):
    """Seed skills into database"""
    if db.query(Skill).count() > 0:
        return

    skills_data = [
        # Programming
        {"name": "Python", "category": "Programming", "description": "Python programming language", "difficulty": 2},
        {"name": "JavaScript", "category": "Programming", "description": "JavaScript programming language", "difficulty": 2},
        {"name": "TypeScript", "category": "Programming", "description": "TypeScript for type-safe JavaScript", "difficulty": 2},
        {"name": "Java", "category": "Programming", "description": "Java programming language", "difficulty": 2},
        {"name": "C++", "category": "Programming", "description": "C++ programming language", "difficulty": 3},
        {"name": "Go", "category": "Programming", "description": "Go programming language", "difficulty": 2},

        # Data & Analytics
        {"name": "SQL", "category": "Data", "description": "SQL database queries", "difficulty": 2},
        {"name": "Statistics", "category": "Data", "description": "Statistical analysis and concepts", "difficulty": 2},
        {"name": "Probability", "category": "Data", "description": "Probability theory", "difficulty": 2},
        {"name": "Excel", "category": "Data", "description": "Microsoft Excel and data analysis", "difficulty": 1},
        {"name": "Pandas", "category": "Data", "description": "Python Pandas data manipulation", "difficulty": 2},
        {"name": "NumPy", "category": "Data", "description": "NumPy numerical computing", "difficulty": 2},

        # Machine Learning & AI
        {"name": "Machine Learning", "category": "AI", "description": "ML algorithms and concepts", "difficulty": 3},
        {"name": "Deep Learning", "category": "AI", "description": "Neural networks and deep learning", "difficulty": 3},
        {"name": "PyTorch", "category": "AI", "description": "PyTorch deep learning framework", "difficulty": 3},
        {"name": "TensorFlow", "category": "AI", "description": "TensorFlow deep learning framework", "difficulty": 3},
        {"name": "Scikit-learn", "category": "AI", "description": "Scikit-learn ML library", "difficulty": 2},

        # Visualization & BI
        {"name": "Data Visualization", "category": "Data", "description": "Data visualization techniques", "difficulty": 2},
        {"name": "Power BI", "category": "BI", "description": "Microsoft Power BI", "difficulty": 2},
        {"name": "Tableau", "category": "BI", "description": "Tableau visualization tool", "difficulty": 2},
        {"name": "Matplotlib", "category": "Data", "description": "Matplotlib data visualization", "difficulty": 1},

        # DevOps & Cloud
        {"name": "Docker", "category": "DevOps", "description": "Docker containerization", "difficulty": 2},
        {"name": "Kubernetes", "category": "DevOps", "description": "Kubernetes orchestration", "difficulty": 3},
        {"name": "AWS", "category": "Cloud", "description": "Amazon Web Services", "difficulty": 2},
        {"name": "Azure", "category": "Cloud", "description": "Microsoft Azure", "difficulty": 2},
        {"name": "GCP", "category": "Cloud", "description": "Google Cloud Platform", "difficulty": 2},
        {"name": "CI/CD", "category": "DevOps", "description": "Continuous Integration/Deployment", "difficulty": 2},
        {"name": "Git", "category": "DevOps", "description": "Git version control", "difficulty": 1},

        # Web Development
        {"name": "React", "category": "Frontend", "description": "React.js library", "difficulty": 2},
        {"name": "Vue.js", "category": "Frontend", "description": "Vue.js framework", "difficulty": 2},
        {"name": "HTML/CSS", "category": "Frontend", "description": "HTML and CSS", "difficulty": 1},
        {"name": "REST APIs", "category": "Backend", "description": "REST API design and development", "difficulty": 2},
        {"name": "APIs", "category": "Backend", "description": "API design and integration", "difficulty": 2},
        {"name": "GraphQL", "category": "Backend", "description": "GraphQL query language", "difficulty": 2},
        {"name": "Node.js", "category": "Backend", "description": "Node.js runtime", "difficulty": 2},
        {"name": "FastAPI", "category": "Backend", "description": "FastAPI Python framework", "difficulty": 2},
        {"name": "Django", "category": "Backend", "description": "Django web framework", "difficulty": 2},

        # Databases
        {"name": "PostgreSQL", "category": "Database", "description": "PostgreSQL database", "difficulty": 2},
        {"name": "MongoDB", "category": "Database", "description": "MongoDB NoSQL database", "difficulty": 2},
        {"name": "Redis", "category": "Database", "description": "Redis caching and data store", "difficulty": 2},

        # Security
        {"name": "Networking", "category": "Security", "description": "Computer networking fundamentals", "difficulty": 2},
        {"name": "Linux", "category": "Security", "description": "Linux operating system administration", "difficulty": 2},
        {"name": "Security Tools", "category": "Security", "description": "Cybersecurity tooling (Nmap, Wireshark, SIEM)", "difficulty": 3},

        # Other Skills
        {"name": "Communication", "category": "Soft", "description": "Communication skills", "difficulty": 1},
        {"name": "Problem Solving", "category": "Soft", "description": "Problem solving abilities", "difficulty": 2},
        {"name": "Leadership", "category": "Soft", "description": "Leadership skills", "difficulty": 2},
    ]

    for skill_data in skills_data:
        db.add(Skill(**skill_data))

    db.commit()
    print("✓ Skills seeded successfully")


def seed_career_roles(db: Session):
    """Seed career roles into database"""
    if db.query(CareerRole).count() > 0:
        return

    roles_data = [
        {
            "name": "Data Scientist",
            "description": "Analyze complex datasets and build predictive models",
            "difficulty": 4,
            "average_salary": 120000,
            "market_demand": "High",
        },
        {
            "name": "Data Analyst",
            "description": "Transform data into actionable insights and reports",
            "difficulty": 2,
            "average_salary": 90000,
            "market_demand": "High",
        },
        {
            "name": "Machine Learning Engineer",
            "description": "Design and deploy machine learning systems at scale",
            "difficulty": 5,
            "average_salary": 150000,
            "market_demand": "High",
        },
        {
            "name": "AI Engineer",
            "description": "Build artificial intelligence solutions and systems",
            "difficulty": 5,
            "average_salary": 160000,
            "market_demand": "High",
        },
        {
            "name": "Software Engineer",
            "description": "Design, build and maintain software applications",
            "difficulty": 3,
            "average_salary": 115000,
            "market_demand": "Very High",
        },
        {
            "name": "Full Stack Developer",
            "description": "Build complete web applications (frontend and backend)",
            "difficulty": 3,
            "average_salary": 110000,
            "market_demand": "High",
        },
        {
            "name": "Frontend Developer",
            "description": "Create responsive user interfaces and web experiences",
            "difficulty": 2,
            "average_salary": 95000,
            "market_demand": "High",
        },
        {
            "name": "Backend Developer",
            "description": "Build scalable server-side applications and APIs",
            "difficulty": 3,
            "average_salary": 110000,
            "market_demand": "High",
        },
        {
            "name": "Cloud Engineer",
            "description": "Design and manage cloud infrastructure",
            "difficulty": 3,
            "average_salary": 130000,
            "market_demand": "High",
        },
        {
            "name": "Cybersecurity Analyst",
            "description": "Protect systems and networks from security threats",
            "difficulty": 4,
            "average_salary": 120000,
            "market_demand": "High",
        },
        {
            "name": "DevOps Engineer",
            "description": "Automate infrastructure and deployment processes",
            "difficulty": 4,
            "average_salary": 135000,
            "market_demand": "High",
        },
    ]

    for role_data in roles_data:
        db.add(CareerRole(**role_data))

    db.commit()
    print("✓ Career roles seeded successfully")


def seed_role_skills(db: Session):
    """Seed role-skill relationships"""
    if db.query(RoleSkill).count() > 0:
        return

    def get_skill(name: str):
        return db.query(Skill).filter(Skill.name == name).first()

    def get_role(name: str):
        return db.query(CareerRole).filter(CareerRole.name == name).first()

    role_skills_data = {
        "Data Scientist": [
            ("Python", 4, 3),
            ("SQL", 4, 3),
            ("Statistics", 5, 4),
            ("Probability", 4, 3),
            ("Machine Learning", 5, 4),
            ("Scikit-learn", 4, 3),
            ("Pandas", 4, 3),
            ("NumPy", 4, 3),
            ("Data Visualization", 3, 2),
            ("Power BI", 2, 2),
            ("Git", 3, 2),
            ("Deep Learning", 4, 3),
        ],
        "Data Analyst": [
            ("SQL", 5, 4),
            ("Excel", 4, 3),
            ("Python", 3, 2),
            ("Pandas", 3, 2),
            ("Statistics", 4, 3),
            ("Power BI", 4, 3),
            ("Tableau", 3, 2),
            ("Data Visualization", 4, 3),
            ("Communication", 4, 3),
        ],
        "Machine Learning Engineer": [
            ("Python", 5, 4),
            ("Machine Learning", 5, 4),
            ("Deep Learning", 4, 3),
            ("PyTorch", 4, 3),
            ("TensorFlow", 4, 3),
            ("Scikit-learn", 3, 2),
            ("SQL", 3, 2),
            ("Docker", 4, 3),
            ("Git", 4, 3),
            ("APIs", 3, 2),
        ],
        "AI Engineer": [
            ("Python", 5, 4),
            ("Deep Learning", 5, 4),
            ("PyTorch", 5, 4),
            ("TensorFlow", 5, 4),
            ("Machine Learning", 5, 4),
            ("Docker", 4, 3),
            ("Kubernetes", 3, 2),
            ("REST APIs", 4, 3),
            ("Git", 4, 3),
        ],
        "Software Engineer": [
            ("Python", 4, 3),
            ("JavaScript", 4, 3),
            ("REST APIs", 4, 3),
            ("SQL", 3, 2),
            ("Git", 4, 3),
            ("Docker", 3, 2),
            ("Problem Solving", 5, 4),
            ("Communication", 3, 2),
        ],
        "Full Stack Developer": [
            ("JavaScript", 5, 4),
            ("React", 4, 3),
            ("HTML/CSS", 4, 3),
            ("Node.js", 4, 3),
            ("REST APIs", 4, 3),
            ("SQL", 3, 2),
            ("PostgreSQL", 3, 2),
            ("Docker", 2, 1),
            ("Git", 4, 3),
        ],
        "Frontend Developer": [
            ("JavaScript", 5, 4),
            ("React", 5, 4),
            ("HTML/CSS", 5, 4),
            ("TypeScript", 3, 2),
            ("Problem Solving", 4, 3),
            ("Communication", 3, 2),
            ("Git", 3, 2),
            ("REST APIs", 2, 1),
        ],
        "Backend Developer": [
            ("Python", 5, 4),
            ("Node.js", 4, 3),
            ("REST APIs", 5, 4),
            ("SQL", 4, 3),
            ("PostgreSQL", 4, 3),
            ("Git", 4, 3),
            ("Docker", 3, 2),
            ("Problem Solving", 4, 3),
        ],
        "Cloud Engineer": [
            ("AWS", 5, 4),
            ("Docker", 4, 3),
            ("Kubernetes", 4, 3),
            ("Git", 3, 2),
            ("Python", 3, 2),
            ("CI/CD", 4, 3),
            ("Azure", 3, 2),
            ("GCP", 2, 1),
        ],
        "Cybersecurity Analyst": [
            ("Python", 4, 3),
            ("Networking", 4, 3),
            ("Linux", 4, 3),
            ("Security Tools", 4, 3),
            ("SQL", 3, 2),
            ("Git", 2, 1),
            ("Problem Solving", 5, 4),
            ("Communication", 3, 2),
        ],
        "DevOps Engineer": [
            ("Docker", 5, 4),
            ("Kubernetes", 5, 4),
            ("AWS", 4, 3),
            ("Git", 4, 3),
            ("CI/CD", 5, 4),
            ("Python", 3, 2),
            ("REST APIs", 3, 2),
            ("Problem Solving", 4, 3),
        ],
    }

    for role_name, skills in role_skills_data.items():
        role = get_role(role_name)
        if not role:
            continue

        for skill_name, importance, required_level in skills:
            skill = get_skill(skill_name)
            if skill:
                db.add(RoleSkill(
                    role_id=role.id,
                    skill_id=skill.id,
                    importance=importance,
                    required_level=required_level,
                ))

    db.commit()
    print("✓ Role-skill relationships seeded successfully")


def seed_demo_user(db: Session):
    """Seed the demo user (Alex) with realistic data for demo mode."""
    demo_email = "demo@example.com"
    if db.query(User).filter(User.email == demo_email).first():
        return

    try:
        user = User(email=demo_email, password_hash=hash_password("demo123"))
        db.add(user)
        db.flush()

        profile = Profile(
            user_id=user.id,
            full_name="Alex",
            education="B.S. Computer Science",
            experience_level="Intermediate",
            target_role="Data Scientist",
            weekly_study_hours=10,
        )
        db.add(profile)

        # Alex's skills (from the demo spec)
        demo_skills = [
            ("Python", 3, 75),
            ("SQL", 3, 70),
            ("Pandas", 3, 72),
            ("NumPy", 3, 70),
            ("Git", 3, 68),
            ("Excel", 2, 60),
            ("Statistics", 2, 55),
            ("Data Visualization", 2, 55),
            ("Communication", 2, 60),
        ]
        for skill_name, level, proficiency in demo_skills:
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if skill:
                db.add(UserSkill(
                    user_id=user.id,
                    skill_id=skill.id,
                    proficiency=proficiency,
                    current_level=level,
                    source="manual",
                ))

        db.commit()

        # Create an initial analysis + roadmap for the demo user
        from ..services import analysis_service, roadmap_service

        analysis = analysis_service.compute_analysis(db, user.id, "Data Scientist")
        analysis_service.save_analysis(db, user.id, "Data Scientist", analysis)
        roadmap_service.generate_roadmap(db, user.id, "Data Scientist", 10, "intermediate")

        print("✓ Demo user seeded (demo@example.com / demo123)")
    except Exception as e:
        print(f"⚠️  Could not fully seed demo user: {e}")
        db.rollback()


def initialize_database(db: Session):
    """Initialize database with seed data"""
    seed_skills(db)
    seed_career_roles(db)
    seed_role_skills(db)
    seed_demo_user(db)
