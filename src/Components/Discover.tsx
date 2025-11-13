'use client';

import React from 'react';

export default function Discover() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="position-relative text-white text-center"
        style={{
          background: 'url(src/assets/images/banner.png) center/cover no-repeat',
          height: '80vh',
        }}
      >
        <div className="d-flex align-items-start h-100">
          <h1 className="display-4 fw-bold position-absolute top-50 translate-middle-y ps-sm-5 px-lg-5">
            Discover
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="container">
        <div className="row mt-5">
          {/* Left Column */}
          <div className="col-lg-8 mt-5 lpart col-sm-12">
            <h2 className="pb-3">South Island</h2>
            <p className="pb-3">
              The Scuth Isfand of Now Zealand is renowned for its mountains, lakes
              and plociers. The Southern Alps home to 3,724m-high Aoraki ML. Cook,
              run along the entire length of the island, in the southwviat is
              Viertiond Notinnal Park, with steon-gided Mittord Scnd.
            </p>
            <p className="pb-3">
              In the north is Abel Tasman National Park, known foe its trails and
              ocean kayaking, Gueenstewn is fared for udventurs sporta lixe bungee
              jumping and shiing TASMANSEA OCEAN Other Destinations Suw all
            </p>
            <img
              src="/src/assets/images/south-island.png"
              className="img-fluid rounded mb-4"
              alt="South Island"
            />

            <h3 className="">Natural Geographic Features</h3>
            <a href="#">
              <i className="fa-solid fa-location-dot pb-4 fs-3"></i>
            </a>
            <span className="country text-capitalize">new Zealand</span>
            <p className="pb-3">
              O Now Zesland The Scuth Iefand has 15 named rsaritima fiords which
              ars all lecated in the vouthwust of the istand in a although all the
              mantime fiords use the wurd Sound in their name instead.
            </p>
            <p className="pb-0">
              The istand of-maul Ylew mor Turks and Caicos Islands* O torth ot
              Dominicun.go Most of New Zoalands g'acier are in the South inland.
              Thay aro ganerally foued in the Southemn Nps near the Muin Divide. An
              inventory of Seath istane giseiers during thei tunos indicatent thore
              were about 2,116 glaciers with an area ol at lsast onu hectare (2.5
              vcrus).
            </p>
            <div className="row g-3 mt-4">
              <div className="col-md-6">
                <img
                  src="/src/assets/images/image-1.png"
                  className="img-fluid rounded"
                  alt=""
                />
              </div>
              <div className="col-md-6">
                <img
                  src="/src/assets/images/image-2.png"
                  className="img-fluid rounded"
                  alt=""
                />
              </div>
            </div>
            <p className="mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
              voluptate, quibusdam cumque rerum vero earum delectus tenetur
              doloribus ipsa? Exercitationem!
            </p>
            <p className="mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
              voluptate, quibusdam cumque rerum vero earum delectus tenetur
              doloribus ipsa? Exercitationem! Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Totam voluptate, quibusdam cumque
              rerum vero earum delectus tenetur doloribus ipsa? Exercitationem!
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>

          {/* Right Column */}
          <div className="rightpart col-lg-4 mt-5 col-sm-12">
            <img
              src="src/assets/images/Map.png"
              className="img-fluid image rounded mb-5 "
              alt="NZ Map"
            />
            <div className="part mb-4 d-flex justify-content-between">
              <span className="fw-bold text-capitalize">Other Destinations</span>
              <a
                href="#"
                className="btn btn-sm btn-success border-1 text-center text-capitalize pt-lg-3 pb-lg-3 ps-lg-4 pe-lg-4 ps-md-3 pe-md-3 pt-md-2 pb-md-2"
              >
                see all
              </a>
            </div>

            {/* Card 1 */}
            <div className="card mb-3">
              <img
                src="/src/assets/images/des1.jpg"
                className="card-img-top photo1 position-relative img-fluid h-auto"
                alt="The Island of Maui"
              />
              <div className="card-body mt-4 position-absolute">
                <h4 className="card-title text-white pb-2">The Island of Maui</h4>
                <a href="#">
                  <i className="fa-solid fa-location-dot fs-4 pb-4 d-block"></i>
                </a>
                <button className="btn btn-sm btn-success text-center pt-lg-3 pb-lg-3 ps-4 pe-4 pt-md-2 pb-md-2 pt-sm-1 pb-sm-1">
                  View more
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card mb-3">
              <img
                src="/src/assets/images/des2.jpg"
                className="card-img-top photo1 position-relative img-fluid"
                alt="Turks and Caicos Islands"
              />
              <div className="card-body mt-4 position-absolute">
                <h4 className="card-title text-white pb-2">Turks and Caicos Islands</h4>
                <a href="#">
                  <i className="fa-solid fa-location-dot mt-3 fs-4 pb-4 d-block"></i>
                </a>
                <button className="btn btn-sm btn-success text-center pt-lg-3 pb-lg-3 ps-4 pe-4 pt-md-2 pb-md-2 pt-sm-1 pb-sm-1">
                  View more
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card">
              <img
                src="/src/assets/images/des3.webp"
                className="card-img-top photo1 position-relative img-fluid"
                alt="Glacier National Park"
              />
              <div className="card-body mt-3 position-absolute">
                <h4 className="card-title text-white pb-2">Glacier National Park</h4>
                <a href="#">
                  <i className="fa-solid fa-location-dot pb-4 fs-4 d-block"></i>
                </a>
                <button className="btn btn-sm btn-success text-center pt-lg-3 pb-lg-3 ps-4 pe-4 pt-md-2 pb-md-2 pt-sm-1 pb-sm-1">
                  View more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
