import { Button } from './ui/button';

export const HeroSection = () => {
  return (
    <section className="bg-gray-100 min-h-screen flex items-center px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            The money app that
            <br />
            works for you
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            Managing money is hard, but you don't have to do it alone. Rocket Money empowers you to save more, spend less, see everything, and take back control of your financial life.
          </p>
          
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-medium">
            Sign up
          </Button>
        </div>
        
        {/* Right side - Mobile mockup */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            {/* Phone frame */}
            <div className="w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 rounded-[2.5rem] p-6 text-white relative overflow-hidden">
                {/* Status bar */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-medium">12:22</span>
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>

                {/* App header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-6 h-6 border-2 border-white rounded"></div>
                  <div className="text-lg font-bold">🚀 Rocket Money</div>
                  <div className="w-6 h-6 border-2 border-white rounded"></div>
                </div>

                {/* Spending card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="text-gray-600 text-sm mb-2">Current spend this month</div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="text-3xl font-bold text-gray-900">$3,298</div>
                    <div className="text-green-600 text-sm">$98 below avg. spend</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mb-4">
                    <div className="h-2 bg-purple-500 rounded-full w-3/4"></div>
                  </div>
                  <div className="text-right text-sm text-gray-600">BUDGET</div>
                </div>

                {/* QR Code section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="w-16 h-16 bg-gray-900 rounded-lg mb-2 flex items-center justify-center">
                        <div className="text-white text-xs">QR</div>
                      </div>
                      <div className="text-xs text-gray-600">Scan to download the app</div>
                    </div>
                    <div className="text-gray-600 text-sm">Payday in 8 days</div>
                  </div>
                </div>

                {/* Account section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-2">ACCOUNTS</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <span className="text-gray-900 font-medium">Checking</span>
                    </div>
                    <span className="text-gray-900 font-bold">$5,848</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};