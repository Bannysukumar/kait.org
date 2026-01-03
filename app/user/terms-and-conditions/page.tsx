import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000 pb-5" >
      <div className="px-6 py-10 max-w-4xl container bg-white mt-5 mb-5  mx-auto text-gray-800 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>

        <p className="text-sm italic text-gray-600">
          PLEASE READ THESE TERMS AND CONDITIONS OF USE CAREFULLY. BY ACCESSING OR USING OUR WEBSITES,
          MOBILE APPLICATIONS, SOFTWARE DEVELOPMENT KITS, APIs OR OTHER PRODUCTS OR SERVICES THAT HAVE LINKED TO THESE TERMS,
          YOU AGREE TO BE BOUND BY THEM.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Scope</h2>
          <p>
            These Terms and Conditions between KAIT COIN (“KAIT”) and the Client govern the execution and receipt of the KAIT-STAKING Service.
            They apply to all staking services provided by KAIT, regardless of which service is used.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Description of the Service</h2>
          <p>
            The KAIT-STAKING Service is a digital asset staking service operated by KAIT, allowing Clients to stake digital assets to one or
            more validators operated by KAIT in order to gain staking rewards. This is an IT service, not an investment service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Definitions</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Agreement</strong>: These Terms and Conditions and all attachments.</li>
            <li><strong>Client</strong>: The party using the Service provided by KAIT.</li>
            <li><strong>PoS</strong>: Proof-of-Stake consensus algorithm for validating transactions.</li>
            <li><strong>Service</strong>: The staking service provided by KAIT.</li>
            <li><strong>Staking</strong>: Participating in transaction validation on a PoS network using staked tokens.</li>
            <li><strong>Validator</strong>: Node responsible for validating blocks and earning rewards on a PoS network.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Acceptance of the Terms</h2>
          <p>
            By using the KAIT-STAKING Service, the Client acknowledges and agrees to be bound by these Terms and Conditions. If the Client
            does not agree, they should not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Obligations of the Client</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide accurate and complete information to KAIT.</li>
            <li>Ensure that the digital assets used for staking are legally owned and free of liens.</li>
            <li>Comply with applicable laws and regulations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Responsibilities of KAIT</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide a secure and stable staking infrastructure.</li>
            <li>Distribute rewards earned from staking activities to Clients as agreed.</li>
            <li>Notify Clients of any major changes to the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Fees and Rewards</h2>
          <p>
            KAIT may charge a commission on rewards earned. The current fee structure is available on the KAIT website and may be updated
            periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
          <p>
            Either party may terminate the Agreement with notice. Upon termination, KAIT will cease staking operations for the Client and
            return any unstaked assets as per network timelines.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Limitation of Liability</h2>
          <p>
            KAIT is not liable for any loss of funds due to network failures, slashing penalties, or other external factors beyond its
            control. Clients use the Service at their own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which KAIT operates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">11. Changes to Terms</h2>
          <p>
            KAIT reserves the right to modify these Terms at any time. Updated Terms will be posted on the KAIT website and effective
            immediately upon posting.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">12. Contact Information</h2>
          <p>
            For questions regarding these Terms and Conditions, please contact us at support@kaitcoin.com.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">13. Termination and Return of Assets</h2>
                   <ul className="list-disc list-inside space-y-1">

            <li>Upon termination,  Kait will cease staking operation for the client.</li>

            <li> When the client submitted the written proof of unstaked assets and staked assets are bought from the company.</li>

            <li> After auditing  the company return  any unstaked assets/balance assets as per network timelines.</li>
         </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
