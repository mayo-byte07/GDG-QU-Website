const LatestContactCard = () => {
    const latestContact = {
        name: "Noor Ahmed",
        email: "noor.ahmed@example.com",
        message:
            "Hi team, I loved the recent meetup and wanted to know if there will be recordings available. Also interested in volunteering for the next event — please let me know the process.",
        date: "Oct 20, 2025",
    };

    const initials = latestContact.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:p-4">
            <div className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[102%] w-full min-h-[220px] flex flex-col justify-between">
                <div>
                    <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-500">
                            Latest contact form
                        </h4>
                    </div>

                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-google-blue text-white flex items-center justify-center font-semibold text-xl">
                                {initials}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {latestContact.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {latestContact.date}
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-700 break-words max-w-xs text-right">
                            <a
                                href={`mailto:${latestContact.email}`}
                                className="text-google-blue hover:underline"
                            >
                                {latestContact.email}
                            </a>
                        </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">
                        {latestContact.message}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <a
                        href="/admin/forms"
                        className="px-4 py-2 bg-google-blue text-white rounded-lg shadow-sm hover:brightness-95 transition"
                    >
                        See all forms
                    </a>
                    <div className="text-xs text-gray-500 text-right">
                        Updated just now
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestContactCard;
