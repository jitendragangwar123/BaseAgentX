"use client";
import Link from "next/link";
import clsx from "clsx";

const colorMap : any= {
  red: {
    text: "text-red-400",
    bg: "bg-red-900/30",
    hover: "hover:border-red-500/50",
  },
  blue: {
    text: "text-blue-400",
    bg: "bg-blue-900/30",
    hover: "hover:border-blue-500/50",
  },
  green: {
    text: "text-green-400",
    bg: "bg-green-900/30",
    hover: "hover:border-green-500/50",
  },
  purple: {
    text: "text-purple-400",
    bg: "bg-purple-900/30",
    hover: "hover:border-purple-500/50",
  },
};

function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-teal-600 via-blue-700 to-purple-800 text-white">
      <div className="flex flex-col w-full max-w-6xl mx-auto mt-20 pt-10 pb-10 px-6 text-center font-arcade bg-gradient-to-r from-teal-500 via-blue-600 to-purple-700 rounded-xl shadow-2xl transform transition-all duration-500">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 z-0 transition-all duration-300">
          BaseAgentX
        </h1>

        <p className="text-2xl md:text-3xl font-bold mb-4 text-white z-0">
          Revolutionizing Financial Management with AI-Powered Agents
        </p>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 z-0 leading-relaxed tracking-wide transition-all duration-300 hover:text-gray-100">
          Unlock the potential of your <span className="text-teal-300 font-semibold">RWA investments</span> with cutting-edge AI technology. Let BaseAgentX guide your portfolio through a variety of tailored strategies, including risk management, yield optimization, and more, all in a decentralized, secure ecosystem.
        </p>

        <div className="w-full max-w-6xl mx-auto px-6 pb-10 font-arcade">
          <div className="p-8 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-8 text-teal-400">
              RWA Market Analyst
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  href: "bearish-strategy",
                  title: "Bearish",
                  description: "Conservative, risk-averse strategy",
                  color: "red",
                  iconPath: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
                },
                {
                  href: "buffet-strategy",
                  title: "Buffet",
                  description: "Value investing approach",
                  color: "blue",
                  iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
                },
                {
                  href: "bullish-strategy",
                  title: "Bullish",
                  description: "Growth-focused strategy",
                  color: "green",
                  iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                },
                {
                  href: "moon-strategy",
                  title: "Moon",
                  description: "High-risk, high-reward approach",
                  color: "purple",
                  iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                },
              ].map((item, index) => (
                <Link href={item.href} key={index} className="block group">
                  <div className={clsx(
                    "p-6 rounded-lg border border-gray-800 bg-gray-900/60 transition-all group-hover:scale-105 transform",
                    colorMap[item.color].hover
                  )}>
                    <div className="flex items-center space-x-4">
                      <div className={clsx(
                        "w-14 h-14 p-2 rounded-lg flex items-center justify-center",
                        colorMap[item.color].bg
                      )}>
                        <svg className={clsx("w-8 h-8", colorMap[item.color].text)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                        </svg>
                      </div>
                      <div>
                        <span className={clsx("text-lg font-medium text-white", `group-hover:${colorMap[item.color].text}`)}>
                          {item.title}
                        </span>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
