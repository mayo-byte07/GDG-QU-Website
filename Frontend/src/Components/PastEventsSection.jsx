import React from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaPlay,
  FaPhotoVideo,
  FaRegSmile
} from 'react-icons/fa';

const PastEvents = () => {
  const colors = {
    blue: '#4285f4',
    green: '#34a853',
    yellow: '#f9ab00',
    red: '#ea4335'
  };

  const pastEvents = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Web Development Bootcamp",
      facilitator: "Ashu Ayush",
      date: "2024-09-15",
      time: "2:00 PM - 5:00 PM",
      venue: "Computer Lab",
      audience: 85,
      rating: 4.8,
      feedback: "Amazing session! Learned so much about modern web development."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "AI/ML Introduction Workshop",
      facilitator: "Himanshu Halder",
      date: "2024-08-22",
      time: "3:00 PM - 6:00 PM",
      venue: "Auditorium",
      audience: 120,
      rating: 4.9,
      feedback: "Great insights into machine learning fundamentals."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "24-Hour Hackathon",
      facilitator: "Rahul Kumar",
      date: "2024-07-10",
      time: "24 Hours",
      venue: "Tech Park",
      audience: 45,
      rating: 4.7,
      feedback: "Intense but incredibly rewarding experience!"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Flutter Mobile Workshop",
      facilitator: "Debjit Das",
      date: "2024-06-18",
      time: "4:00 PM - 7:00 PM",
      venue: "Lab 301",
      audience: 68,
      rating: 4.6,
      feedback: "Perfect introduction to Flutter development."
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Cloud Computing Session",
      facilitator: "Kaushik Sarkar",
      date: "2024-05-25",
      time: "2:30 PM - 5:30 PM",
      venue: "Online",
      audience: 92,
      rating: 4.8,
      feedback: "Excellent coverage of cloud concepts and GCP."
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Cyber Security Workshop",
      facilitator: "Pravash Kumar Shaw",
      date: "2024-04-12",
      time: "1:00 PM - 4:00 PM",
      venue: "Security Lab",
      audience: 55,
      rating: 4.9,
      feedback: "Eye-opening session on security best practices."
    }
  ];

  const PastEventCard = ({ event }) => {
    return (
      <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Past Event Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-2xl font-bold mb-1">Completed</div>
              <div className="text-sm opacity-90">Watch Highlights</div>
            </div>
          </div>

          {/* Audience Count */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
            <FaUsers className="text-blue-500" />
            <span className="font-semibold text-gray-900">{event.audience}+</span>
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-1">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold text-gray-900">{event.rating}</span>
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
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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

          {/* Feedback Preview */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FaRegSmile className="text-green-500" />
              <span className="text-sm font-medium text-gray-700">Participant Feedback</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 italic">"{event.feedback}"</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center space-x-2">
              <FaPlay />
              <span>Watch Recap</span>
            </button>
            <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2">
              <FaPhotoVideo />
              <span>Gallery</span>
            </button>
          </div>
        </div>

        {/* Success Border */}
        <div className="absolute inset-0 border-2 border-green-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-50 px-6 py-3 rounded-full border border-yellow-200 mb-6">
            <FaCalendarAlt className="text-yellow-500" />
            <span className="text-lg font-semibold text-yellow-600">Past Events</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Successful Events{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
              We've Hosted
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Relive the amazing moments from our past events. Watch recordings, browse photos, and see what our community loved.
          </p>
        </div>

        {/* Past Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event) => (
            <PastEventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { number: '50+', label: 'Events Hosted', color: colors.blue },
            { number: '2000+', label: 'Participants', color: colors.green },
            { number: '4.8★', label: 'Average Rating', color: colors.yellow },
            { number: '98%', label: 'Satisfaction', color: colors.red }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
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

export default PastEvents;