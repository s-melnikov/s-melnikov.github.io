class Geometry {
  constructor(faces) {
    this.faces = faces || [];    
  }

  vertexCount() {
    return this.faces.length * 3;
  }

  positions() {
    const answer = [];
    this.faces.forEach((face) => {
      face.vertices.forEach((vertex) => {
        const v = vertex.position;
        answer.push(v.x, v.y, v.z);
      });
    });
    return answer;
  }

  normals() {
    const answer = [];
    this.faces.forEach((face) => {
      face.vertices.forEach((vertex) => {
        const v = vertex.normal;
        answer.push(v.x, v.y, v.z);
      });
    });
    return answer;
  }

  uvs() {
    const answer = [];
    this.faces.forEach((face) => {
      face.vertices.forEach((vertex) => {
        const v = vertex.uv;
        answer.push(v.x, v.y);
      });
    });
    return answer;
  }
}

Geometry.parseOBJ = (src) => {
  const POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
  const NORMAL = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
  const UV = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
  const FACE = /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/;  
  const positions = [];
  const uvs = [];
  const normals = [];
  const faces = [];
  src.split("\n").forEach(function (line) {
    let result
    if ((result = POSITION.exec(line)) != null) {
      positions.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])))
    } else if ((result = NORMAL.exec(line)) != null) {
      normals.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])))
    } else if ((result = UV.exec(line)) != null) {
      uvs.push(new Vector2(parseFloat(result[1]), 1 - parseFloat(result[2])))
    } else if ((result = FACE.exec(line)) != null) {
      const vertices = [];
      for (let i = 1; i < 10; i += 3) {
        const part = result.slice(i, i + 3);
        const position = positions[parseInt(part[0]) - 1];
        const uv = uvs[parseInt(part[1]) - 1];
        const normal = normals[parseInt(part[2]) - 1];
        vertices.push(new Vertex(position, normal, uv));
      }
      faces.push(new Face(vertices));
    }
  });
  return new Geometry(faces);
};

Geometry.loadOBJ = (url) => {
  return fetch(url).then((resp) => resp.text()).then((text) => {
    return Geometry.parseOBJ(text);
  });
};

class Face {
  constructor(vertices) {
    this.vertices = vertices;
  }
}

class Vertex {
  constructor(position, normal, uv) {
    this.position = position || new Vector3();
    this.normal = normal || new Vector3();
    this.uv = uv || new Vector2();
  }
}

class Vector3 {
  constructor(x, y, z) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.z = Number(z) || 0;
  }
}

class Vector2 {
  constructor(x, y) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
  }
}
