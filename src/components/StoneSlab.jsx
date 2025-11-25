import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { EXRLoader } from "three-stdlib";
import * as THREE from "three";
import { useMemo } from "react";

const StoneSlab = ({
  position,
  rotation,
  model,
  normal,
  color,
  meshName,
  children,
  normalValue,
  roughness,
}) => {
  const { nodes } = useGLTF(model);

  const isEXR = normal.endsWith(".exr");

  const SelectedLoader = isEXR ? EXRLoader : THREE.TextureLoader;

  const [normalMap, colorMap] = useLoader(SelectedLoader, [normal, color]);

  useMemo(() => {
    if (isEXR) {
      normalMap.flipY = true;
      colorMap.flipY = true;
    } else {
      normalMap.flipY = false;
      colorMap.flipY = false;
    }

    if (isEXR) {
      normalMap.colorSpace = THREE.NoColorSpace;
      colorMap.colorSpace = THREE.NoColorSpace;
    } else {
      normalMap.colorSpace = THREE.NoColorSpace;
      colorMap.colorSpace = THREE.SRGBColorSpace;
    }

    normalMap.needsUpdate = true;
    colorMap.needsUpdate = true;
  }, [normalMap, colorMap, isEXR]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={nodes[meshName]?.geometry}>
        <meshStandardMaterial
          normalMap={normalMap}
          map={colorMap}
          side={THREE.DoubleSide}
          roughness={roughness}
          normalScale={normalValue}
        />
      </mesh>
      {children}
    </group>
  );
};

export default StoneSlab;
