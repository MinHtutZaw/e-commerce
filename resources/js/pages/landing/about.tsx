import Navbar from "@/Components/common/Navbar";
import Footer from "@/Components/common/Footer";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TeamMembers: TeamMember[] = [
  {
    name: "Min Htut",
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

      {/* Hero Section */}
      <section className="bg-emerald-700 text-white py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            About EduFit
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto">
            We are committed to providing seamless education and payment solutions for schools and students.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To simplify the education experience by integrating payment solutions and tools that empower students, parents, and schools.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To be the leading platform for secure and fast school transactions while fostering transparency and trust.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Team</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TeamMembers.map((member) => (
              <div
                key={member.name}
                className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-40 w-40 mx-auto rounded-full object-cover"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-700 text-black py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to collaborate or learn more?</h2>
          <p className="mb-6 text-gray-100">
            Reach out to us, and let's make education simpler and more effective together.
          </p>
          <a
            href="/contact"
            className="inline-block rounded-md bg-white text-emerald-700 px-6 py-3 font-semibold transition hover:bg-gray-100"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
