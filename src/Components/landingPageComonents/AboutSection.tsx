export default function AboutSection({ about }: any) {
  return (
    <div className="About_section">
      <img src={about.image} />

      <h1>{about.title}</h1>
      <p>{about.description}</p>
    </div>
  );
}
