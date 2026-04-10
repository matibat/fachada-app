---
title: "Generative Terrain System"
description: "Procedurally generated 3D landscapes rendered in real-time using custom GLSL shaders and WebGL. Each seed produces a unique, explorable world."
stack: ["Three.js", "GLSL", "WebGL", "JavaScript"]
date: 2026-02-14
featured: true
roles: ["artist"]
liveUrl: "https://terrain.sorakenji.dev"
githubUrl: "https://github.com/sorakenji/generative-terrain"
coverImage: "/images/project-terrain.svg"
---

## Overview

A real-time generative terrain system that produces unique 3D landscapes from a seed value. Built entirely on WebGL with custom vertex and fragment shaders — no game engine, no physics library, just raw geometry and light.

## Challenge

Achieving enough visual complexity to feel "alive" while maintaining 60fps in the browser. The terrain had to feel handmade, not algorithmic.

## Implementation

- Domain-warped fractional Brownian motion for terrain height maps
- Custom atmospheric scattering shader for sky and fog
- Procedural colour grading based on altitude and slope
- Seed-deterministic generation so any world can be shared via URL fragment
