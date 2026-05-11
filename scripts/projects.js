// Add, remove, and reorder projects here.
// Image paths can be PNG/JPG/WebP/GIF. Use optimized GIFs or short muted MP4/WebM videos for large animations.
window.PROJECTS = [
{
  id: "mpm-liquid-layers",
  title: "Layered Fluid Simulation with MPM",
  date: "Spring 2026",
  year: "2026",
  category: "simulation",
  tags: [
    "MPM",
    "MLS-MPM",
    "APIC",
    "fluids",
    "continuum simulation",
    "interactive physics"
  ],
  image: "assets/projects/mpm-liquid-layers2.mp4",
  featured: true,

  description:
    "An interactive 2D MLS-MPM fluid simulator inspired by Grant Kot’s Liquid Layers, exploring whether continuum physics can reproduce stylized layered-fluid behavior.",

  summary:
    "This project investigates whether a continuum-based physics simulator can reproduce the stylized layered-fluid behavior of Grant Kot’s Liquid Layers. Instead of using direct particle-particle forces, the simulator uses a weakly-compressible MLS-MPM/APIC fluid formulation: particles carry material identity, mass, velocity, color, volume state, and affine velocity information, while a background grid mediates interactions, computes pressure and viscous updates, applies boundary conditions, and transfers motion back to the particles. The result is a visually expressive layered-fluid sandbox that demonstrates smooth mixing, density-influenced motion, randomized stress tests, and interactive mouse forces, while also revealing the tradeoffs between visual realism, physical realism, numerical diffusion, stability, and performance.",

  links: [
    {
      label: "Code",
      url: "https://github.com/sarahnator/mpm-liquid-layers"
    },
    {
      label: "Writeup",
      url: "assets/pdfs/Layered_Fluid_Simulation_with_MPM.pdf"
    },
    {
      label: "Slides",
      url: "https://docs.google.com/presentation/d/1JFhhkA93mrtAHainwEBYeIHVnZTWvFgpUfbZhiq7l1U/edit?usp=sharing"
    },
    {
      label: "Demo Videos",
      url: "https://www.youtube.com/playlist?list=PLPGYd_D1cyeW4gxizkjeEAHw3HAmvQCyE"
    }
  ],

  media: [
    {
      type: "youtube",
      title: "Random Forcing Stress Test",
      videoId: "wRGYeza-i6M&list=PLPGYd_D1cyeW4gxizkjeEAHw3HAmvQCyE&index=1",
      start: 400,
      end: 490
    },
    {
      type: "youtube",
      title: "Interactive Layered Fluid Demo",
      videoId: "tC-N2I3cyJQ&list=PLPGYd_D1cyeW4gxizkjeEAHw3HAmvQCyE&index=",
      start: 0,
      end: 90
    },
    {
      type: "pdf",
      title: "Project Writeup",
      url: "assets/pdfs/Layered_Fluid_Simulation_with_MPM.pdf"
    },
    {
      type: "pptx",
      title: "Project Slides",
      url: "assets/slides/slides_Layered_Fluid_Simulation_with_MPM.pptx"
    }
  ],

  sections: [
    {
      heading: "Motivation",
      body:
        "This project was inspired by Grant Kot’s Liquid Layers, a visually rich particle-based fluid simulation. Kot’s demo produces sharp, colorful, interactive layered-fluid behavior using particle-based viscoelastic simulation. My goal was not to reproduce that method exactly, but to build a related layered-fluid system using the Material Point Method, a hybrid Lagrangian/Eulerian continuum simulation framework. The guiding question was: can a physics-based continuum simulator reproduce stylized behaviors such as layering, mixing, and interactive manipulation?"
    },
    {
      heading: "MPM Intuition",
      body:
        "MPM represents material using particles, but the particles do not directly interact with one another. Instead, particles carry mass, velocity, color, material identity, and other state variables, while a temporary background grid computes spatial interactions. Each timestep transfers particle mass and momentum to the grid, updates grid velocities using forces and boundary conditions, transfers the updated motion back to the particles, advects the particles, and then resets the grid. This hybrid structure lets particles handle large deformation and material tracking, while the grid provides a clean place to compute gradients, pressure-like forces, and wall interactions."
    },
    {
      heading: "MLS-MPM and APIC Transfers",
      body:
        "The implementation follows an MLS-MPM/APIC-style structure. Basic particle-grid transfers can be overly dissipative because they represent each particle with only a constant velocity. APIC improves this by storing an affine velocity matrix C_p on each particle, so the local velocity field is approximated as v(x) ≈ v_p + C_p(x - x_p). This lets the particle carry local rotational, shear, and stretching information across transfers. In practice, each particle scatters to a 3 × 3 stencil of nearby grid nodes using quadratic B-spline weights, and the affine term helps reduce numerical dissipation compared with simpler particle-in-cell transfers."
    },
    {
      heading: "Fluid Model",
      body:
        "The solver uses a weakly-compressible Newtonian fluid model. Pressure is computed with a Tait equation of state, where the bulk modulus K controls how strongly density or volume changes are penalized. The stress has two main parts: an isotropic pressure response that resists compression, and a viscous term based on the symmetric part of the APIC velocity-gradient approximation. This makes the fluid approximately incompressible when K is large, but not truly incompressible: density changes are penalized rather than exactly projected away."
    },
    {
      heading: "Near-Incompressibility and Stability",
      body:
        "The bulk modulus K creates a direct tradeoff. Larger K makes the fluid behave more like a liquid by suppressing density fluctuations, but it also increases the material wave speed and tightens the timestep restriction. If K is too large relative to the timestep, the explicit pressure update can overshoot, causing the volume proxy J and pressure to oscillate until the simulation explodes. If K is too small, the fluid becomes visibly compressible and can look more like a gas. The code reports a CFL-suggested timestep based on acoustic wave speed, but the writeup notes that this estimate does not account for viscosity, the linearized J update, or mouse-driven grid velocity changes, so the default timestep is set more conservatively."
    },
    {
      heading: "Implementation Details",
      body:
        "The implementation is a small 2D weakly-compressible MLS-MPM liquid solver with a few deliberate simplifications. First, the standard fused MLS-MPM particle-to-grid transfer is separated into mass/momentum and stress passes, with a volume recomputation step between them. Second, because the fluid model depends on a scalar volume-change proxy J rather than the full deformation gradient, the code updates J directly using a first-order approximation J ← J(1 + dt · tr(C_p)). Third, particle volume is recomputed each step from the grid mass field to reduce free-surface artifacts and mitigate accumulated drift in J. These choices make the solver simpler and more robust for the demo, but they also introduce approximation error."
    },
    {
      heading: "Layered Fluid Setup",
      body:
        "The demo supports multiple colored fluids with different material parameters. Rectangular blocks are seeded with several particles per grid cell, using a small deterministic jitter to avoid perfectly regular lattice artifacts. Particle mass is initialized from the rest density and particle spacing so that the initial volume state corresponds to zero Tait pressure. For density-driven experiments, the denser fluid can be initialized above the lighter fluid, creating a Rayleigh–Taylor-like unstable configuration that encourages motion and mixing."
    },
    {
      heading: "Interactive Forces",
      body:
        "Mouse interaction is applied on the grid after the grid velocity update and before grid-to-particle transfer. This means particles feel user interaction indirectly through the grid, consistent with the overall MPM structure. The grab mode uses a compact radial falloff to pull nearby grid nodes toward the cursor, acting like an impulse-style attractor field. The whirlpool mode constructs a target velocity field with tangential solid-body rotation plus an inward radial component, then relaxes grid velocities toward that target. These interactions are effective for visual exploration, but they are not conservative physical forces and can inject arbitrary energy into the simulation."
    },
    {
      heading: "Demos",
      body:
        "The project includes two main demonstration modes. The interactive demo lets the user add liquids of different densities, apply mouse forces, tune parameters, and observe how the fluid responds. The randomized stress test repeatedly injects particles and forces through block drops, grab sweeps, and whirlpool bursts. The stress test is useful for evaluating whether the solver remains stable under aggressive perturbations and for exposing performance bottlenecks as particle count increases."
    },
    {
      heading: "Results",
      body:
        "The simulator achieves plausible layered-fluid behavior, smooth grid-mediated mixing, density-influenced motion, folded interfaces, and visually interesting filaments under strong forcing. Distinct materials remain visible for a while, and large-scale vortical motion can emerge from the interaction modes. However, the simulation does not produce clean long-term re-stratification after strong mixing. The background grid smooths velocity and mass fields during P2G/G2P transfers, so particles of different fluids that share nearby grid nodes effectively exchange averaged momentum. This makes interfaces blur rather than remain sharply separated."
    },
    {
      heading: "Limitations",
      body:
        "The main limitations are weak compressibility, volume loss, numerical diffusion, mouse-force instability, and performance slowdown. The linearized update for J is first-order and not positivity-preserving, so J must be clamped and can still accumulate drift over long simulations. Volume recomputation helps but does not eliminate pressure error. The simple wall treatment uses nodal velocity clipping and particle clamping, so splash behavior near boundaries is resolution-dependent. Finally, because grid transfers smooth material interfaces, subgrid-scale interactions between different fluids are not resolved, limiting sharp density stratification."
    },
    {
      heading: "Takeaway",
      body:
        "The main lesson is that visual realism and physical realism are different goals. Kot’s particle-force-based approach is visually crisp, stylized, and artist-driven. This MPM version is smoother, more continuum-based, and more physically interpretable, but it is also more computationally expensive and less able to preserve sharp layered interfaces after mixing. The project shows that using a physically motivated method does not automatically reproduce stylized visual behavior; the final result depends just as much on numerical diffusion, constitutive modeling, parameter choices, stability limits, and interaction design."
    },
    {
      heading: "Future Work",
      body:
        "Future work could improve incompressibility using a pressure projection or more stable pressure solve, reduce interface diffusion with sharper multi-material coupling, and add explicit buoyancy, surface tension, or cohesion forces to strengthen separation and interfacial behavior. These effects are physically motivated, but in an interactive visual simulation they may still need to be approximated or artistically tuned to produce convincing layered-fluid motion."
    }
  ]
},
  // {
  //   id: "pbd-cloth",
  //   title: "Position-Based Cloth",
  //   date: "Spring 2026",
  //   year: "2026",
  //   category: "simulation",
  //   tags: ["PBD", "cloth", "shape matching"],
  //   image: "assets/projects/pbd-cloth.svg",
  //   featured: false,
  //   description: "A cloth simulation using pin, stretch, drag, and bending constraints.",
  //   summary: "A position-based dynamics cloth solver built around iterative geometric projections for interactive simulation.",
  //   links: [
  //     { label: "Writeup", url: "#" },
  //     { label: "Code", url: "https://github.com/sarahnator/YOUR-REPO" }
  //   ],
  //   sections: [
  //     {
  //       heading: "What it demonstrates",
  //       body: "The simulation compares local geometric constraint projections for pins, triangle shape matching, and bending diamonds."
  //     }
  //   ]
  // },
  // {
  //   id: "inverse-kinodynamics",
  //   title: "Inverse Kinodynamics for Off-Road Robots",
  //   date: "2024–2025",
  //   year: "2025",
  //   category: "ml",
  //   tags: ["robotics", "dynamics", "learning"],
  //   image: "assets/projects/inverse-kinodynamics.svg",
  //   featured: false,
  //   description: "Learning models that map robot state and commands to motion behavior in off-road settings.",
  //   summary: "A research project focused on learned dynamics and transfer learning for high-speed off-road navigation.",
  //   links: [
  //     { label: "Paper", url: "#" }
  //   ],
  //   sections: [
  //     {
  //       heading: "Research question",
  //       body: "How can learned dynamics models generalize across terrain, robots, and operating regimes while remaining useful for planning and control?"
  //     }
  //   ]
  // }

  {
  id: "terrain-aware-dynamics-function-encoders",
  title: "Online Adaptation of Terrain-Aware Dynamics",
  date: "2025",
  year: "2025",
  category: "robotics",
  tags: [
    "robotics",
    "off-road navigation",
    "function encoders",
    "neural ODEs",
    "MPPI",
    "online adaptation"
  ],
  image: "assets/projects/terrain-aware-dynamics.png",
  featured: false,

  description:
    "A terrain-aware dynamics adaptation method for off-road robot planning using function encoders, neural ODE basis functions, and least-squares online coefficient estimation.",

  summary:
    "This work studies how autonomous ground robots can adapt their dynamics models online when driving over previously unseen terrain. The method uses function encoders to learn a set of neural ODE basis functions spanning a family of terrain-dependent robot dynamics. At runtime, the robot estimates terrain-specific coefficients from a small amount of online data using least squares, then uses the adapted model inside an MPPI controller for trajectory rollout prediction. In high-fidelity Unity simulation with a Clearpath Warthog robot, the adapted model improves prediction accuracy and reduces collisions compared with a neural ODE baseline.",

  links: [
    {
      label: "Paper PDF",
      url: "assets/papers/online-adaptation-terrain-aware-dynamics.pdf"
    }
  ],

  media: [
    {
      type: "pdf",
      title: "Paper",
      url: "assets/papers/online-adaptation-terrain-aware-dynamics.pdf"
    }
  ],

  sections: [
    {
      heading: "Problem",
      body:
        "Off-road robots experience large changes in dynamics as terrain changes. A model that works on pavement may fail on mud, gravel, grass, or ice because tire friction, slip, and lateral drift can change dramatically. This is especially important for model-predictive controllers such as MPPI, which rely on accurate forward rollouts to choose safe control actions."
    },
    {
      heading: "Approach",
      body:
        "The method represents terrain-dependent dynamics as a linear combination of learned neural ODE basis functions. Offline, function encoders learn a compact basis spanning the robot's dynamics across multiple terrains. Online, the robot collects a small amount of recent state-action-transition data and solves a least-squares problem to identify coefficients for the current terrain. This avoids retraining or fine-tuning the neural networks during deployment."
    },
    {
      heading: "Function Encoder Dynamics Model",
      body:
        "The learned model approximates the terrain-specific vector field as a weighted sum of basis functions. The basis functions capture reusable patterns of robot motion, while the coefficients specialize the model to a particular terrain. Once the coefficients are estimated, the adapted dynamics model is used as a drop-in forward model inside MPPI rollouts."
    },
    {
      heading: "Simulation and Evaluation",
      body:
        "The approach was evaluated in Phoenix, a Unity-based robotics simulator, using a simulated Clearpath Warthog robot. The terrains were generated by varying tire friction parameters from high-friction pavement-like behavior to low-friction icy behavior. The dataset included odometry, body-frame velocities, angular velocity, and commanded forward and angular velocities collected across multiple terrains."
    },
    {
      heading: "Results",
      body:
        "The function encoder model adapted to unseen terrain from limited online data and produced more accurate predictions than a standard neural ODE baseline. In the navigation experiment on unknown icy terrain, the neural ODE model failed to extrapolate and collided with obstacles, while the function encoder model reached all waypoint goals without collisions in the reported trials."
    },
    {
      heading: "Takeaway",
      body:
        "The key idea is to separate representation learning from online adaptation. The neural basis functions are learned offline, but the terrain-specific coefficients can be estimated quickly online. This makes the method well suited for model-predictive control, where the dynamics model must adapt quickly enough to improve the controller's rollouts."
    }
  ]
},
{
  id: "zero-to-autonomy-real-time-adaptation",
  title: "Zero to Autonomy in Real Time",
  date: "2026",
  year: "2026",
  category: "robotics",
  tags: [
    "robotics",
    "online adaptation",
    "recursive least squares",
    "MAML",
    "function encoders",
    "MPPI",
    "hardware"
  ],
  image: "assets/projects/zero-to-autonomy.png",
  featured: true,

  description:
    "A real-time dynamics adaptation method that combines function encoders with recursive least squares for off-road robot control in changing terrain.",

  summary:
    "Zero to Autonomy in Real Time extends function-encoder-based terrain adaptation from batch coefficient estimation to streaming real-time adaptation. The method treats function encoder coefficients as latent states and updates them with recursive least squares from streaming odometry. This enables the dynamics model to adapt at the same timescale as the MPPI controller, without gradient-based inner-loop updates. I contributed to the recursive least squares and MAML implementations, which were central to comparing closed-form coefficient adaptation against gradient-based meta-learning. The method was evaluated on a Van der Pol system, in a Unity-based off-road simulator, and on a Clearpath Jackal robot navigating real terrain transitions including ice and turf.",

  links: [
    {
      label: "Paper PDF",
      url: "assets/papers/zero-to-autonomy.pdf"
    }
  ],

  media: [
    {
      type: "pdf",
      title: "Paper",
      url: "assets/papers/zero-to-autonomy.pdf"
    }
  ],

  sections: [
    {
      heading: "Problem",
      body:
        "Autonomous robots operating in unstructured environments need dynamics models that can change as quickly as the terrain changes. Abrupt transitions, such as pavement to ice, can destabilize a planner if the model does not adapt in real time. The challenge is to update the model continuously from streaming data while remaining fast enough for model-predictive control."
    },
    {
      heading: "Method",
      body:
        "The method combines function encoders with recursive least squares. A function encoder learns neural basis functions from trajectories across diverse terrains. The current dynamics are represented as a linear combination of these basis functions, and the coefficient vector acts as a compact terrain-specific latent state. Recursive least squares updates this coefficient vector online from each new odometry transition, allowing the model to track changing terrain without retraining or gradient-based fine-tuning."
    },
    {
      heading: "Recursive Least Squares Adaptation",
      body:
        "Instead of repeatedly solving a batch least-squares problem, RLS updates the coefficient estimate and covariance directly as new data arrives. This turns adaptation into a closed-form recursive estimation problem. The coefficients are initialized with zero prior knowledge, then updated using prediction error from streaming state-action transitions. This lets the dynamics model evolve at the same rate as the controller."
    },
    {
      heading: "Comparison to MAML",
      body:
        "The paper compares FE-RLS against a static neural ODE, a batch function encoder baseline, and MAML. MAML represents a standard gradient-based meta-learning approach, but it requires inner-loop gradient updates and enough online samples to make those updates meaningful. In contrast, FE-RLS adapts through recursive coefficient estimation, avoiding backpropagation during deployment. I specifically worked on the recursive least squares and MAML implementations used in this comparison."
    },
    {
      heading: "Simulation Experiments",
      body:
        "In high-fidelity Unity simulation, the robot experienced abrupt terrain transitions between pavement and ice. FE-RLS adapted within a few seconds, produced more accurate MPPI rollouts, and completed navigation tasks in obstacle-rich environments. MAML adapted too slowly under the streaming-data setting, leading to inaccurate rollouts and collisions in the reported experiments."
    },
    {
      heading: "Hardware Experiments",
      body:
        "The method was also tested on a Clearpath Jackal robot using real-world datasets and autonomy experiments across terrains including grass, gym floor, mulch, pavement, turf, and ice. In the ice rink experiment, the Jackal navigated a mixed terrain environment with turf placed over ice while using recursive coefficient updates to adapt its learned dynamics model online."
    },
    {
      heading: "Results",
      body:
        "Across the Van der Pol example, simulation experiments, and hardware evaluation, FE-RLS adapted more quickly and effectively than gradient-based meta-learning baselines. In simulation, it adapted to unknown icy terrain within seconds from zero prior knowledge. On hardware, it maintained lower prediction error than NODE and MAML on trajectories with terrain switches between turf and ice."
    },
    {
      heading: "Takeaway",
      body:
        "The central takeaway is that real-time robot adaptation can be made practical by constraining learning to a low-dimensional coefficient space. Function encoders provide the learned representation, while RLS provides a lightweight recursive update rule. This gives the controller a dynamics model that can adapt continuously from streaming data instead of waiting for batch retraining or expensive gradient updates."
    }
  ]
}
];
