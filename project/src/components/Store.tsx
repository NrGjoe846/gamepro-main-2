import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Beginner',
    price: 'Free',
    description: 'Perfect for getting started with coding',
    features: [
      'Access to basic tutorials',
      'Community forum access',
      'Basic code challenges'
    ],
    color: 'from-blue-500/20 to-purple-500/20',
    icon: Star,
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'Take your skills to the next level',
    features: [
      'All Beginner features',
      'Advanced tutorials',
      'Priority support',
      'Premium challenges',
      'Code review assistance'
    ],
    color: 'from-purple-500/20 to-pink-500/20',
    icon: Crown,
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    description: 'For teams and organizations',
    features: [
      'All Pro features',
      'Team collaboration',
      'Custom learning paths',
      'API access',
      'Dedicated support'
    ],
    color: 'from-orange-500/20 to-red-500/20',
    icon: Zap,
    popular: false
  }
];

const Store = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400">
            Select the perfect learning path for your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div className="relative h-full">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} rounded-2xl blur-xl opacity-30`} />
                
                {/* Content */}
                <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>
                    <plan.icon className="w-8 h-8 text-blue-400" />
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-400 ml-2">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    Get Started
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">All Plans Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              'Access to Discord community',
              '24/7 system support',
              'Regular content updates',
              'Learning path guidance'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <Check className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-300">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
