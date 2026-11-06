import React from "react";
import badgeImage from "../assets/images/nexora-2027-hackathon-badge.png";
import "./NexoraBadge.css";

export default function NexoraBadge() {
  const configuredUrl = import.meta.env.VITE_NEXORA_URL?.trim();
  let href = "";

  try {
    const parsedUrl = new URL(configuredUrl);
    if (["http:", "https:"].includes(parsedUrl.protocol)) {
      href = parsedUrl.href;
    }
  } catch {
    // Leave the badge inactive until a valid destination is configured.
  }

  const badgeContent = (
    <>
      <img
        src={badgeImage}
        alt="NEXORA 2027 Hackathon"
        className="nexora-badge__image"
      />
      <span className="nexora-badge__x-flicker" aria-hidden="true">X</span>
    </>
  );

  if (!href) {
    return (
      <div
        className="nexora-badge"
        aria-label="NEXORA 2027 Hackathon; destination to be added"
        title="Add VITE_NEXORA_URL to enable this link"
      >
        {badgeContent}
      </div>
    );
  }

  return (
    <a className="nexora-badge" href={href} aria-label="Visit NEXORA 2027 Hackathon">
      {badgeContent}
    </a>
  );
}
