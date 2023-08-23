
type Material = (ctx: CanvasRenderingContext2D, y: number) => void;

type ImageDataMaterial = (imageData: ImageData) => void;

function imageDataMaterial(f: ImageDataMaterial): Material {
  return function(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    f(imageData);
    ctx.putImageData(imageData, 0, 0);
  };
}

// [nx, ny, d, feature color]
type Feature = (
  dx: number,
  dy: number,
  z: number,
  c: number,
) => [number, number, number, number];
type FeatureFactory = (r: number, z: number) => Feature;


// x, y, scale
type Distribution = (size: number) => readonly [number, number, number];

function randomDistributionFactory(
  scaleRandomness: number,
  pow: number,
): Distribution {
  return function(size: number): [number, number, number] {
    return [
      Math.random() * size,
      Math.random() * size,
      (1 - scaleRandomness) + scaleRandomness * Math.pow(Math.random(), pow),
    ];
  }
}

// x, y, scale, steps
type Cluster = readonly [number, number, number, number];

function clusteredDistributionFactory(
  minDistance: number, 
  dDistance: number, 
  minChildren: number,
  dChildren: number,
  scaleRandomness: number,
  steps: number,
): Distribution {
  const clusters: Cluster[] = [];
  return function(size: number) {
    if (!clusters.length) {
      clusters.push([
        Math.random() * size,
        Math.random() * size,
        (1 - scaleRandomness) + Math.random() * scaleRandomness,
        steps,
      ]);
    }
    const cluster = clusters.shift();
    const [x, y, scale, step] = cluster;
    // add in more
    if (step) {
      clusters.push(...new Array(minChildren + Math.random() * dChildren | 0).fill(0).map<[number, number, number, number]>(() => {
        const a = Math.random() * Math.PI * 2;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const d = minDistance + Math.random() * dDistance;
        return [
          x + cos * d,
          y + sin * d,
          scale * ((1 - scaleRandomness) + scaleRandomness * Math.random()),
          step - 1,
        ];
      }));  
    }
    return cluster as any;
  }
}

function evenDistributionFactory(d: number): Distribution {
  let x = 0;
  let y = 0;
  return function (size: number) {
    const ox = x;
    const oy = y;
    x += d * size/MATERIAL_TEXTURE_DIMENSION;
    if (x > size - d) {
      x = 0;
      y += d;
    }
    return [
      ox, 
      oy,
      1,
      ];
  };
}

function featureMaterial(
  f: FeatureFactory,
  baseDimension: number,
  quantity: number,
  distribution: Distribution,
): Material {
  return function(ctx: CanvasRenderingContext2D, y: number) {
    const imageData = ctx.getImageData(0, y, MATERIAL_TEXTURE_DIMENSION, MATERIAL_TEXTURE_DIMENSION);
    const z = imageData.data[2];

    for(let i=0; i<quantity; i++) {
      const [x, y, scale] = distribution(MATERIAL_TEXTURE_DIMENSION);
      const dimension = baseDimension * scale;
      const r = dimension/2;
      const feature = f(r, z);

      for (let dx = -1; dx < dimension + 1; dx++) {
        const px = x + dx + MATERIAL_TEXTURE_DIMENSION | 0;
        for (let dy = -1; dy < dimension + 1; dy++) {
          const py = y + dy + MATERIAL_TEXTURE_DIMENSION | 0;
          let index = ((py % MATERIAL_TEXTURE_DIMENSION) * MATERIAL_TEXTURE_DIMENSION
            + (px % MATERIAL_TEXTURE_DIMENSION)) * 4;
          const ox = dx - r + .5;
          const oy = dy - r + .5;
          const z = imageData.data[index + 2];
          const c = imageData.data[index + 3];
          const w = feature(ox, oy, c, z);
          if (w) {
            imageData.data.set(w, index);
          }  
        }
      }
    }
    ctx.putImageData(imageData, 0, y);
  };
};