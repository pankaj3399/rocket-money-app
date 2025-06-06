import { Button } from "./ui/button";

export const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Basic expense tracking",
        "Up to 2 bank accounts",
        "Basic budgeting tools",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: "$12",
      description: "Best for individuals",
      features: [
        "Everything in Free",
        "Unlimited bank accounts",
        "Advanced budgeting",
        "Bill negotiation",
        "Priority support",
        "Custom categories"
      ],
      popular: true
    },
    {
      name: "Family",
      price: "$24",
      description: "Perfect for families",
      features: [
        "Everything in Pro",
        "Up to 6 family members",
        "Family budgeting",
        "Shared goals",
        "24/7 phone support",
        "Advanced analytics"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-xl border ${
                plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">
                {plan.description}
              </p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full rounded-full px-8 py-6 text-lg font-medium ${
                  plan.popular 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};