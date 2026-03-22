// Research data for the Research page
export const researchList = [
  {
    org: "NIT Trichy — Quadrotor UAV Control & Adaptive Systems",
    date: "May 2025 – Aug 2025",
    role: "Guide: Prof. Dr. K. Srinivasan & Prof. Dr. T. Shuprajhaa",
    loc: "Trichy, India",
    points: [
      "Synthesized a nonlinear control law by deriving the inverse dynamical equations of a Quadrotor UAV to cancel nonlinearities for attitude and altitude control via feedback linearization.",
      "Proposed a hybrid deep actor-critic reinforcement learning framework supervising an Internal Model Controller (IMC) for glycemic regulation in Type-1 Diabetes patients.",
      "Applied transfer learning with a pre-trained PPO agent to develop an adaptive controller that regulates glycemic levels across diverse patient models."
    ]
  },
  {
    org: "NIT Trichy — Autopilot & Bio-Inspired Control",
    date: "Feb 2024 – Sep 2025",
    role: "Guide: Prof. Dr. Ramakalyan Ayyagari & Prof. Subbareddy Chitta",
    loc: "Trichy, India",
    points: [
      "Developed a bio-inspired tuning framework for LQR controllers using Genetic Algorithm and Particle Swarm Optimization; achieved 10.4% faster settling time and 20% lower RMSE than analytical tuning.",
      "Developed an ANN-based autopilot control architecture trained on flight data to adapt to nonlinear aircraft dynamics — 49.8% reduction in settling time and 5% reduction in peak response.",
      "Implemented a data-driven control strategy for a mobile system by identifying a linear state-space model with the N4SID algorithm and designed a PID controller for stable closed-loop performance."
    ]
  },
  {
    org: "Indian Institute of Science, Bengaluru",
    date: "May 2024 – Aug 2024",
    role: "Guide: Prof. Dr. Jishnu Keshavan",
    loc: "Bengaluru, India",
    points: [
      "Designed and motion-studied a UAV docking mechanism in Autodesk Fusion 360 for multi-drone payload lifting; the design was subsequently used for fabrication.",
      "Devised a computer vision pipeline for ArUco marker detection using OpenCV and Python to enable precise UAV landing on moving UGV platforms.",
      "Estimated 6-DoF camera pose by implementing the PnP algorithm to compute rotational and translational vectors from 3D–2D point correspondences."
    ]
  }
];
