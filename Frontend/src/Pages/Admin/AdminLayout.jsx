import React from "react";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="relative min-h-screen bg-white overflow-hidden font-family-google-sans">
            {/* Background */}
            <BackgroundGradient />

            {/* Content */}
            <div className="relative z-10 flex">
                <AdminSidebar />
                <main className="w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const BackgroundGradient = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(66,133,244,0.4)_0%,rgba(255,255,255,0)_80%)] blur-4xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(52,168,83,0.35)_0%,rgba(255,255,255,0)_80%)] blur-4xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_70%,rgba(66,133,244,0.3)_0%,rgba(255,255,255,0)_80%)] blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(52,168,83,0.25)_0%,rgba(255,255,255,0)_80%)] blur-3xl"></div>

        {/* Frosted overlay - only behind, not affecting content */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-xl"></div>
    </div>
);

export default AdminLayout;
