import React, { useState } from "react";
import LatestEventCard from "../../Components/admin/LatestEventCard";
import LatestMembersCard from "../../Components/admin/LatestMembersCard";
import TeamMembers from "../../Components/admin/TeamMembers";
import PreviousEventCard from "../../Components/admin/PreviousEventCard";
import LatestContactCard from "../../Components/admin/LatestContactCard";

const AdminDashboard = () => {
    const [userDetails, setUserDetails] = useState({ name: "Kaushik" });

    const [eventStats, setEventStats] = useState({
        totalVisitors: 2875,
        latestEventReg: 12,
        avgEventReg: 450,
    });

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-6 justify-center sm:justify-between">
                <div>
                    <h1 className="text-5xl font-bold mb-4 pt-4">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-red-500 to-yellow-500">Hello, {userDetails.name}</span>
                    </h1>
                    <p className="leading-0">Welcome to GDG - QU Dashboard.</p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="backdrop-blur-lg bg-white/30 p-6 sm:w-72 w-64 rounded-2xl text-center border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[102%]">
                        <div className="text-3xl font-semibold text-google-blue mb-2">
                            Visitors
                        </div>
                        <div className="text-4xl font-bold text-gray-800">
                            {eventStats.totalVisitors}
                        </div>
                    </div>
                    <div className="backdrop-blur-lg bg-white/30 p-6 sm:w-72 w-64 rounded-2xl text-center border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[102%]">
                        <div className="text-3xl font-semibold text-google-green mb-2">
                            Latest Event Reg.
                        </div>
                        <div className="text-4xl font-bold text-gray-800">
                            {eventStats.latestEventReg}
                        </div>
                    </div>
                    <div className="backdrop-blur-lg bg-white/30 p-6 sm:w-72 w-64 rounded-2xl text-center border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[102%]">
                        <div className="text-3xl font-semibold text-google-yellow mb-2">
                            Avg. Event Reg.
                        </div>
                        <div className="text-4xl font-bold text-gray-800">
                            {eventStats.avgEventReg}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex flex-wrap">
                <LatestEventCard />
                <LatestMembersCard />
                <TeamMembers />
                <PreviousEventCard />
                <LatestContactCard />
            </div>
        </div>
    );
};

export default AdminDashboard;
