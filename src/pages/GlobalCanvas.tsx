import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/useStore';
import * as THREE from 'three';

export default function GlobalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mouse, scrollProgress, typingPulse } = useStore();

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(0);
  const pulseRef = useRef(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keep Zustand values synchronized with high-performance animation loop refs
  useEffect(() => {
    if (isMobile) return;
    mouseRef.current.targetX = mouse.x;
    mouseRef.current.targetY = mouse.y;
  }, [mouse, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    scrollRef.current = scrollProgress;
  }, [scrollProgress, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    pulseRef.current += 1.2; // pulse boost on typing
  }, [typingPulse, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Setup WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0b0b08, 1);

    // 2. Setup Scene
    const scene = new THREE.Scene();

    const getFov = () => {
      return window.innerWidth < 768 ? 75 : 60;
    };

    // 3. Setup Perspective Camera
    const camera = new THREE.PerspectiveCamera(
      getFov(),
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.rotation.order = 'YXZ'; // Rotate horizontally first, then vertically locally
    camera.position.set(0, 0, 0);

    // 4. Setup Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffea00, 0.85);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Trackers for memory cleanup
    const hudGeometries: THREE.BufferGeometry[] = [];
    const hudMaterials: THREE.Material[] = [];
    const radarSweeps: THREE.Line[] = [];

    // 5. Create Starfield Background Particles
    const starCount = 1500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Position stars randomly on a large surrounding sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 30 + Math.random() * 20;

      starPositions[i] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 1] = radius * Math.cos(phi);
      starPositions[i + 2] = radius * Math.sin(phi) * Math.cos(theta);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffea00,
      size: 0.05,
      transparent: true,
      opacity: 0.15,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5.1 Perspective Floor Grid (Golden Yellow)
    const gridFloor = new THREE.GridHelper(120, 80, 0xaa8f00, 0xaa7500);
    gridFloor.position.y = -2.2;
    const floorGridMat = gridFloor.material as THREE.LineBasicMaterial;
    floorGridMat.transparent = true;
    floorGridMat.opacity = 0.08;
    scene.add(gridFloor);
    hudGeometries.push(gridFloor.geometry);
    hudMaterials.push(floorGridMat);

    // 5.2 Cylindrical Cyber Blueprint Wall (Wireframe Cage)
    const cylinderGroup = new THREE.Group();
    const cylinderRadius = 12.0;

    // Add horizontal rings stacked vertically
    for (let yOffset = -5.0; yOffset <= 5.0; yOffset += 2.5) {
      const ringGeom = new THREE.TorusGeometry(cylinderRadius, 0.012, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa88100,
        transparent: true,
        opacity: 0.06,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yOffset;
      cylinderGroup.add(ring);
      hudGeometries.push(ringGeom);
      hudMaterials.push(ringMat);
    }

    // Add vertical wirelines around the cylinder circumference
    const numCylinderWires = 24;
    for (let c = 0; c < numCylinderWires; c++) {
      const angle = (c / numCylinderWires) * Math.PI * 2;
      const wirePoints = [
        new THREE.Vector3(-cylinderRadius * Math.sin(angle), -5.5, -cylinderRadius * Math.cos(angle)),
        new THREE.Vector3(-cylinderRadius * Math.sin(angle), 5.5, -cylinderRadius * Math.cos(angle))
      ];
      const wireGeom = new THREE.BufferGeometry().setFromPoints(wirePoints);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0xa88100,
        transparent: true,
        opacity: 0.05,
      });
      const wireLine = new THREE.Line(wireGeom, wireMat);
      cylinderGroup.add(wireLine);
      hudGeometries.push(wireGeom);
      hudMaterials.push(wireMat);
    }
    scene.add(cylinderGroup);

    // 6. Setup Section Groups at 72° circular intervals
    const numSections = 5;
    const sectionRadius = 7.0;
    const sectionGroups: THREE.Group[] = [];

    for (let i = 0; i < numSections; i++) {
      const group = new THREE.Group();
      const angle = i * ((Math.PI * 2) / numSections);

      // Circular layout relative to the camera at center (0,0,0)
      group.position.set(
        -sectionRadius * Math.sin(angle),
        0,
        -sectionRadius * Math.cos(angle)
      );

      // Make group look directly at origin (camera)
      group.lookAt(0, 0, 0);

      scene.add(group);
      sectionGroups.push(group);
    }

    // 6.1 Setup Section HUD Panels (Radar screens & blueprint frames at radius 8.5)
    const hudPanelRadius = 8.5;
    for (let i = 0; i < numSections; i++) {
      const hudGroup = new THREE.Group();
      const angle = i * ((Math.PI * 2) / numSections);

      hudGroup.position.set(
        -hudPanelRadius * Math.sin(angle),
        0,
        -hudPanelRadius * Math.cos(angle)
      );
      hudGroup.lookAt(0, 0, 0);

      // 6.1.1 Outer boundary grid rectangle
      const rectWidth = 6.2;
      const rectHeight = 4.2;
      const rectPoints = [
        new THREE.Vector3(-rectWidth / 2, -rectHeight / 2, 0),
        new THREE.Vector3(rectWidth / 2, -rectHeight / 2, 0),
        new THREE.Vector3(rectWidth / 2, rectHeight / 2, 0),
        new THREE.Vector3(-rectWidth / 2, rectHeight / 2, 0),
        new THREE.Vector3(-rectWidth / 2, -rectHeight / 2, 0),
      ];
      const rectGeom = new THREE.BufferGeometry().setFromPoints(rectPoints);
      const rectMat = new THREE.LineBasicMaterial({
        color: 0xa88100,
        transparent: true,
        opacity: 0.05,
      });
      const rectLine = new THREE.Line(rectGeom, rectMat);
      hudGroup.add(rectLine);
      hudGeometries.push(rectGeom);
      hudMaterials.push(rectMat);

      // 6.1.2 Inner concentric grid circular tracks (like radar scope)
      const ringGeom1 = new THREE.TorusGeometry(0.8, 0.008, 4, 32);
      const ringGeom2 = new THREE.TorusGeometry(1.5, 0.008, 4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffea00,
        transparent: true,
        opacity: 0.06,
      });
      const hudRing1 = new THREE.Mesh(ringGeom1, ringMat);
      const hudRing2 = new THREE.Mesh(ringGeom2, ringMat);
      hudGroup.add(hudRing1, hudRing2);
      hudGeometries.push(ringGeom1, ringGeom2);
      hudMaterials.push(ringMat);

      // 6.1.3 Horizontal/Vertical crosshair coordinate ticks
      const crosshairPoints = [
        new THREE.Vector3(-2.8, 0, 0),
        new THREE.Vector3(2.8, 0, 0),
        new THREE.Vector3(0, -1.8, 0),
        new THREE.Vector3(0, 1.8, 0),
      ];
      const crosshairGeomH = new THREE.BufferGeometry().setFromPoints([crosshairPoints[0], crosshairPoints[1]]);
      const crosshairGeomV = new THREE.BufferGeometry().setFromPoints([crosshairPoints[2], crosshairPoints[3]]);
      const crosshairMat = new THREE.LineBasicMaterial({
        color: 0xa88100,
        transparent: true,
        opacity: 0.05,
      });
      const crossLineH = new THREE.Line(crosshairGeomH, crosshairMat);
      const crossLineV = new THREE.Line(crosshairGeomV, crosshairMat);
      hudGroup.add(crossLineH, crossLineV);
      hudGeometries.push(crosshairGeomH, crosshairGeomV);
      hudMaterials.push(crosshairMat);

      // 6.1.4 Holographic radar sweep indicator line
      const sweepPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.5, 0)];
      const sweepGeom = new THREE.BufferGeometry().setFromPoints(sweepPoints);
      const sweepMat = new THREE.LineBasicMaterial({
        color: 0xffea00,
        transparent: true,
        opacity: 0.15,
      });
      const sweepLine = new THREE.Line(sweepGeom, sweepMat);
      hudGroup.add(sweepLine);
      radarSweeps.push(sweepLine);
      hudGeometries.push(sweepGeom);
      hudMaterials.push(sweepMat);

      scene.add(hudGroup);
    }

    // --- SECTION 0: HERO (Torus Knot Point Cloud + Wireframe Mesh) ---
    const heroKnotGeom = new THREE.TorusKnotGeometry(1.1, 0.32, 160, 16);
    const heroPointsMat = new THREE.PointsMaterial({
      color: 0xffea00,
      size: 0.035,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });
    const heroKnotPoints = new THREE.Points(heroKnotGeom, heroPointsMat);

    const heroWireframeMat = new THREE.MeshBasicMaterial({
      color: 0xa88100,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const heroKnotMesh = new THREE.Mesh(heroKnotGeom, heroWireframeMat);

    sectionGroups[0].add(heroKnotPoints);
    sectionGroups[0].add(heroKnotMesh);

    // --- SECTION 1: ROSTER (Network Constellation Matrix) ---
    const rosterNodeCount = 70;
    const rosterNodeGeom = new THREE.BufferGeometry();
    const rosterNodePositions = new Float32Array(rosterNodeCount * 3);
    const rosterNodeSpeeds: number[] = [];
    const rosterNodeOffsets: number[] = [];

    for (let i = 0; i < rosterNodeCount * 3; i += 3) {
      rosterNodePositions[i] = (Math.random() - 0.5) * 4.0;
      rosterNodePositions[i + 1] = (Math.random() - 0.5) * 3.5;
      rosterNodePositions[i + 2] = (Math.random() - 0.5) * 3.0;

      rosterNodeSpeeds.push(0.2 + Math.random() * 0.4);
      rosterNodeOffsets.push(Math.random() * 100);
    }

    rosterNodeGeom.setAttribute('position', new THREE.BufferAttribute(rosterNodePositions, 3));
    const rosterNodeMat = new THREE.PointsMaterial({
      color: 0xffea00,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });
    const rosterNodes = new THREE.Points(rosterNodeGeom, rosterNodeMat);
    sectionGroups[1].add(rosterNodes);

    // Dynamic line segments geometry for node connections
    const maxConnections = 150;
    const rosterLineGeom = new THREE.BufferGeometry();
    const rosterLinePositions = new Float32Array(maxConnections * 2 * 3);
    rosterLineGeom.setAttribute('position', new THREE.BufferAttribute(rosterLinePositions, 3));

    const rosterLineMat = new THREE.LineBasicMaterial({
      color: 0xa88100,
      transparent: true,
      opacity: 0.1,
    });
    const rosterLines = new THREE.LineSegments(rosterLineGeom, rosterLineMat);
    sectionGroups[1].add(rosterLines);

    // --- SECTION 2: PROJECTS (Concentric Portal Rings Tunnel) ---
    const numPortalRings = 5;
    const portalRings: THREE.Mesh[] = [];
    const ringParent = new THREE.Group();

    for (let r = 0; r < numPortalRings; r++) {
      const ringGeom = new THREE.TorusGeometry(1.2, 0.022, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0xffea00 : 0xffc107,
        transparent: true,
        opacity: 0.2 - r * 0.02,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.z = -1.5 + r * 0.75;
      ringParent.add(ringMesh);
      portalRings.push(ringMesh);
    }
    sectionGroups[2].add(ringParent);

    // --- SECTION 3: ABOUT (Undulating Topography Wireframe Floor) ---
    const terrainGeom = new THREE.PlaneGeometry(5, 5, 20, 20);
    const terrainMat = new THREE.MeshBasicMaterial({
      color: 0xa88100,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -1.1;
    sectionGroups[3].add(terrainMesh);

    const terrainPosAttribute = terrainGeom.attributes.position;
    const terrainOriginalZ = new Float32Array(terrainPosAttribute.count);
    for (let i = 0; i < terrainPosAttribute.count; i++) {
      terrainOriginalZ[i] = terrainPosAttribute.getZ(i);
    }

    // --- SECTION 4: CONTACT (Data Swarm with typing pulse feedback) ---
    const packetCount = 140;
    const packetGeom = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    const packetVelocities: THREE.Vector3[] = [];

    for (let i = 0; i < packetCount; i++) {
      const idx = i * 3;
      packetPositions[idx] = (Math.random() - 0.5) * 3;
      packetPositions[idx + 1] = (Math.random() - 0.5) * 3;
      packetPositions[idx + 2] = (Math.random() - 0.5) * 3;

      packetVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008
        )
      );
    }

    packetGeom.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0xffea00,
      size: 0.045,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });
    const packetSwarm = new THREE.Points(packetGeom, packetMat);
    sectionGroups[4].add(packetSwarm);

    // 7. Animation Loop tick
    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      camera.fov = getFov();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const tick = () => {
      time += 0.015;

      // Smooth mouse coordinates lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scroll = scrollRef.current;

      // Decay typing pulse scale factor
      pulseRef.current *= 0.93;
      const pulse = pulseRef.current;

      // Rotate camera around Y axis to target section angle + mouse offsets
      const targetCamY = scroll * ((Math.PI * 2) / numSections);
      camera.rotation.y = targetCamY + mx * 0.14;
      camera.rotation.x = my * 0.12;

      // Rotate background stars slowly
      starField.rotation.y = time * 0.02;

      // --- HUD ANIMATIONS ---
      radarSweeps.forEach((sweep, idx) => {
        const sweepSpeed = 1.2 * (idx % 2 === 0 ? 1 : -1);
        sweep.rotation.z = time * sweepSpeed;
      });

      // --- SECTION 0 ANIMATIONS ---
      heroKnotPoints.rotation.y = time * 0.35;
      heroKnotPoints.rotation.z = time * 0.18;
      heroKnotMesh.rotation.y = time * 0.35;
      heroKnotMesh.rotation.z = time * 0.18;

      // --- SECTION 1 ANIMATIONS ---
      const rosterPos = rosterNodes.geometry.attributes.position.array as Float32Array;
      let lineIdx = 0;
      const linePos = rosterLines.geometry.attributes.position.array as Float32Array;

      // Gently drift roster nodes
      for (let i = 0; i < rosterNodeCount; i++) {
        const idx = i * 3;
        const speed = rosterNodeSpeeds[i];
        const offset = rosterNodeOffsets[i];
        rosterPos[idx + 1] += Math.sin(time * speed + offset) * 0.003;
      }
      rosterNodes.geometry.attributes.position.needsUpdate = true;

      // Draw vector lines between close roster nodes
      for (let i = 0; i < rosterNodeCount; i++) {
        const ix = i * 3;
        const px = rosterPos[ix];
        const py = rosterPos[ix + 1];
        const pz = rosterPos[ix + 2];

        for (let j = i + 1; j < rosterNodeCount; j++) {
          const jx = j * 3;
          const qx = rosterPos[jx];
          const qy = rosterPos[jx + 1];
          const qz = rosterPos[jx + 2];

          const dx = px - qx;
          const dy = py - qy;
          const dz = pz - qz;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 0.8 && lineIdx < maxConnections) {
            const lIdx = lineIdx * 6;
            linePos[lIdx] = px;
            linePos[lIdx + 1] = py;
            linePos[lIdx + 2] = pz;
            linePos[lIdx + 3] = qx;
            linePos[lIdx + 4] = qy;
            linePos[lIdx + 5] = qz;

            lineIdx++;
          }
        }
      }
      rosterLines.geometry.setDrawRange(0, lineIdx * 2);
      rosterLines.geometry.attributes.position.needsUpdate = true;

      // --- SECTION 2 ANIMATIONS ---
      portalRings.forEach((ring, idx) => {
        const ringSpeed = (idx + 1) * 0.2 * (idx % 2 === 0 ? 1 : -1);
        ring.rotation.z = time * ringSpeed;
        const scaleVal = 1.0 + Math.sin(time * 2.0 + idx) * 0.05;
        ring.scale.set(scaleVal, scaleVal, scaleVal);
      });

      // --- SECTION 3 ANIMATIONS ---
      const terrainPositions = terrainMesh.geometry.attributes.position;
      for (let i = 0; i < terrainPositions.count; i++) {
        const vx = terrainPositions.getX(i);
        const vy = terrainPositions.getY(i);
        const zVal = Math.sin(vx * 1.5 + time) * Math.cos(vy * 1.5 + time) * 0.45;
        terrainPositions.setZ(i, zVal);
      }
      terrainPositions.needsUpdate = true;

      // --- SECTION 4 ANIMATIONS ---
      const packetPos = packetSwarm.geometry.attributes.position.array as Float32Array;
      const typingVelocityMultiplier = 1.0 + pulse * 14.0;
      const packetScale = 1.0 + pulse * 0.18;
      packetSwarm.scale.set(packetScale, packetScale, packetScale);

      for (let i = 0; i < packetCount; i++) {
        const idx = i * 3;
        const vel = packetVelocities[i];

        packetPos[idx] += vel.x * typingVelocityMultiplier;
        packetPos[idx + 1] += vel.y * typingVelocityMultiplier;
        packetPos[idx + 2] += vel.z * typingVelocityMultiplier;

        const limit = 2.0;
        if (packetPos[idx] > limit) packetPos[idx] = -limit;
        if (packetPos[idx] < -limit) packetPos[idx] = limit;
        if (packetPos[idx + 1] > limit) packetPos[idx + 1] = -limit;
        if (packetPos[idx + 1] < -limit) packetPos[idx + 1] = limit;
        if (packetPos[idx + 2] > limit) packetPos[idx + 2] = -limit;
        if (packetPos[idx + 2] < -limit) packetPos[idx + 2] = limit;
      }
      packetSwarm.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 8. Clean up resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      heroKnotGeom.dispose();
      heroPointsMat.dispose();
      heroWireframeMat.dispose();
      rosterNodeGeom.dispose();
      rosterNodeMat.dispose();
      rosterLineGeom.dispose();
      rosterLineMat.dispose();
      terrainGeom.dispose();
      terrainMat.dispose();
      packetGeom.dispose();
      packetMat.dispose();

      portalRings.forEach((ring) => {
        ring.geometry.dispose();
        if (Array.isArray(ring.material)) {
          ring.material.forEach((m) => m.dispose());
        } else {
          ring.material.dispose();
        }
      });

      hudGeometries.forEach((g) => g.dispose());
      hudMaterials.forEach((m) => m.dispose());
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div
        id="global-canvas-layer"
        className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#0B0B08]"
      />
    );
  }

  return (
    <canvas
      id="global-canvas-layer"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#0B0B08]"
    />
  );
}
