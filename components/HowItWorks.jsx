import { Button } from "./ui/button";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your account in less than 2 minutes. No credit card required.",
      icon: "✨"
    },
    {
      number: "02",
      title: "Connect Your Accounts",
      description: "Securely link your bank accounts and credit cards to get started.",
      icon: "🔗"
    },
    {
      number: "03",
      title: "Set Your Goals",
      description: "Define your financial goals and let us help you achieve them.",
      icon: "🎯"
    },
    {
      number: "04",
      title: "Start Saving",
      description: "Get personalized insights and recommendations to save more money.",
      icon: "💰"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Rocket Money Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in minutes and begin your journey to financial freedom
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative"
            >
              <div className="bg-gray-50 p-6 rounded-xl h-full">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-medium">
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
};
