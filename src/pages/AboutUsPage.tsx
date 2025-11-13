import "@/styles/about.css";
import heroImage from "@/assets/images/AboutUS.png";
import storyImage from "@/assets/images/AboutUS2.png";
import teamAvatar from "@/assets/images/Profile-Picture(1).webp";
import teamAvatar2 from "@/assets/images/t2.png";
import teamAvatar3 from "@/assets/images/t3.png";
import teamAvatar4 from "@/assets/images/t4.png";
import teamAvatar5 from "@/assets/images/t5.png";
type Feature = {
  icon: string;
  title: string;
  description: string;
};

type TeamMember = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

type Experience = {
  icon: string;
  title: string;
  caption: string;
};

const FEATURES: Feature[] = [
  {
    icon: "fas fa-check",
    title: "Provide hassle free travel at affordable price",
    description: "We ensure smooth and budget-friendly travel experiences for all our customers.",
  },
  {
    icon: "fas fa-clock",
    title: "Easy booking and comfortable travel",
    description: "Simple booking process with maximum comfort throughout your journey.",
  },
  {
    icon: "fas fa-globe",
    title: "Offers great cuisines & unique cultures",
    description: "Discover amazing local food and immerse yourself in diverse cultural experiences.",
  },
  {
    icon: "fas fa-headset",
    title: "Customer service 24/7",
    description: "Round-the-clock customer support to assist you whenever you need help.",
  },
];

const TEAM: TeamMember[] = [
  {
    name: "Kojo Apei",
    role: "Marketing Director",
    quote: "We pair data with instinct to deliver journeys that resonate long after you return home.",
    avatar: teamAvatar,
  },
  {
    name: "Karen Pit",
    role: "Medical Check",
    quote: "Your wellbeing matters. I ensure every itinerary keeps health, safety, and comfort top of mind.",
    avatar: teamAvatar2,
  },
  {
    name: "Viola Gates",
    role: "International Relations",
    quote: "Great partnerships let us unlock hidden gems and extraordinary hospitality for our travelers.",
    avatar: teamAvatar3,
  },
  {
    name: "Doris Heathen",
    role: "Aviation Head",
    quote: "From booking to boarding, we coordinate every detail so you can simply enjoy the flight.",
    avatar: teamAvatar4, 
  },
  {
    name: "Henry Cemit",
    role: "Web Designer",
    quote: "Designing intuitive tools gives you the confidence to plan and manage trips in moments.",
    avatar: teamAvatar5 ,
  },
];

const EXPERIENCES: Experience[] = [
  { icon: "📍", title: "Travel", caption: "Journey worldwide with curated guides" },
  { icon: "🏝️", title: "Island Tour", caption: "Slow down beside turquoise lagoons" },
  { icon: "🏙️", title: "City Tour", caption: "Discover vibrant streets and local art" },
  { icon: "🗺️", title: "Explore World", caption: "Chart your own map of memories" },
];

export default function AboutUsPage() {
  return (
    <div>
      <section className="about-section">
        <div className="container">
          <div className="about-hero">
            <img src={heroImage} alt="Group of friends celebrating during a mountain hike" />
            <div className="about-hero-content">
              <h1 className="about-hero-title">About Us</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-intro">
          <div className="about-intro-text">
            <h2>About Phnes. Travels</h2>
            <p>
              Since 1975, Phnes. Travels has been focused on bringing our customers the best in esteemed and quality travel
              arrangements. We are passionate about movement and sharing the world&apos;s marvels on the leisure travel side,
              and providing corporate explorers with tailored services to elevate their business travel needs. Our experts are
              ready to listen, curate, and accompany you every step of the way.
            </p>
          </div>
          <div className="about-intro-image">
            <img src={storyImage} alt="Two travelers overlooking a serene lake and mountains" />
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2 className="about-heading text-center mb-3">Why choose us?</h2>
          <p className="about-subheading text-center">These popular destinations have a lot to offer</p>
          <div className="about-choose-grid">
            {FEATURES.map((feature) => (
              <article className="about-choose-card" key={feature.title}>
                <div className="about-choose-icon">
                  <i className={feature.icon} aria-hidden="true" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2 className="about-heading text-center mb-3">Meet our teams</h2>
          <p className="about-subheading text-center">
            Meet the people who help keep Promo Nation running
          </p>
          <div className="about-team-grid">
            {TEAM.map((member) => (
              <article className="about-team-card" key={member.name}>
                <img src={member.avatar} alt={member.name} className="about-team-avatar" />
                <h3 className="h5 fw-semibold mb-1">{member.name}</h3>
                <p className="about-team-role">{member.role}</p>
                <p className="about-team-quote">“{member.quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-experiences">
          <div className="about-experiences-row">
            {EXPERIENCES.map((experience) => (
              <article key={experience.title}>
                <div className="about-experience-icon" aria-hidden="true">
                  {experience.icon}
                </div>
                <h3>{experience.title}</h3>
                <p>{experience.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

