const LatestEventCard = () => {
    const event = {
        name: "GDG QU — Web Dev Night",
        date: "Sep 30, 2025",
        time: "6:00 PM",
        location: "Main Auditorium",
        registered: 72,
        total: 100,
        description:
            "An evening of talks, demos and networking covering modern web tooling, React patterns and performance tips. Join us to learn and connect with fellow developers! Snacks and drinks provided. All levels welcome. Free entry.",
    };

    const percentage = Math.round((event.registered / event.total) * 100);

    return (
        // make this card take most of the horizontal space on large screens and full width on small screens
        <div className="w-full lg:w-2/3 lg:p-4">
            <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[102%] w-full h-full flex flex-col ">
                <div className="flex flex-col md:flex-row justify-center h-full items-center md:items-start gap-4">
                    {/* Info column */}
                    <div className="flex-1 h-full flex flex-col justify-evenly">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-2xl md:text-2xl font-bold text-gray-900">
                                    {event.name}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {event.date} • {event.time} •{" "}
                                    {event.location}
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2">
                                <span className="px-2 py-1 rounded-full bg-google-blue/10 text-google-blue text-sm font-medium">
                                    {percentage}%
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-4">
                            {event.description}
                        </p>

                        <div className="mb-4">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-google-blue to-google-green"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                                <span>{event.registered} registered</span>
                                <span>{event.total} seats</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-google-blue text-white rounded-lg shadow-sm hover:brightness-95 transition">
                                View Details
                            </button>
                            <button className="px-4 py-2 border border-white/20 text-gray-800 rounded-lg hover:bg-white/10 transition">
                                Manage
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestEventCard;
