import React from 'react';
import { Link } from 'react-router-dom';
import RetroWindow from '../components/RetroWindow';

function Section({ title, children }) {
  return (
    <div className="readme-card">
      <div className="readme-block-title">📄 {title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function Readme() {
  return (
    <RetroWindow title="Home / ReadMe.txt">
      <div className="page-container">
        <div className="readme-heading"><h3 style={{ margin: 0 }}>How Pixels Works</h3></div>

        <Section title="What is this?">
          This is a quiet, pull-based space. Open when you want to see the next little thing—
          a reel, song, note, or story. No pressure, no pings.
        </Section>

        <Section title="Privacy">
          Everything runs in your browser and remembers progress on your device using localStorage.
          I only see anything if you choose to leave a comment.
        </Section>

        <Section title="How to use">
          1) Pick a category • 2) Tap “Load Next Message” • 3) Comment if you want • 4) Come back anytime.
        </Section>

        <Link className="pixel-button" to="/chat">Back →</Link>
      </div>
    </RetroWindow>
  );
}

export default Readme;