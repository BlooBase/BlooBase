import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const TermsAndConditions = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  //this is a page explain the T&C's of BlooBase,it has the CSS styling on the same page too
  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () => setImageLoaded(true);
  }, []);

  return (
    <>
      <style>{`
        /* General Styling */
        .terms-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
          color: #333;
        }

        /* Logo Styling */
        .logo {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo img {
          max-width: 200px;
          height: auto;
          transition: opacity 0.5s ease;
        }

        .image-placeholder {
          font-size: 2rem;
          font-weight: bold;
          color: #4a6fa5;
          padding: 1rem;
        }

        .hidden {
          opacity: 0;
          height: 0;
          overflow: hidden;
        }

        .fade-in {
          opacity: 1;
        }

        /* Content Styling */
        .terms-content {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .terms-content h1 {
          color: #4a6fa5;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2.2rem;
          border-bottom: 2px solid #eee;
          padding-bottom: 1rem;
        }

        .terms-content h2 {
          color: #4a6fa5;
          margin-top: 2rem;
          font-size: 1.5rem;
          border-left: 4px solid #4a6fa5;
          padding-left: 1rem;
        }

        .terms-content p {
          margin-bottom: 1.5rem;
          text-align: justify;
        }

        .terms-content ul {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .terms-content li {
          margin-bottom: 0.8rem;
        }

        .terms-content strong {
          color: #4a6fa5;
        }

        /* Contact Info Styling */
        .contact-info {
          background-color: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 2rem;
        }

        .contact-info li {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .terms-container {
            padding: 1rem;
          }
          
          .terms-content {
            padding: 1.5rem;
          }
        
          .terms-content h1 {
            font-size: 1.8rem;
          }
        
          .terms-content h2 {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .terms-content {
            padding: 1rem;
          }
        
          .terms-content h1 {
            font-size: 1.5rem;
          }
        
          .logo img {
            max-width: 150px;
          }
        }
      `}</style>

      <section className="terms-container">
        <header className="logo">
          {!imageLoaded && <section className="image-placeholder">BlooBase</section>}
          <img
            src="/bloobase.png"
            alt="BlooBase Logo"
            className={imageLoaded ? "fade-in" : "hidden"}
          />
        </header>

        <section className="terms-content">
          <h1>BlooBase Terms and Conditions</h1>

          <p>
            BlooBase is a local artisan marketplace connecting artisans with buyers to promote and sell unique, handcrafted products. By accessing or using the BlooBase platform , you agree to be bound by these Terms and Conditions. These Terms govern your use of the Platform, whether as a Buyer, Seller (Artisan), or visitor. Please read them carefully.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, browsing, or making purchases on the BlooBase Platform, you acknowledge that you have read, understood, and agree to these Terms and Conditions, as well as our Privacy Policy. If you do not agree, you may not use the Platform. BlooBase reserves the right to modify these Terms at any time, with changes effective upon posting to the Platform. Continued use after such changes constitutes acceptance of the updated Terms.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            To use the Platform, you must be at least 18 years old or the age of majority in your jurisdiction and have the legal capacity to enter into binding contracts. By using the Platform, you represent that you meet these requirements. Accounts created by minors or on behalf of others without authorization are prohibited.
          </p>

          <h2>3. Account Registration</h2>
          <ul>
            <li>
              <strong>Buyers</strong>: To make purchases, you must register an account with accurate and complete information, including your name, email, and payment details. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </li>
            <li>
              <strong>Sellers (Artisans)</strong>: To sell on BlooBase, you must complete a multi-step registration process, including creating a profile, uploading products, and verifying your identity. You agree to provide truthful information about yourself and your products, including descriptions, pricing, and availability.
            </li>
            <li>
              <strong>Account Security</strong>: You agree to notify BlooBase immediately of any unauthorized use of your account. BlooBase is not liable for losses resulting from unauthorized access due to your failure to secure your account.
            </li>
          </ul>

          <h2>4. Seller Responsibilities</h2>
          <ul>
            <li>
              <strong>Product Listings</strong>: Sellers must ensure that all products listed are handcrafted, authentic, and accurately described, including materials, dimensions, and condition. Listings must comply with BlooBase's policies and applicable laws.
            </li>
            <li>
              <strong>Pricing and Fees</strong>: Sellers set their own prices but agree to pay BlooBase a commission or listing fee as outlined in the Seller Agreement. Fees are non-refundable unless otherwise stated.
            </li>
            <li>
              <strong>Order Fulfillment</strong>: Sellers are responsible for fulfilling orders promptly, ensuring products are shipped as described, and providing tracking information where applicable. Sellers must maintain adequate inventory to meet demand.
            </li>
            <li>
              <strong>Customer Service</strong>: Sellers agree to respond to buyer inquiries within 48 hours and resolve disputes in good faith.
            </li>
            <li>
              <strong>Compliance</strong>: Sellers must comply with all local, state, and federal laws, including tax obligations and regulations related to the sale of handcrafted goods.
            </li>
          </ul>

          <h2>5. Buyer Responsibilities</h2>
          <ul>
            <li>
              <strong>Purchases</strong>: Buyers agree to provide accurate payment and shipping information. All purchases are final, subject to BlooBase's Return Policy.
            </li>
            <li>
              <strong>Conduct</strong>: Buyers must interact respectfully with Sellers and refrain from using the Platform for fraudulent or illegal purposes.
            </li>
            <li>
              <strong>Reviews</strong>: Buyers may leave reviews for Sellers and products. Reviews must be honest, relevant, and comply with BlooBase's guidelines. Abusive or defamatory content is prohibited.
            </li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <ul>
            <li>
              <strong>Seller Content</strong>: By uploading product images, descriptions, or other content, Sellers grant BlooBase a non-exclusive, worldwide, royalty-free license to use, display, and reproduce such content for the purpose of operating and promoting the Platform.
            </li>
            <li>
              <strong>BlooBase Content</strong>: All trademarks, logos, designs, and content on the Platform (excluding Seller content) are the property of BlooBase or its licensors. Unauthorized use is prohibited.
            </li>
            <li>
              <strong>Infringement</strong>: Users must not upload or use content that infringes on third-party intellectual property rights. BlooBase reserves the right to remove infringing content and terminate accounts of repeat infringers.
            </li>
          </ul>

          <h2>7. Payments</h2>
          <ul>
            <li>
              <strong>Payment Processing</strong>: BlooBase uses third-party payment processors (e.g., Yoco, PayFast,Ozow) to handle transactions. By making a purchase or receiving payments, you agree to the terms of the applicable payment processor.
            </li>
            <li>
              <strong>Seller Payouts</strong>: Sellers receive payouts for completed orders, less applicable fees, on a schedule determined by BlooBase. Sellers are responsible for any taxes or fees associated with payouts.
            </li>
            <li>
              <strong>Refunds</strong>: Refunds are subject to BlooBase's Return Policy. Buyers must contact Sellers directly for return or refund requests, and Sellers must comply with the policy.
            </li>
          </ul>

          <h2>8. Prohibited Activities</h2>
          <p>
            Users may not:
          </p>
          <ul>
            <li>Use the Platform for illegal or unauthorized purposes.</li>
            <li>Post false, misleading, or offensive content.</li>
            <li>Attempt to hack, disrupt, or interfere with the Platform's operations.</li>
            <li>Use automated tools (e.g., bots, scrapers) to access or extract data from the Platform.</li>
            <li>Engage in harassment, fraud, or other harmful conduct.</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, BlooBase, its affiliates, and their respective officers, directors, employees, and agents are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to loss of profits, data, or goodwill. BlooBase's total liability for any claim shall not exceed the amount paid by you, if any, for accessing the Platform.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. BlooBase does not guarantee the accuracy, completeness, or availability of the Platform or its content.
          </p>

          <h2>11. Termination</h2>
          <p>
            BlooBase may suspend or terminate your account or access to the Platform at any time, with or without notice, for violations of these Terms, suspected fraud, or other reasons deemed necessary to protect the Platform or its users. Upon termination, your right to use the Platform ceases, but obligations such as payment of fees or resolution of disputes remain.
          </p>

          <h2>12. Dispute Resolution</h2>
          <ul>
            <li>
              <strong>Informal Resolution</strong>: Users agree to first attempt to resolve disputes with BlooBase or other users through direct communication or BlooBase's support team.
            </li>
            <li>
              <strong>Governing Law</strong>: These Terms are governed by the laws of California, USA, without regard to conflict of law principles.
            </li>
            <li>
              <strong>Arbitration</strong>: Any disputes not resolved informally shall be settled by binding arbitration in San Francisco, CA, administered by the American Arbitration Association under its rules. Each party shall bear its own costs, and the arbitrator's decision is final and enforceable in any court of competent jurisdiction.
            </li>
          </ul>

          <h2>13. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless BlooBase and its affiliates from any claims, liabilities, damages, or expenses (including reasonable attorneys' fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
          </p>

          <h2>14. Third-Party Links and Services</h2>
          <p>
            The Platform may contain links to third-party websites or services (e.g., payment processors, shipping providers). BlooBase is not responsible for the content, policies, or performance of these third parties.
          </p>

          <h2>15. Miscellaneous</h2>
          <ul>
            <li>
              <strong>Entire Agreement</strong>: These Terms, along with the Privacy Policy and Seller Agreement (if applicable), constitute the entire agreement between you and BlooBase.
            </li>
            <li>
              <strong>Severability</strong>: If any provision of these Terms is found unenforceable, the remaining provisions remain in effect.
            </li>
            <li>
              <strong>No Waiver</strong>: BlooBase's failure to enforce any right or provision does not constitute a waiver of such right or provision.
            </li>
            <li>
              <strong>Assignment</strong>: You may not assign your rights or obligations under these Terms without BlooBase's prior written consent. BlooBase may assign its rights freely.
            </li>
          </ul>
          <label htmlFor="terms">
            Return <Link to="/Createshop" className="terms-link">back</Link>
          </label>

          <section className="contact-info">
            <h2>Contact Information</h2>
            <ul>
              <li>Email: support@bloobase.com</li>
              <li>Address: BlooBase, 1 Jan Smuts Ave, Johannesburg, South Africa</li>
              <li>Phone: +27 12 345 6789</li>
              
            </ul>
          </section>
        </section>
      </section>
    </>
  );
};

export default TermsAndConditions;