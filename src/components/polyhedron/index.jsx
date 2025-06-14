import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Polyhedron = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Cena
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color('transparent');

        // Câmera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 3;

        // Renderizador
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Geometria + material com sua paleta
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            wireframe: true
        });

        // Aplicar cor em cada face
        const colors = [
            // new THREE.Color('#CDE9FD'),
            new THREE.Color('#6BB1F8'),
            new THREE.Color('#0C68E9'),
            new THREE.Color('#063BA7')
        ];
        const colorAttr = geometry.getAttribute('position');
        const colorArray = [];

        for (let i = 0; i < colorAttr.count; i++) {
            const color = colors[i % colors.length];
            colorArray.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 3));

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let angle = 0;

        // Animação
        const animate = () => {
            angle += 0.02; // controla a velocidade do giro

            // rotação
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.002;

            // pulsar
            const scale = 1 + 0.1 * Math.sin(angle * 0.5);

            mesh.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{ width: '100%', aspectRatio: '1/1' }}
        />
    );
};

export default Polyhedron;
