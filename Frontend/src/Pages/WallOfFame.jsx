import React, { useState } from 'react';
// Import the local data directly (adjust the path if your folders are different)
import { wallOfFameData, availableYears, googleColors, googleBgColors } from '../data/wallOfFameData';

const WallOfFame = () => {
  // Set the default selected year to the most recent one ("2024-2025")
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  // Get the array of members for the currently selected year
  const currentMembers = wallOfFameData[selectedYear] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Wall of Fame</h1>
        <p className="text-gray-600">Honoring our past leaders and core contributors</p>
      </div>

      {/* Year Selection Tabs */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedYear === year
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentMembers.map((member) => (
          <div 
            key={member.id} 
            className="rounded-xl p-6 flex flex-col items-center text-center shadow-sm border transition-transform hover:-translate-y-1"
            style={{ 
              backgroundColor: googleBgColors[member.color],
              borderColor: `${googleColors[member.color]}40` 
            }}
          >
            <div className="relative mb-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover border-4"
                style={{ borderColor: googleColors[member.color] }}
              />
              <span 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-sm"
                style={{ backgroundColor: googleColors[member.color] }}
              >
                {member.badge}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mt-2">{member.name}</h3>
            <p className="font-semibold mb-3" style={{ color: googleColors[member.color] }}>
              {member.position}
            </p>
            <p className="text-gray-700 text-sm mb-4 flex-grow">{member.bio}</p>
            
            {/* Skills Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-auto">
              {member.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/60 rounded text-xs font-medium text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallOfFame;