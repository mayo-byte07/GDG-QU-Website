import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaRegBookmark,
  FaShare,
  FaUsers
} from 'react-icons/fa';

const UpcomingEvents = () => {
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const colors = {
    blue: '#4285f4',
    green: '#34a853',
    yellow: '#f9ab00',
    red: '#ea4335'
  };

  const upcomingEvents = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "React Workshop: Advanced Hooks",
      facilitator: "Ashu Ayush",
      date: "2024-10-24",
      time: "6:00 PM - 8:00 PM",
      venue: "Google Meet",
      type: "workshop",
      seats: 50,
      registered: 35
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "AI/ML Tech Talk: Future of AI",
      facilitator: "Himanshu Halder",
      date: "2024-10-28",
      time: "5:00 PM - 7:00 PM",
      venue: "College Auditorium",
      type: "tech-talk",
      seats: 100,
      registered: 78
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "24-Hour Hackathon: Build for Good",
      facilitator: "Rahul Kumar",
      date: "2024-11-05",
      time: "10:00 AM - Next Day",
      venue: "Tech Park Campus",
      type: "hackathon",
      seats: 30,
      registered: 22
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Flutter Mobile Development",
      facilitator: "Debjit Das",
      date: "2024-11-12",
      time: "4:00 PM - 6:00 PM",
      venue: "Lab Building Room 201",
      type: "workshop",
      seats: 40,
      registered: 28
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Cloud Computing with GCP",
      facilitator: "Kaushik Sarkar",
      date: "2024-11-18",
      time: "3:00 PM - 5:00 PM",
      venue: "Online Session",
      type: "workshop",
      seats: 60,
      registered: 45
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Cyber Security Workshop",
      facilitator: "Pravash Kumar Shaw",
      date: "2024-11-25",
      time: "2:00 PM - 4:00 PM",
      venue: "Security Lab",
      type: "workshop",
      seats: 35,
      registered: 20
    }
  ];

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'workshop': return colors.blue;
      case 'tech-talk': return colors.green;
      case 'hackathon': return colors.yellow;
      default: return colors.red;
    }
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'workshop': return '🔧';
      case 'tech-talk': return '🎤';
      case 'hackathon': return '⚡';
      default: return '🎯';
    }
  };

  const EventCard = ({ event }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Event Type Badge */}
          <div 
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-semibold backdrop-blur-sm"
            style={{ backgroundColor: getEventTypeColor(event.type) }}
          >
            {getEventTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </div>

          {/* Date Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg">
            <div className="text-sm font-bold text-gray-900">{new Date(event.date).getDate()}</div>
            <div className="text-xs text-gray-600">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
          </div>

          {/* Hover Actions */}
          <div className="absolute bottom-4 right-4 flex space-x-2 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
              <FaRegBookmark />
            </button>
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
              <FaShare />
            </button>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
          
          {/* Facilitator */}
          <div className="flex items-center space-x-2 mb-3">
            <FaUser className="text-gray-400 text-sm" />
            <span className="text-sm text-gray-600">By {event.facilitator}</span>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaCalendarAlt />
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaClock />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaMapMarkerAlt />
              <span>{event.venue}</span>
            </div>
          </div>

          {/* Registration Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Seats filled</span>
              <span>{event.registered}/{event.seats}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(event.registered / event.seats) * 100}%`,
                  backgroundColor: getEventTypeColor(event.type)
                }}
              ></div>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            className="w-full py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: getEventTypeColor(event.type),
              color: 'white'
            }}
          >
            <span>Register Now</span>
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {/* Hover Border Effect */}
        <div 
          className="absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ borderColor: getEventTypeColor(event.type) }}
        ></div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-50 px-6 py-3 rounded-full border border-green-200 mb-6">
            <FaCalendarAlt className="text-green-500" />
            <span className="text-lg font-semibold text-green-600">Upcoming Events</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Don't Miss These{' '}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Amazing Events
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our upcoming workshops, tech talks, and hackathons. Learn new skills and network with industry experts.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
            <FaCalendarAlt />
            <span>View All Upcoming Events</span>
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default UpcomingEvents;