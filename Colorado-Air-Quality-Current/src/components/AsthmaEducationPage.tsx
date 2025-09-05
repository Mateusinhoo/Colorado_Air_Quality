import React from 'react';

const AsthmaEducationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Understanding Asthma</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive guide to asthma - from understanding the condition to managing symptoms and living well with asthma.
          </p>
        </div>

        {/* Quick Facts Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">25M</div>
            <div className="text-sm text-gray-600">Americans have asthma</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">6M</div>
            <div className="text-sm text-gray-600">Children with asthma</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1 in 13</div>
            <div className="text-sm text-gray-600">People have asthma</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Manageable condition</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* What is Asthma */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What is Asthma?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Asthma is a chronic lung disease that causes persistent airway inflammation. When triggered by allergens or irritants, 
              the airways become swollen, narrow, and produce extra mucus, making it difficult to breathe.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              During an asthma attack, the muscles around the airways tighten, the lining becomes inflamed and swollen, 
              and thick mucus is produced. This combination makes breathing extremely difficult.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Did You Know?</h4>
              <p className="text-blue-700 text-sm">
                Asthma affects people of all ages, but it most often starts during childhood. About half of people with asthma 
                also have allergies, and environmental factors play a significant role in triggering symptoms.
              </p>
            </div>
          </div>

          {/* Common Symptoms */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Common Symptoms
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">Shortness of breath</strong>
                  <p className="text-gray-600 text-sm">Feeling like you can't catch your breath, especially during activities</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">Wheezing</strong>
                  <p className="text-gray-600 text-sm">A whistling sound when breathing, especially when exhaling</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">Chest tightness</strong>
                  <p className="text-gray-600 text-sm">Feeling like someone is squeezing or sitting on your chest</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">Persistent cough</strong>
                  <p className="text-gray-600 text-sm">Especially at night or early morning, often with mucus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Types of Asthma */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Types of Asthma
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Severity Classifications</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-medium text-green-700">Mild Intermittent</h4>
                  <p className="text-sm text-gray-600">Symptoms up to 2 days/week, up to 2 nights/month</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-medium text-yellow-700">Mild Persistent</h4>
                  <p className="text-sm text-gray-600">Symptoms more than twice/week, no more than once/day</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-medium text-orange-700">Moderate Persistent</h4>
                  <p className="text-sm text-gray-600">Symptoms once/day and more than 1 night/week</p>
                </div>
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-medium text-red-700">Severe Persistent</h4>
                  <p className="text-sm text-gray-600">Symptoms throughout day on most days, frequently at night</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Special Categories</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-medium text-blue-800">Allergic Asthma</h4>
                  <p className="text-sm text-blue-700">Triggered by allergens like pollen, dust mites, or pet dander</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-medium text-green-800">Exercise-Induced</h4>
                  <p className="text-sm text-green-700">Symptoms occur only during or after physical activity</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <h4 className="font-medium text-purple-800">Occupational Asthma</h4>
                  <p className="text-sm text-purple-700">Caused by workplace irritants like chemicals or dust</p>
                </div>
                <div className="bg-pink-50 p-3 rounded">
                  <h4 className="font-medium text-pink-800">Childhood Asthma</h4>
                  <p className="text-sm text-pink-700">Most develop before age 5; may improve in adulthood</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Triggers */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Common Asthma Triggers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Environmental</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>Air pollution & smog</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>Wildfire smoke</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>Weather changes</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>Strong odors</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>Chemical fumes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Allergens</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Pollen (trees, grass, weeds)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Dust mites</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Pet dander</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Mold spores</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Cockroach allergens</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Other Factors</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Respiratory infections</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Physical exercise</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Strong emotions/stress</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Certain medications</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Food additives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Air Quality Connection */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            Air Quality & Asthma Connection
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">How Air Quality Affects Asthma</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Poor air quality is one of the most significant environmental triggers for asthma. Pollutants like PM2.5, 
                ozone, and nitrogen dioxide can cause immediate symptoms and long-term airway damage.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-400 rounded-full mr-3"></span>
                  <span className="text-gray-700">PM2.5 particles penetrate deep into lungs</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-400 rounded-full mr-3"></span>
                  <span className="text-gray-700">Ozone irritates airways and reduces lung function</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
                  <span className="text-gray-700">NO2 increases susceptibility to respiratory infections</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Protecting Yourself</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800">Monitor Air Quality</h4>
                  <p className="text-sm text-gray-600">Check daily AQI levels and plan outdoor activities accordingly</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800">Stay Indoors on Bad Days</h4>
                  <p className="text-sm text-gray-600">When AQI is above 100, limit outdoor exposure and exercise</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800">Use Air Purifiers</h4>
                  <p className="text-sm text-gray-600">HEPA filters can significantly improve indoor air quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interesting Facts */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Fascinating Asthma Facts
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">🏊‍♀️ Swimming & Asthma</h4>
                <p className="text-indigo-700 text-sm">
                  Swimming is often recommended for people with asthma because the warm, humid air above pools 
                  is less likely to trigger symptoms than cold, dry air.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🌙 Nighttime Patterns</h4>
                <p className="text-green-700 text-sm">
                  Asthma symptoms often worsen at night due to natural circadian rhythms that affect hormone 
                  levels and airway inflammation.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🏃‍♂️ Olympic Athletes</h4>
                <p className="text-purple-700 text-sm">
                  About 8% of Olympic athletes have asthma, proving that with proper management, 
                  the condition doesn't have to limit physical achievement.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">🌍 Global Impact</h4>
                <p className="text-orange-700 text-sm">
                  Asthma affects over 300 million people worldwide, making it one of the most common 
                  chronic diseases globally.
                </p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-pink-800 mb-2">🧬 Genetic Component</h4>
                <p className="text-pink-700 text-sm">
                  If one parent has asthma, there's a 25% chance their child will develop it. 
                  If both parents have asthma, the chance increases to 60-75%.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibent text-blue-800 mb-2">📱 Technology Helps</h4>
                <p className="text-blue-700 text-sm">
                  Smart inhalers can now track medication usage and send reminders, 
                  helping improve asthma management and outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Tips */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Living Well with Asthma
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Daily Management</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Take controller medications daily as prescribed
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Keep rescue inhaler always accessible
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Monitor peak flow readings regularly
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Follow your asthma action plan
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Trigger Avoidance</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Use allergen-proof bedding covers
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Keep humidity levels between 30-50%
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Vacuum with HEPA filter weekly
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Avoid strong fragrances and cleaners
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Lifestyle Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exercise regularly with proper warm-up
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Maintain a healthy weight
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Practice stress management techniques
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-purple-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Get annual flu and pneumonia vaccines
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Action */}
        <div className="bg-red-50 border-l-4 border-red-400 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-red-800 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            When to Seek Emergency Care
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-800">Severe Symptoms</h3>
              <ul className="space-y-2 text-red-700">
                <li>• Severe shortness of breath</li>
                <li>• Cannot speak in full sentences</li>
                <li>• Lips or fingernails turn blue</li>
                <li>• Extreme difficulty breathing</li>
                <li>• Peak flow drops below 50% of personal best</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-800">Emergency Actions</h3>
              <ul className="space-y-2 text-red-700">
                <li>• Use rescue inhaler immediately</li>
                <li>• Call 911 or go to emergency room</li>
                <li>• Sit upright, stay calm</li>
                <li>• Continue using rescue inhaler every 20 minutes</li>
                <li>• Have someone stay with you</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Helpful Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Asthma Action Plan</h3>
              <p className="text-sm text-gray-600">Work with your doctor to create a personalized plan for managing your asthma</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Asthma Apps</h3>
              <p className="text-sm text-gray-600">Use smartphone apps to track symptoms, medications, and triggers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Support Groups</h3>
              <p className="text-sm text-gray-600">Connect with others who understand the challenges of living with asthma</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with your healthcare provider for personalized asthma management and treatment plans.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AsthmaEducationPage;

