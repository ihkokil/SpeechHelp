
import Translate from '@/components/Translate';

const PaymentSection = () => {
  return (
    <section className="border-l-4 border-yellow-500 pl-6 bg-yellow-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-yellow-800">
        <Translate text="legal.termsOfService.payment.title" fallback="Subscription Plans and Payment" />
      </h2>
      
      <h3 className="text-xl font-medium text-gray-800 mb-3">Subscription Plans</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        We offer various subscription plans with different features and usage limits. Plan details, pricing, and features are available on our pricing page and may be updated from time to time.
      </p>
      
      <h3 className="text-xl font-medium text-gray-800 mb-3">Payment Processing</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Payments are processed securely through Stripe. By subscribing, you agree to:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Pay all applicable fees and charges</li>
        <li>Provide valid payment information</li>
        <li>Authorize automatic recurring charges for subscription plans</li>
        <li>Pay any applicable taxes</li>
      </ul>
      
      <h3 className="text-xl font-medium text-gray-800 mb-3">Cancellation and Refunds</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        You may cancel your subscription at any time through your account settings. Cancellations will take effect at the end of your current billing period. We do not provide refunds for partial billing periods except as required by law or at our sole discretion.
      </p>
    </section>
  );
};

export default PaymentSection;
