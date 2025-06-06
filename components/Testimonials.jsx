export const Testimonials = () => {
  const testimonials = [
    {
      quote: "Rocket Money has completely transformed how I manage my finances. I've saved over $200 in just the first month!",
      author: "Sarah Johnson",
      role: "Marketing Manager",
      avatar: "👩"
    },
    {
      quote: "The subscription tracking feature alone is worth it. I found so many forgotten subscriptions I was still paying for.",
      author: "Michael Chen",
      role: "Software Engineer",
      avatar: "👨"
    },
    {
      quote: "Finally, a money app that actually helps me save money instead of just tracking it. The insights are incredibly valuable.",
      author: "Emily Rodriguez",
      role: "Small Business Owner",
      avatar: "👩"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by thousands of users
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our users have to say about their experience with Rocket Money
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <blockquote className="text-gray-600 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-gray-500 text-sm">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 