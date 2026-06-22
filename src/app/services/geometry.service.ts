import { Injectable } from "@angular/core";

export interface InputField {
  name: string;
  label: string;
  type: string;
  min: number;
  step: string;
  placeholder: string;
}

export interface CalculationResult {
  error?: string;
  results?: string[];
}

export interface ShapeDefinition {
  key: string;
  label: string;
  inputs: InputField[];
  formula: (values: Record<string, number>) => CalculationResult;
}

@Injectable({
  providedIn: "root",
})
export class GeometryService {
  private shapeDefinitions: Record<string, ShapeDefinition> = {
    circle: {
      key: "circle",
      label: "Lingkaran",
      inputs: [
        {
          name: "radius",
          label: "Jari-jari (r)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan jari-jari",
        },
      ],
      formula(values) {
        const r = Number(values["radius"]);
        if (r === undefined || isNaN(r) || r <= 0)
          return { error: "Masukkan jari-jari yang valid (> 0)." };
        const area = Math.PI * r * r;
        const perimeter = 2 * Math.PI * r;
        return {
          results: [
            `Luas: ${area.toFixed(4)} satuan²`,
            `Keliling: ${perimeter.toFixed(4)} satuan`,
          ],
        };
      },
    },
    rectangle: {
      key: "rectangle",
      label: "Persegi Panjang",
      inputs: [
        {
          name: "width",
          label: "Lebar (w)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan lebar",
        },
        {
          name: "height",
          label: "Tinggi (h)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan tinggi",
        },
      ],
      formula(values) {
        const w = Number(values["width"]);
        const h = Number(values["height"]);
        if (
          w === undefined ||
          isNaN(w) ||
          w <= 0 ||
          h === undefined ||
          isNaN(h) ||
          h <= 0
        ) {
          return { error: "Masukkan lebar dan tinggi yang valid (> 0)." };
        }
        const area = w * h;
        const perimeter = 2 * (w + h);
        const diagonal = Math.sqrt(w * w + h * h);
        return {
          results: [
            `Luas: ${area.toFixed(4)} satuan²`,
            `Keliling: ${perimeter.toFixed(4)} satuan`,
            `Diagonal: ${diagonal.toFixed(4)} satuan`,
          ],
        };
      },
    },
    triangle: {
      key: "triangle",
      label: "Segitiga",
      inputs: [
        {
          name: "base",
          label: "Alas (a)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan alas",
        },
        {
          name: "height",
          label: "Tinggi (t)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan tinggi",
        },
        {
          name: "sideA",
          label: "Sisi A (opsional untuk keliling)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan sisi A",
        },
        {
          name: "sideB",
          label: "Sisi B (opsional untuk keliling)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan sisi B",
        },
      ],
      formula(values) {
        const a = Number(values["base"]);
        const t = Number(values["height"]);
        const sideA = values["sideA"] ? Number(values["sideA"]) : 0;
        const sideB = values["sideB"] ? Number(values["sideB"]) : 0;
        if (
          a === undefined ||
          isNaN(a) ||
          a <= 0 ||
          t === undefined ||
          isNaN(t) ||
          t <= 0
        ) {
          return { error: "Masukkan alas dan tinggi yang valid (> 0)." };
        }
        const area = (a * t) / 2;
        const results = [`Luas: ${area.toFixed(4)} satuan²`];
        if (sideA > 0 && sideB > 0) {
          const perimeter = a + sideA + sideB;
          results.push(`Keliling: ${perimeter.toFixed(4)} satuan`);
        } else {
          results.push(
            "Keliling: Masukkan Sisi A dan Sisi B (> 0) untuk menghitung keliling.",
          );
        }
        return { results };
      },
    },
    sphere: {
      key: "sphere",
      label: "Bola",
      inputs: [
        {
          name: "radius",
          label: "Jari-jari (r)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan jari-jari",
        },
      ],
      formula(values) {
        const r = Number(values["radius"]);
        if (r === undefined || isNaN(r) || r <= 0)
          return { error: "Masukkan jari-jari yang valid (> 0)." };
        const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
        const surface = 4 * Math.PI * r * r;
        return {
          results: [
            `Volume: ${volume.toFixed(4)} satuan³`,
            `Luas Permukaan: ${surface.toFixed(4)} satuan²`,
          ],
        };
      },
    },
    cylinder: {
      key: "cylinder",
      label: "Tabung",
      inputs: [
        {
          name: "radius",
          label: "Jari-jari (r)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan jari-jari",
        },
        {
          name: "height",
          label: "Tinggi (h)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan tinggi",
        },
      ],
      formula(values) {
        const r = Number(values["radius"]);
        const h = Number(values["height"]);
        if (
          r === undefined ||
          isNaN(r) ||
          r <= 0 ||
          h === undefined ||
          isNaN(h) ||
          h <= 0
        ) {
          return { error: "Masukkan jari-jari dan tinggi yang valid (> 0)." };
        }
        const volume = Math.PI * r * r * h;
        const surface = 2 * Math.PI * r * (r + h);
        return {
          results: [
            `Volume: ${volume.toFixed(4)} satuan³`,
            `Luas Permukaan: ${surface.toFixed(4)} satuan²`,
          ],
        };
      },
    },
    cube: {
      key: "cube",
      label: "Kubus",
      inputs: [
        {
          name: "side",
          label: "Panjang sisi (s)",
          type: "number",
          min: 0,
          step: "any",
          placeholder: "Masukkan panjang sisi",
        },
      ],
      formula(values) {
        const s = Number(values["side"]);
        if (s === undefined || isNaN(s) || s <= 0)
          return { error: "Masukkan panjang sisi yang valid (> 0)." };
        const volume = Math.pow(s, 3);
        const surface = 6 * s * s;
        const diagonal = Math.sqrt(3) * s;
        return {
          results: [
            `Volume: ${volume.toFixed(4)} satuan³`,
            `Luas Permukaan: ${surface.toFixed(4)} satuan²`,
            `Diagonal Ruang: ${diagonal.toFixed(4)} satuan`,
          ],
        };
      },
    },
  };

  getShapeDefinitions(): ShapeDefinition[] {
    return Object.values(this.shapeDefinitions);
  }

  getShapeDefinition(key: string): ShapeDefinition | undefined {
    return this.shapeDefinitions[key];
  }

  calculate(key: string, values: Record<string, number>): CalculationResult {
    const shape = this.getShapeDefinition(key);
    if (!shape) return { error: "Bentuk tidak dikenal." };
    return shape.formula(values);
  }
}
