---
title: "Light Field Study No. 1–12"
description: "Twelve large-format archival prints derived from a real-time volumetric light simulation. Each piece captures a single moment from a 24-hour sky cycle seeded by geographical coordinate and calendar date."
stack: ["GLSL", "WebGL", "Blender", "Python", "Photoshop"]
date: 2025-11-03
featured: true
roles: ["artist"]
liveUrl: "https://lightfield.matiasbatista.dev"
coverImage: "/images/project-lightfield.svg"
---

## Overview

Light Field Study is a series of twelve large-format archival prints (100×70 cm) generated from a custom volumetric light simulation written in GLSL. Each print captures a single moment — a freeze of a 24-hour atmospheric light cycle determined by a real geographical coordinate and a specific calendar date.

## Process

The simulation models atmospheric scattering, volumetric cloud density, and directional sun position using fractional Brownian motion for the cloud layer and a Rayleigh/Mie scattering approximation for the sky gradient. It runs in real time at 60 fps in the browser, accumulating path-traced samples over several seconds before the final capture frame is extracted at print resolution.

Study 07 (Montevideo, June solstice, 06:14 am) anchors the series. That particular combination of low sun angle, cloud density, and latitude produces a quality of light that a photograph could catch but never plan. The algorithm found it without being asked.

## The Work

Each study is identified by a coordinate pair and a time stamp — the work's DNA. No two studies share the same seed. The prints are not reproductions of a photograph; they are outputs of a deterministic process that no human hand directly shaped.

The simulation link above shows the live system. Click anywhere on the sky to freeze and download the current frame at print resolution. What you capture is yours.

## Exhibition

Studies 03, 07, and 11 shown at Espacio de Arte Contemporáneo, Montevideo, November 2025. Full series available as a limited archival print edition, hand-numbered and signed.

## Technical Notes

The simulation uses the WebGL 2.0 rendering pipeline with floating-point render targets for accuracy in the accumulation buffer. A Python script handles the coordinate-to-parameter mapping, producing the seed pair (sun vector, cloud density seed) for each study in the series from a CSV of coordinates and dates gathered over twelve months of location scouting.
