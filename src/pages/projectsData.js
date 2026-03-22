// Projects data for the Projects page
export const projectsList = [
  {
    title: "RL Framework for Adaptive Control of Quadrotor UAVs",
    date: "May – Aug 2025",
    desc: "Developed and trained actor-critic TD3 and DDPG algorithms for dynamic adjustment of controller gains in a Quadrotor UAV simulation. Devised a reward function based on LQG cost to guide the agent towards optimal performance through iterative learning. Exhibited disturbance rejection under external perturbations. Achieved 60% lower cumulative tracking error (IAE, ISE) compared to fixed-gain and model-based controllers including PID, LQR, and LMPC.",
    tags: ["TD3", "DDPG", "PyTorch", "LQG", "Quadrotor", "MuJoCo"]
  },
  {
    title: "Nonlinear Control of Cruise Missiles using Fuzzy-Tuned LQR",
    date: "Mar – Jun 2024",
    desc: "Derived a quasi-linearized fourth-order inner loop model from a nonlinear longitudinal missile autopilot using Feedback Linearization. Designed a Mamdani Type-1 fuzzy inference system in MATLAB for online adaptation of LQR weights (Q and R) in response to varying trajectories. Enhanced autopilot robustness by 28.92% compared to offline tuning approaches.",
    tags: ["Feedback Linearization", "LQR", "Fuzzy Logic", "MATLAB", "Simulink"]
  },
  {
    title: "All-Terrain Vehicle — Suspension & Steering Design",
    date: "Aug 2023 – Jan 2024",
    desc: "Engineered and validated the complete suspension and steering systems for an ATV build. Achieved track width reductions of 3.77% (front) and 2.13% (rear). Designed custom mounts and gussets in AutoCAD to ensure structural integrity and secure integration of the engine, shocks, and suspension arms.",
    tags: ["AutoCAD", "Vehicle Dynamics", "Suspension Design", "Fabrication"]
  }
];
