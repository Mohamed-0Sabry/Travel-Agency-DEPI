import "@/styles/globals.css"
import '@/styles/flight-discover.css'
const MiniCard = ({ image, title, subtitle, cta }) => (
  <article className="mini-card">
    <div className="media">
      <img src={image} alt={title} />
    </div>
    <div className="meta">
      <h6 className="mb-1">{title}</h6>
      <small className="text-muted d-block mb-2">{subtitle}</small>
      <a className="btn btn-sm btn-outline-secondary" href={cta?.href || '#'}>{cta?.text || 'View'}</a>
    </div>
  </article>
);

export default function DiscoverModern() {
  return (
    <>
      <section className="modern-hero position-relative d-flex align-items-center text-white">
        <div className="hero-media" aria-hidden="true"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <p className="eyebrow">Explore</p>
              <h1 className="display-4 fw-bold hero-title">Discover the <span className="accent">World</span> Differently</h1>
              <p className="lead text-white-75 mb-4">Immersive travels, local secrets and curated experiences — crafted for the modern explorer.</p>

              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <a className="btn btn-primary btn-lg btn-cta me-2" href="#content">Get inspired</a>
                <a className="btn btn-outline-light btn-lg" href="#book">Book a tour</a>
              </div>

              <div className="chip-row mt-4 d-flex justify-content-center gap-2 flex-wrap">
                <span className="chip">Adventure</span>
                <span className="chip">Nature</span>
                <span className="chip">Culture</span>
                <span className="chip">Family</span>
              </div>
            </div>
          </div>
        </div>

        {/* subtle gradient glow */}
        <div className="hero-glow" aria-hidden="true"></div>
      </section>

      <main id="content" className="container my-5">
        <div className="row g-4">
          <article className="col-lg-8">
            <div className="card shadow-lg border-0 overflow-hidden modern-article">
              <div className="row g-0">
                <div className="col-12 position-relative hero-article-media">
                  <img src="/src/assets/images/south-island.png" alt="South Island" className="w-100" />
                  <div className="article-badge">South Island</div>
                </div>

                <div className="col-12 p-4">
                  <h2 className="fw-bold">South Island — New Zealand</h2>
                  <p className="lead text-muted">Mountains, fjords and dramatic coastlines. The South Island is an adventurer's playground with scenic drives, glacier hikes, and world-class stargazing.</p>

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <p className="text-muted">The Southern Alps run along the island's spine, culminating in Aoraki / Mt Cook. National parks, rivers and fiords create a diverse landscape for every traveler.</p>
                    </div>
                    <div className="col-md-6">
                      <p className="text-muted">From kayaking Abel Tasman to glacier walks near Fox and Franz Josef, you'll find both gentle and adrenaline-fuelled experiences.</p>
                    </div>
                  </div>

                  <div className="mt-4 gallery row g-3">
                    <div className="col-md-6">
                      <img src="/src/assets/images/image-1.png" alt="scenery 1" className="img-fluid rounded-3" />
                    </div>
                    <div className="col-md-6">
                      <img src="/src/assets/images/image-2.png" alt="scenery 2" className="img-fluid rounded-3" />
                    </div>
                  </div>

                  <p className="mt-4 text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam voluptate, quibusdam cumque rerum vero earum delectus tenetur doloribus ipsa.</p>

                  <div className="d-flex gap-2 mt-4 align-items-center">
                    <a className="btn btn-outline-secondary" href="#">Read more</a>
                    <a className="btn btn-primary" href="#book">Book now</a>
                    <div className="ms-auto text-muted small">Estimated trip: <strong>7 days</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <aside className="col-lg-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="glass-card mb-4 p-3 shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src="/src/assets/images/Map.png" alt="map" style={{ width: 64, height: 64, objectFit: 'cover' }} className="rounded" />
                  <div>
                    <div className="small text-muted">Plan</div>
                    <div className="fw-bold">Other Destinations</div>
                  </div>
                </div>

                <div className="d-flex gap-2 flex-column">
                  <MiniCard
                    image={'/src/assets/images/des1.jpg'}
                    title={'The Island of Maui'}
                    subtitle={'Hawaii — USA'}
                    cta={{ text: 'View more' }}
                  />

                  <MiniCard
                    image={'/src/assets/images/des2.jpg'}
                    title={'Turks and Caicos'}
                    subtitle={'Caribbean'}
                    cta={{ text: 'View more' }}
                  />

                  <MiniCard
                    image={'/src/assets/images/des3.webp'}
                    title={'Glacier National Park'}
                    subtitle={'Canada / USA'}
                    cta={{ text: 'View more' }}
                  />
                </div>
              </div>

              <div className="glass-card p-3 shadow-sm">
                <h6 className="mb-2">Quick Facts</h6>
                <ul className="list-unstyled small text-muted mb-0">
                  <li className="mb-2"><strong>Best time:</strong> Oct — Apr</li>
                  <li className="mb-2"><strong>Language:</strong> English (Maori)</li>
                  <li className="mb-2"><strong>Currency:</strong> NZD</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
