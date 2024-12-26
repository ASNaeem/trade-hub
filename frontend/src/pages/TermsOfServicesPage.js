import React from "react";
import Header from "../components/Header";

const TermsOfServicesPage = () => {
  return (
    <>
      <Header
        shadow={true}
        className="text-black !fixed bg-[var(--foreGroundColor)] overflow-hidden fill-[var(--buttonColor)]"
      />
      <div className="min-h-[calc(100vh-var(--header-height))] p-4 pt-24 bg-[var(--background-color)] text-[var(--text-color)] mt-[var(--header-height)]">
        <div className="max-w-3xl mx-auto bg-[var(--secondary-background)] px-8 py-3 rounded-lg shadow-md">
          <h1 className="text-5xl text-center py-5 font-bold mb-4 bg-gradient-to-r from-[var(--primaryColor)] to-[var(--accentColor)] text-transparent bg-clip-text">
            Terms of Service
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl text-[var(--primary-color)] mb-4 font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed mb-4">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-[var(--primary-color)] mb-4 font-semibold">
              2. Use License
            </h2>
            <p className="leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on our website for personal,
              non-commercial transitory viewing only.
            </p>
            <ul className="list-disc ml-8 mb-4 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                on the website
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-[var(--primary-color)] mb-4 font-semibold">
              3. User Account
            </h2>
            <p className="leading-relaxed mb-4">
              To access certain features of the website, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-[var(--primary-color)] mb-4 font-semibold">
              4. Privacy Policy
            </h2>
            <p className="leading-relaxed mb-4">
              Your use of our website is also governed by our Privacy Policy.
              Please review our Privacy Policy, which also governs the website
              and informs users of our data collection practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-[var(--primary-color)] mb-4 font-semibold">
              5. Disclaimer
            </h2>
            <p className="leading-relaxed mb-4">
              The materials on our website are provided on an 'as is' basis. We
              make no warranties, expressed or implied, and hereby disclaim and
              negate all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-[var(--primary-color)] mb-4 font-semibold">
              6. Limitations
            </h2>
            <p className="leading-relaxed mb-4">
              In no event shall our company or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-[var(--primary-color)] mb-4 font-semibold">
              7. Governing Law
            </h2>
            <p className="leading-relaxed mb-4">
              These terms and conditions are governed by and construed in
              accordance with the laws of your country and you irrevocably
              submit to the exclusive jurisdiction of the courts in that
              location.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicesPage;
