import { Link } from "react-router-dom";

export default function Marketing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-light tracking-tight">BATCH<span className="font-semibold">AI</span></div>
                    <div className="hidden md:flex space-x-8 text-sm text-gray-600">
                        <a href="#features" className="hover:text-black">Features</a>
                        <a href="#solutions" className="hover:text-black">Solutions</a>
                        <a href="#about" className="hover:text-black">About</a>
                        <a href="#contact" className="hover:text-black">Contact</a>
                    </div>
                    <Link
                        to="/home"
                        className="bg-black text-white px-5 py-2 text-sm rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="text-sm text-gray-500 mb-4 tracking-wider">⚡ BATCH AI OPTIMIZATION</div>
                        <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-tight">
                            TRANSFORM YOUR
                            <span className="font-semibold block">MANUFACTURING</span>
                        </h1>
                        <p className="text-gray-500 text-lg mt-6 max-w-md">
                            AI-powered predictions and recommendations for pharmaceutical batch production.
                        </p>

                        {/* Stats */}
                        <div className="flex space-x-8 mt-10">
                            <div>
                                <div className="text-2xl font-semibold">99.9%</div>
                                <div className="text-sm text-gray-500">Accuracy Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-semibold">45%</div>
                                <div className="text-sm text-gray-500">Energy Saved</div>
                            </div>
                            <div>
                                <div className="text-2xl font-semibold">24/7</div>
                                <div className="text-sm text-gray-500">Monitoring</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex space-x-4 mt-10">
                            <Link
                                to="/home"
                                className="bg-black text-white px-8 py-3 text-sm rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Start Optimizing →
                            </Link>
                            <button className="border border-gray-200 px-8 py-3 text-sm rounded-full hover:border-gray-400 transition-colors">
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* IMAGE PLACEMENT 1 - Hero Image */}
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <img
                                    src="final.jpg"
                                    alt="AI Manufacturing"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By Section */}
            <div className="border-t border-gray-100 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <p className="text-sm text-gray-400 text-center mb-8">TRUSTED BY INDUSTRY LEADERS</p>
                    <div className="flex flex-wrap justify-center gap-12 items-center opacity-50">
                        <span className="text-xl font-light">Pfizer</span>
                        <span className="text-xl font-light">Novartis</span>
                        <span className="text-xl font-light">Merck</span>
                        <span className="text-xl font-light">Johnson & Johnson</span>
                        <span className="text-xl font-light">Roche</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="text-sm text-gray-400 mb-3">WHY CHOOSE US</div>
                    <h2 className="text-4xl font-light">Intelligent solutions for</h2>
                    <h2 className="text-4xl font-semibold">modern manufacturing</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: "📊",
                            title: "Real-time Monitoring",
                            desc: "Track batch parameters live with millisecond precision and instant alerts.",
                            image: "feature1.jpg"
                        },
                        {
                            icon: "🤖",
                            title: "AI Predictions",
                            desc: "Advanced ML models predict quality outcomes before batch completion.",
                            image: "feature2.jpg"
                        },
                        {
                            icon: "⚡",
                            title: "Energy Optimization",
                            desc: "Reduce energy consumption by up to 45% with smart parameter adjustment.",
                            image: "feature3.jpg"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group">
                            {/* IMAGE PLACEMENT 2-4 - Feature Images */}
                            <div className="aspect-[4/3] bg-gray-50 rounded-xl mb-6 overflow-hidden">
                                <img
                                    src={
                                        i === 0 ? "/graph.jpg" :
                                            i === 1 ? "/ai.jpg" :
                                                "/bijli.jpg"
                                    }
                                    alt={feature.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* About Section */}
            <div id="about" className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="text-sm text-gray-400 mb-3">ABOUT US</div>
                            <h2 className="text-4xl font-light mb-6">
                                We believe AI can
                                <span className="font-semibold block">transform manufacturing</span>
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Founded by AI researchers and pharmaceutical engineers, we're on a mission to make
                                manufacturing more efficient, sustainable, and reliable through cutting-edge AI technology.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "99.9% prediction accuracy on quality metrics",
                                    "45% average energy savings across deployments",
                                    "FDA compliant and GMP certified"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-green-600 text-sm">✓</span>
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* IMAGE PLACEMENT 5 - About Image */}
                        <div className="relative">
                            <div className="aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    {<img src="robo.jpeg" alt="About Us" className="w-full h-full object-cover" />}
                                    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-black text-white py-20">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl md:text-5xl font-light mb-6">
                        Ready to optimize your
                        <span className="font-semibold block">manufacturing process?</span>
                    </h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join industry leaders using AI to improve quality and reduce costs.
                    </p>
                    <Link
                        to="/home"
                        className="bg-white text-black px-8 py-3 text-sm rounded-full hover:bg-gray-100 transition-colors inline-block"
                    >
                        Get Started Now →
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-xl font-light mb-4">BATCH<span className="font-semibold">AI</span></div>
                            <p className="text-sm text-gray-500">AI-powered optimization for pharmaceutical manufacturing.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>Features</li>
                                <li>Pricing</li>
                                <li>API</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>About</li>
                                <li>Blog</li>
                                <li>Careers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>Privacy</li>
                                <li>Terms</li>
                                <li>Security</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
                        © 2024 BatchAI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}