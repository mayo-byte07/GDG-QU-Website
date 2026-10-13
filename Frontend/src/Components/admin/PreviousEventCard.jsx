const PreviousEventCard = () => {
    const event = {
        name: "React Meetup: Building for Scale",
        description:
            "Hands-on workshop exploring scalable React architectures, performance patterns, and real-world case studies.",
        venue: "QU Innovation Hub — Hall A",
        registered: 120,
        attendees: 95,
        date: "Oct 12, 2025",
        capacity: 150,
    };

    const attendancePercent = Math.round(
        (event.attendees / event.capacity) * 100
    );

    return (
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:p-4">
            <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[102%] w-full">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {event.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {event.date}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Venue</div>
                        <div className="text-sm font-medium text-gray-800">
                            {event.venue}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {event.description}
                </p>

                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <div className="px-3 py-4 bg-white/10 rounded-lg">
                        <div className="text-xs text-gray-500">Registered</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {event.registered}
                        </div>
                    </div>
                    <div className="px-3 py-4 bg-white/10 rounded-lg">
                        <div className="text-xs text-gray-500">Attendees</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {event.attendees}
                        </div>
                    </div>
                    <div className="px-3 py-4 bg-white/10 rounded-lg">
                        <div className="text-xs text-gray-500">Capacity</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {event.capacity}
                        </div>
                    </div>
                </div>

                {/* Attendance progress bar */}
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">Attendance</div>
                        <div className="text-sm font-medium text-gray-800">
                            {event.attendees} / {event.capacity} (
                            {attendancePercent}%)
                        </div>
                    </div>

                    <div
                        className="w-full bg-white/10 rounded-full h-3 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={attendancePercent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div
                            className="h-full bg-google-green"
                            style={{ width: `${attendancePercent}%` }}
                        />
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <button className="px-4 py-2 bg-google-blue text-white rounded-lg shadow-sm hover:brightness-95 transition">
                        View Details
                    </button>
                    <div className="text-xs text-gray-500 text-right">
                        Updated just now
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviousEventCard;
