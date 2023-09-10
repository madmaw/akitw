///<reference path="../flags.ts"/>
///<reference path="./hax.ts"/>

// avoid white space ' ' = 32 so we don't strip it later and \' so we don't have to escape it
const UNPACK_STARTING_CHAR_CODE = 40;
const UNPACK_ALLOWABLE_OVERFLOW = 0;

type Unpacker<T> = (c: string[] | undefined) => T;

const unpackTupleBuilder = <R extends T[], T = any>(...unpackers: Unpacker<T>[]): Unpacker<R> => {
  return (packed: string[]) => {
    return unpackers.map<T>((unpacker, i) => {
      const result = unpacker(packed) as T;
      //console.log('tuple', packed, i, result);
      return result;
    }) as R;
  };
};

const unpackArrayBuilder = <A extends readonly T[], T = any>(unpacker: Unpacker<T>, length?: number): Unpacker<A> => {
  return (packed: string[]) => {
    let len = length
        ? length
        : length < 0
            ? 0
            : unpackUnsignedInteger(packed);
    const result: T[] = [];
    while (len > 0 || length < 0 && packed.length) {
      result.push(unpacker(packed));
      len--;
    }
    return result as any;
  }
}

const unpackNumberBuilder = (scale: number, offset: number): Unpacker<number> => {
  return (packed: string[]) => {
    const charAt = packed.shift();
    const result = (charAt.charCodeAt(0) - UNPACK_STARTING_CHAR_CODE) * scale/64 + offset;
    //console.log(charAt, result, packed);
    return result;
  };
}

const unpackAngle = unpackNumberBuilder(PI_2_2DP, -PI_1_2DP);
// 0 to 64 (TODO should be 0..63)
const unpackUnsignedInteger = unpackNumberBuilder(64, 0);
// goes from -2 to 2
const unpackFloat2 = unpackNumberBuilder(4, -2);
// goes from -1 to 1
const unpackFloat1 = unpackNumberBuilder(2, -1);
// goes from -.5 to .5
const unpackFloatHalf = unpackNumberBuilder(1, -.5);
// goes from 0 to 0.1
const unpackUnsignedFloatPoint1 = unpackNumberBuilder(.1, 0);
// goes from 0 to 255
const unpackColorComponent = unpackNumberBuilder(255, 0);

const unpackRecordBuilder = <Key extends string | number, Value>(
    keyUnpacker: Unpacker<Key>, valueUnpacker: Unpacker<Value>
) => {
  return (packed: string[]): Partial<Record<Key, Value>> => {
    const result: Partial<Record<Key, Value>> = {};
    while (packed.length) {
      const key = keyUnpacker(packed);
      const value = valueUnpacker(packed);
      result[key] = value;
    }
    return result;
  };
};

const unpackVector3Rotations = unpackArrayBuilder(unpackArrayBuilder<ReadonlyVector3>(unpackAngle, 3));
const unpackVector3Normal = unpackArrayBuilder<ReadonlyVector3>(unpackFloat1, 3);
const unpackVector3Point = unpackArrayBuilder<ReadonlyVector3>(unpackFloatHalf, 3);
const unpackVector4RGBA: Unpacker<ReadonlyVector4> = unpackArrayBuilder(unpackColorComponent, 4);
const unpackMatrix4: Unpacker<ReadonlyMatrix4> = unpackArrayBuilder(unpackFloat1, 16);

const unpackUnsignedIntegerArray = unpackArrayBuilder(unpackUnsignedInteger);
const unpackUnsignedUnboundedIntegerArray = unpackArrayBuilder(unpackUnsignedInteger, -1);
const unpackUnsignedIntegerArray3 = unpackArrayBuilder(unpackArrayBuilder(unpackArrayBuilder(unpackUnsignedInteger)));
const unpackVector3Normals = unpackArrayBuilder(unpackVector3Normal);
const unpackVector3Points = unpackArrayBuilder(unpackVector3Point);

const unpackPolygon = unpackArrayBuilder(unpackVector3Normal);
const unpackPolygons = unpackArrayBuilder(unpackPolygon);

const unpackJointAnimationSequence: Unpacker<JointAnimationSequence<number>> = (c: string[]) => {
  const partId = unpackUnsignedInteger(c);
  const duration = unpackUnsignedInteger(c) * 30;
  const easing = EASINGS[unpackUnsignedInteger(c)];
  const rotations = unpackVector3Rotations(c);
  return [
    partId,
    duration,
    easing,
    ...rotations,
  ];
};
const unpackJointAnimationsSequences = unpackArrayBuilder(unpackJointAnimationSequence, -1);

const unpackFaces: Unpacker<readonly Face<PlaneMetadata>[]> = (c: string[]) => {
  const points = unpackVector3Points(c);
  const indices = unpackUnsignedIntegerArray3(c);
  const smoothingFlags = unpackUnsignedUnboundedIntegerArray(c);

  return indices.map((indices, i) => {
    const modelPolygons = indices.map(indices => {
      return indices.map(index => {
        return points[index];
      })
    });
    const {
      rotateToModelCoordinates,
      toModelCoordinates,
    } = toFace(
      {},
      ...modelPolygons[0],
    );
    const toPlaneCoordinates = matrix4Invert(toModelCoordinates);
    const polygons = modelPolygons.map(modelPolygon => {
      return modelPolygon.map(point => {
        return vector3TransformMatrix4(toPlaneCoordinates, ...point);
      })
    });
    return {
      polygons,
      rotateToModelCoordinates,
      toModelCoordinates,
      // TODO how do we transfer the transform?
      t: {
        smoothingFlags: smoothingFlags[i] ?? 1,
      },
    }
  });

};


// packing

type Packer<T> = (value: T) => string[];

const packTupleBuilder = <R extends readonly T[], T = any>(...packers: Packer<T>[]): Packer<R> => {
  return (value: R): string[]=> {
    return packers.map((v, i) => v(value[i])).flat() as any;
  };
};

// length can be zero/undefined, indicating we should write the length out, or -1, indicating we should gobble up all the values
const packArrayBuilder = <R extends readonly T[], T = any>(packer: Packer<T>, arrayLength?: number) => {
  return (value: R): string[] => {
    const arr = arrayLength ? [] : packUnsignedInteger(value.length);
    return [...arr, ...value.map(packer).flat()];
  };
};

const packNumberBuilder = (scale: number, offset: number): Packer<number> => {
  return (value: number) => {
    const charCode = Math.round(UNPACK_STARTING_CHAR_CODE + (value - offset) * 64/scale);
    return [String.fromCharCode(charCode)];
  }
};

// -PI..PI
const packAngle = packNumberBuilder(Math.PI * 2, -Math.PI);
// 0..64 (TODO should be 0..63)
const packUnsignedInteger = packNumberBuilder(64, 0);
// -2..2
const packFloat2 = packNumberBuilder(4, -2);
// -1..1
const packFloat1 = packNumberBuilder(2, -1);
// -.5..-5
const packFloatPoint5 = packNumberBuilder(1, -.5);
// 0..0.1
const packUnsignedFloatPoint1 = packNumberBuilder(.1, 0);
// 0 to 255
const packColorComponent = packNumberBuilder(255, 0);

const packParsedNumberBuilder = (packer: Packer<number>): Packer<string> => {
  return (value: string) => packer(parseInt(value));
};

const packDefaultBuilder = <T>(packer: Packer<T>, defaultValue: T): Packer<T | undefined | null> => {
  return (value: T | undefined | null) => packer(value || defaultValue);
};  

const packRecordBuilder = <Key extends string | number, Value>(keyPacker: Packer<string>, valuePacker: Packer<Value>) => {
  return (record: Record<Key, Value>) => {
    const result: string[] = [];
    for (const key in record) {
      const value = record[key];
      result.push(...keyPacker(key));
      result.push(...valuePacker(value));
    }
    return result;
  };
};

const packVector3Rotations = packArrayBuilder(packArrayBuilder<ReadonlyVector3>(packAngle, 3));
const packVector3Normal = packArrayBuilder<ReadonlyVector3>(packFloat1, 3)
const packVector3Point = packArrayBuilder<ReadonlyVector3>(packFloatPoint5, 3)
const packVector4RGBA = packArrayBuilder(packColorComponent, 4);
const packMatrix4 = packArrayBuilder(packFloat1, 16);


const packUnsignedIntegerArray = packArrayBuilder(packUnsignedInteger);
const packUnsignedUnboundedIntegerArray = packArrayBuilder(packUnsignedInteger, -1);

const packVector3Normals = packArrayBuilder(packVector3Normal);
const packVector3Points = packArrayBuilder(packVector3Point);

const packUnsignedIntegerArray3 = packArrayBuilder(packArrayBuilder(packArrayBuilder(packUnsignedInteger)));

const packJointAnimationSequence: Packer<JointAnimationSequence<number>> = ([
  partId,
  duration,
  easing,
  ...rotations
]: JointAnimationSequence<number>) => {
  return [
    ...packUnsignedInteger(partId),
    ...packUnsignedInteger(duration/30),
    ...packUnsignedInteger(EASINGS.indexOf(easing)),
    ...packVector3Rotations(rotations),
  ];
}

const packJointAnimationsSequences = packArrayBuilder(packJointAnimationSequence, -1);

const packFaces: Packer<readonly Face<PlaneMetadata>[]> = (faces: Face<PlaneMetadata>[]) => {
  // find all the unique, transformed points
  const uniquePoints: ReadonlyVector3[] = [];
  function maybeAddUniquePoint(p: ReadonlyVector3, toModelCoordinates: ReadonlyMatrix4): number {
    const modelPoint = vector3TransformMatrix4(toModelCoordinates, ...p);
    const packedModelPoint = packVector3Point(modelPoint).join('');
    const index = uniquePoints.findIndex(point => packVector3Point(point).join('') == packedModelPoint);
    if (index < 0) {
      uniquePoints.push(modelPoint);
      return uniquePoints.length - 1;
    }
    return index;
  }
  const smoothingFlags = faces.map(face => face.t.smoothingFlags || 0);
  faces.forEach(({
    polygons,
    toModelCoordinates,
  }) => {
    polygons.forEach(polygon => {
      polygon.forEach(point => maybeAddUniquePoint(point, toModelCoordinates));
    });
  });

  // pack the points and indexes into those points for each face
  const indices = faces.map(({
    polygons,
    toModelCoordinates,
  }) => {
    return polygons.map(polygon => {
      return polygon.map(point => {
        return maybeAddUniquePoint(point, toModelCoordinates);
      }).filter((index, i, arr) => {
        // remove contiguous references to duplicate points
        return index != arr[(i+1)%arr.length];
      });
    });
  });
  // trim off any 1's as they are the default case
  while (smoothingFlags.length && smoothingFlags[smoothingFlags.length - 1] == 1) {
    smoothingFlags.pop();
  }
  return [
    ...packVector3Points(uniquePoints),
    ...packUnsignedIntegerArray3(indices),
    ...packUnsignedUnboundedIntegerArray(smoothingFlags),
  ];
};

// const packShapedRule: Packer<ShapedRule> = (value: ShapedRule) => {
//   return [
    
//   ]
// };
// const packShapedRules = packArrayBuilder(packShapedRule, -1);

// safe

type SafeUnpacker<T> = (packed: string[], original?: T | Falsey) => T;

const safeUnpackerBuilder = <T>(unpacker: Unpacker<T>, packer?: Packer<T> | Falsey): SafeUnpacker<T> => {
  return (packed?: string[] | undefined, original?: T | Falsey) => {
    if (FLAG_UNPACK_CHECK_ORIGINALS && packer && original && packed) {
      const packedOriginal = packer(original);
      if (packed.join('') != packedOriginal.join('')) {
        const repackedOriginal = packer(unpacker([...packedOriginal]));
        if (repackedOriginal.join('') != packedOriginal.join('')) {
          // packer is busted!
          const diff = repackedOriginal.map((v, i) => packedOriginal[i] == v ? [] : [v, packedOriginal[i], i]).filter(i => i.length > 0);
          throw new Error(diff.map(([c1, c2, i]) => `${i}: ${c1}/${c2}`).join(' '));
        }
        const unprintable = packedOriginal.findIndex(c => {
          const charCode = c.charCodeAt(0);
          return charCode > UNPACK_STARTING_CHAR_CODE + 64 + UNPACK_ALLOWABLE_OVERFLOW
            || charCode < UNPACK_STARTING_CHAR_CODE;
        });
        if (unprintable >= 0) {
          throw new Error(
              'unprintable character "'
              + packedOriginal[unprintable]
              + '"('
              + packedOriginal[unprintable].charCodeAt(0)
              + ') at '+unprintable+' in '+packedOriginal.join('')
          );
        }
        try {
          throw new Error(`expected '${packedOriginal.join('').replace(/\\/g, '\\\\').replace(/\'/g, '\\\'')}' got '${packed.join('').replace(/\'/g, '\\\'')}' for ${JSON.stringify(original)}`)
        } catch (e) {
          console.warn(e);
        }
        packed = [...packedOriginal];
      }  
    }  
    if (FLAG_UNPACK_USE_ORIGINALS && original) {
      return original;
    }
    return unpacker([...packed]);
  };
};

const safeUnpackVector3Rotations = FLAG_UNPACK_CHECK_ORIGINALS 
    ? safeUnpackerBuilder<readonly ReadonlyVector3[]>(
        unpackVector3Rotations,
        packVector3Rotations,
    )
    : unpackVector3Rotations;

const safeUnpackVector3Normals = FLAG_UNPACK_CHECK_ORIGINALS
    ? safeUnpackerBuilder<readonly ReadonlyVector3[]>(
          unpackVector3Normals,
          FLAG_UNPACK_CHECK_ORIGINALS && packVector3Normals,
    )
    : unpackVector3Normals;

const safeUnpackRGBA = FLAG_UNPACK_CHECK_ORIGINALS
    ? safeUnpackerBuilder<ReadonlyVector4>(
        unpackVector4RGBA,
        FLAG_UNPACK_CHECK_ORIGINALS && packVector4RGBA,
    )
    : unpackVector4RGBA;

const safeUnpackMatrix4 = FLAG_UNPACK_CHECK_ORIGINALS
    ? safeUnpackerBuilder<ReadonlyMatrix4>(
        unpackMatrix4,
        FLAG_UNPACK_CHECK_ORIGINALS && packMatrix4,
    )
    : unpackMatrix4;

const safeUnpackUnsignedIntegerArray = FLAG_UNPACK_CHECK_ORIGINALS
    ? safeUnpackerBuilder<readonly number[]>(
      unpackUnsignedIntegerArray,
      FLAG_UNPACK_CHECK_ORIGINALS && packUnsignedIntegerArray,
    )
    : unpackUnsignedIntegerArray;

const safeUnpackFaces = FLAG_UNPACK_CHECK_ORIGINALS
    ? safeUnpackerBuilder<readonly Face<PlaneMetadata>[]>(
      unpackFaces,
      FLAG_UNPACK_CHECK_ORIGINALS && packFaces,
    )
    : unpackFaces;

const safeUnpackJointAnimationSequences = FLAG_UNPACK_CHECK_ORIGINALS
    ? safeUnpackerBuilder<JointAnimationSequences<number>>(
      unpackJointAnimationsSequences,
      FLAG_UNPACK_CHECK_ORIGINALS && packJointAnimationsSequences,
    )
    : unpackJointAnimationsSequences;