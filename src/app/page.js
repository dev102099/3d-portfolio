"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import {
  Cloud,
  Clouds,
  OrbitControls,
  Preload,
  ScrollControls,
  Stars,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import OceanSurface from "@/components/Water";
import * as THREE from "three";
import GoldenParticles from "@/components/GoldenParticles";
import FireRing from "@/components/FireRing";
import StoneSlab from "@/components/StoneSlab";
import SceneNavigation from "@/components/SceneNav";
import ZoomButtons from "@/components/ZoomButtons";
import ZoomHandler from "@/components/ZoomHandler";
import ProjectHotspot from "@/components/Hotspot";
import LoaderOverlay from "@/components/LoaderOverlay";
import Welcome from "@/components/Welcome";

const MovingSphere = ({ meshRef, lightRef }) => {
  useFrame((state) => {
    if (!meshRef.current || !lightRef.current) return;

    const distance = 2.5;

    const vFOV = THREE.MathUtils.degToRad(state.camera.fov);
    const height = 2 * Math.tan(vFOV / 2) * distance;
    const width = height * state.camera.aspect;

    const x = (state.pointer.x * width) / 2;
    const y = (state.pointer.y * height) / 2;

    const target = new THREE.Vector3(x, y, -distance);

    target.applyMatrix4(state.camera.matrixWorld);

    meshRef.current.position.copy(target);
    lightRef.current.position.copy(target);
  });

  return null;
};

export default function RealNightOcean() {
  const glowRef = useRef();
  const lightRef = useRef();
  const [zoom, setZoom] = useState(1);
  const [intro, setIntro] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <div className="relative h-full w-full">
        <LoaderOverlay isReady={isReady} />
        <ZoomButtons setZoom={setZoom} zoom={zoom} />
        <Canvas
          camera={{ position: [50, 5, 0], fov: 55, far: 20000 }}
          onCreated={({ gl, scene, camera }) => {
            // Force a compile of all shaders immediately
            gl.compile(scene, camera);
            // Tell React we are ready to show the scene
            setIsReady(true);
          }}
        >
          <OrbitControls target={[0, 0, -50]} />
          <Suspense fallback={null}>
            {/*<Welcome scroll={scroll} setScroll={setScroll} />*/}
            <ZoomHandler targetZoom={zoom} />
            {/*scroll && (
              <ScrollControls pages={2}>
                <SceneNavigation active={scroll} />
              </ScrollControls>
            )*/}
            <ambientLight intensity={10} />
            <Clouds frustumCulled={false}>
              <Cloud
                segments={45}
                opacity={0.05}
                scale={300}
                speed={0.5}
                growth={2}
                color="white"
              />
            </Clouds>
            <GoldenParticles count={4000} />
            <FireRing position={[50, -11, 0]} scale={6} />
            <FireRing position={[-50, -11, 0]} scale={6} />
            <FireRing position={[-50, -11, -100]} scale={6} />
            <FireRing position={[50, -11, -100]} scale={6} />
            <FireRing position={[0, -11, -50]} scale={6} />
            {/* 3. Movement Controller */}

            {/* landing */}
            <StoneSlab
              rotation={[Math.PI / 2, -1.57, 0]}
              position={[50, 0, 0]}
              normalValue={[4, 4]}
              label={"Hi"}
              roughness={0.5}
              model={"textures/model/landing/landing.glb"}
              children={
                <ProjectHotspot
                  name={"Resume"}
                  args={[1.7, 0.3, 0.3]}
                  position={[-1.35, 0, 0.2]}
                  resume={true}
                  url={
                    "https://drive.google.com/file/d/1rFvyxywAr-i1PfCLCDlR73kF-AKEHsMU/view?usp=sharing"
                  }
                />
              }
              meshName={"low_landing"}
              normal={"textures/model/landing/final_normal_landing.exr"}
              color={"textures/model/landing/final_color_landing.exr"}
            />
            {/* workex */}
            <StoneSlab
              rotation={[Math.PI / 2, -1.57, 0]}
              position={[-50, 0, 0]}
              normalValue={[4, 4]}
              roughness={0.5}
              model={"textures/model/work/workEx.glb"}
              meshName={"low_work"}
              normal={"textures/model/work/normal_work.exr"}
              color={"textures/model/work/color_work.exr"}
            />
            {/* project */}
            <StoneSlab
              rotation={[Math.PI / 2, -1.57, 0]}
              normalValue={[4, 4]}
              children={
                <>
                  <ProjectHotspot
                    name="AI Mock Interview Platform"
                    url="https://ai-mock-interview-platform-z5b7.vercel.app"
                    args={[1.7, 0.2, 0.3]}
                  />
                  <ProjectHotspot
                    name="AI Document Summarizer"
                    url="https://ai-document-summary.onrender.com"
                    position={[-0.4, 0, 0.3]}
                    args={[1.7, 0.2, 0.3]}
                  />
                  <ProjectHotspot
                    name="BrickByBrick - Property Marketplace"
                    url="http://brickbybrick-a-real-estate-website-1.onrender.com"
                    position={[0.27, 0, 0.3]}
                    args={[1.7, 0.2, 0.3]}
                  />
                </>
              }
              position={[-50, 0, -100]}
              model={"textures/model/projects/projects-new.glb"}
              meshName={"low_project"}
              roughness={0.5}
              normal={"textures/model/projects/normal_project.001.exr"}
              color={"textures/model/projects/ao_project_final.exr"}
            />
            {/* skills */}
            <StoneSlab
              rotation={[Math.PI / 2, -1.57, 0]}
              position={[50, 0, -100]}
              normalValue={[4, 4]}
              roughness={0.5}
              model={"textures/model/skills/skills-3.glb"}
              meshName={"Cube002"}
              normal={"textures/model/skills/normal_skills.exr"}
              color={"textures/model/skills/color_skills.exr"}
            />
            {/* contact */}
            <StoneSlab
              rotation={[Math.PI / 2, -1.57, 0]}
              position={[0, 0, -50]}
              normalValue={[2, 2]}
              roughness={2}
              model={"textures/model/contact/Contact.glb"}
              meshName={"low_conatct"}
              normal={"textures/model/contact/final_normal_contact.png"}
              color={"textures/model/contact/final_color_contact.jpg"}
              children={
                <>
                  <ProjectHotspot
                    position={[-0.3, 0.1, 0.1]}
                    args={[1.7, 0.2, 0.3]}
                    name={"devparpyani@gmail.com"}
                    img={"/textures/model/contact/communication.png"}
                    contact={true}
                  />
                  <ProjectHotspot
                    position={[-0.06, 0, 0]}
                    args={[1.9, 0.2, 0.3]}
                    name={"Github"}
                    img={"/textures/model/contact/github-sign.png"}
                    url={"http://github.com/dev102099"}
                    contact={true}
                  />
                  <ProjectHotspot
                    position={[0.25, 0, 0.2]}
                    args={[1.5, 0.2, 0.3]}
                    name={"+91 9302769377"}
                    img={"/textures/model/contact/call.png"}
                    contact={true}
                  />
                  <ProjectHotspot
                    position={[0.59, 0, 0]}
                    args={[1.9, 0.3, 0.3]}
                    name={"LinkedIn"}
                    img={"/textures/model/contact/linkedin.png"}
                    url={"http://www.linkedin.com/in/dev-p-42449822a"}
                    contact={true}
                  />
                  <ProjectHotspot
                    position={[1.48, 0, 0]}
                    args={[1, 0.2, 0.3]}
                    name={"Gwalior, Madhya Pradesh, India"}
                    img={"/textures/model/contact/maps-and-flags.png"}
                    contact={true}
                  />
                </>
              }
            />
            {/* 4. The Glowing Object Group */}
            {scroll && (
              <>
                {" "}
                <MovingSphere meshRef={glowRef} lightRef={lightRef} />
                <group>
                  <mesh ref={glowRef}>
                    <sphereGeometry args={[0.03, 32, 32]} />

                    <meshStandardMaterial
                      emissive="white"
                      emissiveIntensity={4}
                      toneMapped={false}
                    />
                  </mesh>

                  <pointLight
                    ref={lightRef}
                    distance={10}
                    decay={2}
                    color="white"
                    intensity={15}
                  />
                </group>
              </>
            )}
            <OceanSurface />
            <Stars
              radius={5000}
              depth={500}
              count={5000}
              factor={1}
              saturation={10}
              fade
              speed={1}
            />

            {/* 5. Post Processing - The Safe Configuration */}
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom luminanceThreshold={1} mipmapBlur={true} intensity={1.0} />
            </EffectComposer>
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
