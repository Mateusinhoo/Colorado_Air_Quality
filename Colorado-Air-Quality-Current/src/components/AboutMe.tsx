import React from 'react';

interface AboutMeProps {
  onNavigateToDiscoveries: () => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ onNavigateToDiscoveries }) => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-400 shadow-lg">
            <img 
              src="/mateus-profile.png" 
              alt="Mateus Stocco Di Francesco" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Mateus Stocco Di Francesco
          </h2>
          <p className="text-xl text-gray-600">
            Pre-med Student & Developer
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-1 gap-8">
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">About Me</h3>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Hey there, how are you?! My name is Mateus Stocco Di Francesco, and I am the creator of this website. I grew up in São Paulo, Brazil, a huge city with heavy traffic and dirty air and during my time there I really saw how bad air can make asthma and breathing problems worse, and that stuck with me. It's a big reason I care about clean air and simple tools that help people understand it. This project comes from that, trying to turn a big, messy issue into something clear and useful.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Now I'm in Colorado, on the pre-med track and really into coding and data. I like building things that anyone can use without needing a science degree. On this site you can check air quality near you, see how it changes over time, and get quick takeaways about what it might mean for your lungs. No heavy jargon, just straight, easy info. If something feels confusing, I want to fix it.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                I built this with tools like Python and Streamlit, and I'm always improving the speed, charts, and explanations. When I'm not studying or coding, I'm reading, helping with community health projects, and meeting people who care about science and fairness. Take a look around, try the maps and charts, and tell me what would make this better for you. I'm here to listen. And if you want to connect, hit me up on{' '}
                <a 
                  href="https://www.linkedin.com/in/mateus-di-francesco/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline font-medium transition-colors duration-200"
                >
                  LinkedIn
                </a>
                , would love to chat.
              </p>
            </div>
          </div>

          {/* Research Interests */}
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">My Interests</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Environmental Health</h4>
                    <p className="text-sm text-gray-600">
                      Impact of air pollution on respiratory diseases and public health outcomes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Data Science in Healthcare</h4>
                    <p className="text-sm text-gray-600">
                      Using data visualization and analysis to improve health outcomes
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Respiratory Medicine</h4>
                    <p className="text-sm text-gray-600">
                      Understanding asthma triggers and developing prevention strategies
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Health Equity</h4>
                    <p className="text-sm text-gray-600">
                      Addressing disparities in environmental health and healthcare access
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Connect */}
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Let's Connect</h3>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.linkedin.com/in/mateus-di-francesco/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              
              <a 
                href="https://github.com/Mateusinhoo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;

