import { Button } from "./ui/button";


export const FeatureOverview = () => {
  const features = [
    {
      title: "Smart Budgeting",
      description: "Set up custom budgets and get real-time alerts when you're close to your limits.",
      icon: "📊"
    },
    {
      title: "Bill Tracking",
      description: "Never miss a payment with automated bill tracking and reminders.",
      icon: "📅"
    },
    {
      title: "Savings Goals",
      description: "Set and track your savings goals with personalized recommendations.",
      icon: "🎯"
    },
    {
      title: "Expense Analytics",
      description: "Get detailed insights into your spending patterns with beautiful visualizations.",
      icon: "📈"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to manage your money
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features to help you take control of your finances and achieve your goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-medium">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};