import * as THREE from 'three';
import { useThreeRefs } from './useThreeRefs';

export interface LogoMesh extends THREE.Mesh {
  original_pos: THREE.Vector3;
  original_rot: THREE.Euler;
}
export interface Sphere extends THREE.Mesh {
  target_pos: THREE.Vector3;
}
export interface LogoGroup extends THREE.Group {
  original_rot?: THREE.Euler;
}

export interface IUseModelsParams{
  refs: ReturnType<typeof useThreeRefs>;
};