const LatestMembersCard = () => {
    const totalMembers = 1248;
    const members = [
        {
            id: 1,
            name: "Aisha Khan",
            avatar: "https://i.pravatar.cc/64?u=aisha.khan",
        },
        {
            id: 2,
            name: "Omar Farooq",
            avatar: "https://i.pravatar.cc/64?u=omar.farooq",
        },
        {
            id: 3,
            name: "Lina Patel",
            avatar: "https://i.pravatar.cc/64?u=lina.patel",
        },
        {
            id: 4,
            name: "Samir Ali",
            avatar: "https://i.pravatar.cc/64?u=samir.ali",
        },
    ];

    return (
        // make this card take a smaller column on large screens and full width on small screens
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:p-4">
            <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[102%] w-full">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Members
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Total community members
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-extrabold text-gray-800">
                            {totalMembers}
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <h4 className="text-sm text-gray-600 mb-3">
                        Latest members
                    </h4>
                    <ul className="space-y-3">
                        {members.map((m) => (
                            <li key={m.id} className="flex items-center gap-3">
                                <img
                                    src={m.avatar}
                                    alt={m.name}
                                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/30"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                        {m.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Member
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <button className="px-4 py-2 bg-google-green text-white rounded-lg shadow-sm hover:brightness-95 transition">
                        View All Members
                    </button>
                    <div className="text-xs text-gray-500 text-right">
                        Updated just now
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestMembersCard;
