import Navbar from "@/Components/common/Navbar";
import Footer from "@/Components/common/Footer";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Leon",
    role: "Founder & CEO",
    image: "/img/team1.jpg",
  },
  {
    name: "Aye Chan",
    role: "Lead Developer",
    image: "/img/team2.jpg",
  },
  {
    name: "Su Su",
    role: "Marketing Head",
    image: "/img/team3.jpg",
  },
];

export default function AboutUs() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-600 py-24 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            About EduFit
          </h1>
          <p className="mt-3 text-emerald-100 font-medium">
            Smart • Secure • Simple
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-100">
            EduFit is built to simplify education management by providing secure,
            fast, and transparent solutions for schools, parents, and students.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4 grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to simplify the education experience by integrating
              modern payment systems and digital tools that empower schools,
              parents, and students.
            </p>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We envision EduFit as a trusted platform that ensures secure,
              transparent, and efficient school transactions while building
              long-term trust within the education ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Why Choose EduFit?
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">
                Secure Payments
              </h3>
              <p className="mt-2 text-gray-600">
                All transactions are protected using secure and reliable
                technologies.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">
                Easy for Schools
              </h3>
              <p className="mt-2 text-gray-600">
                Simple tools to manage payments, records, and communication.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">
                Parent Friendly
              </h3>
              <p className="mt-2 text-gray-600">
                Clear payment history and instant access to important updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Meet Our Team
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto h-36 w-36 rounded-full object-cover ring-4 ring-emerald-100"
                />
                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-gray-500">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className=" py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Want to collaborate with us?
          </h2>
          <p className="mb-8 text-black">
            Let’s work together to make education simpler, smarter, and more
            effective.
          </p>
          <a
            href="mailto:leon@edufit.com"
            className="inline-block rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
