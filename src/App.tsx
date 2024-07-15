import { useState, useEffect } from 'react';
import './App.css';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Cylinder, Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { MeshBasicMaterial, TextureLoader } from 'three';
import PinkBunny from './assets/PinkBunny.png';
import Barcelona from './assets/Barcelona.png';
import WinniePooh from './assets/WinniePooh.png';
import Principito from './assets/Principito.png';



interface Props {
  position: [number, number, number];
  scale: number;
  onClick: () => void;
  imageUrl: any;  // Use imageUrl instead of color

}

function Cake({ position, scale, onClick ,imageUrl }: Props) {
  const texture = useLoader(TextureLoader, imageUrl);  // Load the image texture

  return (
    <Cylinder
      position={position}
      scale={[scale, scale, scale]}  // Apply scale transformation
      onClick={onClick}
      args={[1, 1, 2, 32]}  // Cylinder dimensions and segment count
      material={new MeshBasicMaterial({ map: Array.isArray(texture) ? texture[0] : texture })}  // Apply the texture to the material

    />
  );
}

type CakeType = {
  id: number;
  name: string;
  position: [number, number, number];
  scale: number;  // Added scale to CakeType
  color: string;
  imageUrl: any;  // Optional imageUrl property
};

const originalCakes: CakeType[] = [
  { id: 1, name: 'Chocolate Cake', position: [2, 0, 0], scale: 1, color: '#8B4513' , imageUrl: PinkBunny},
  { id: 2, name: 'Vanilla Cake', position: [-2, 0, 0], scale: 1, color: '#F3E5AB' , imageUrl: Barcelona},
  { id: 3, name: 'Strawberry Cake', position: [0, 0, 2], scale: 1, color: '#FFC0CB' , imageUrl: WinniePooh},
  { id: 4, name: 'Lemon Cake', position: [0, 0, -2], scale: 1, color: '#FFFACD' , imageUrl: Principito},
];

type CameraFocusProps = {
  selectedCake: CakeType | null;  // Use your CakeType definition
};

function CameraFocus({ selectedCake }: CameraFocusProps) {
  const { camera, scene } = useThree();

  useEffect(() => {
    if (selectedCake) {
      camera.position.x = selectedCake.position[0];
      camera.position.y = selectedCake.position[1] + 5;
      camera.position.z = selectedCake.position[2] + 5;
      camera.lookAt(selectedCake.position[0], selectedCake.position[1], selectedCake.position[2]);
      camera.up.set(0, 5, 0);
      camera.updateMatrixWorld();
      scene.updateMatrixWorld();
    }
  }, [selectedCake, camera, scene]);

  return null;
}

function App() {
  const [cakes, setCakes] = useState<CakeType[]>(originalCakes);
  const [selectedCake, setSelectedCake] = useState<CakeType | null>(null);

  const handleCakeClick = (cake: CakeType) => {
    const newCakes = originalCakes.map(c => {
      return c.id === cake.id ? { ...c, scale: 1.5} : { ...c, scale: 1 };
    });
    setCakes(newCakes);
    setSelectedCake(cake);
  };

  return (
    <div id="canvas-container">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {selectedCake && (
          <Text
            position={[0, 2, 0]} // Adjust position
            color="black" // Text color
            fontSize={0.5} // Font size
            maxWidth={200} // Maximum width
            lineHeight={1} // Line height
            letterSpacing={0.02} // Letter spacing
            textAlign={'center'} // Text alignment
            anchorX="center" // Horizontal anchor
            anchorY="middle" // Vertical anchor
          >
            {selectedCake.name}
          </Text>
        )}
        {cakes.map((cake) => (
          <Cake
            key={cake.id}
            position={cake.position}
            scale={cake.scale}
            onClick={() => handleCakeClick(cake)}
            imageUrl={cake.imageUrl}
          />
        ))}
        <OrbitControls />
        <CameraFocus selectedCake={selectedCake} />
      </Canvas>
    </div>
  );
}

export default App;
