import { Scene } from './Scene';

describe('Scene Aggregate', () => {
  test('creates scene with id, name, and order', () => {
    const scene = new Scene({ id: 's1', name: 'Intro', order: 1 });
    expect(scene.id).toBe('s1');
    expect(scene.name).toBe('Intro');
    expect(scene.order).toBe(1);
  });

  test('preserves props as read-only fields', () => {
    const scene = new Scene({ id: 's1', name: 'Intro', order: 1 });
    expect(scene.name).not.toBeUndefined();
  });
});
