const shapeSelect = document.getElementById("shapeSelect");
const inputsContainer = document.getElementById("inputs");
const resultsContainer = document.getElementById("results");
const calculateButton = document.getElementById("calculateButton");
const resetButton = document.getElementById("resetButton");

const shapeDefinitions = {
  circle: {
    label: "Lingkaran",
    inputs: [
      { name: "radius", label: "Jari-jari (r)", type: "number", min: 0, step: "any", placeholder: "Masukkan jari-jari" },
    ],
    formula(values) {
      const r = Number(values.radius);
      if (!r || r < 0) return { error: "Masukkan jari-jari yang valid." };
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
    label: "Persegi Panjang",
    inputs: [
      { name: "width", label: "Lebar (w)", type: "number", min: 0, step: "any", placeholder: "Masukkan lebar" },
      { name: "height", label: "Tinggi (h)", type: "number", min: 0, step: "any", placeholder: "Masukkan tinggi" },
    ],
    formula(values) {
      const w = Number(values.width);
      const h = Number(values.height);
      if (!w || !h || w < 0 || h < 0) return { error: "Masukkan lebar dan tinggi yang valid." };
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
    label: "Segitiga",
    inputs: [
      { name: "base", label: "Alas (a)", type: "number", min: 0, step: "any", placeholder: "Masukkan alas" },
      { name: "height", label: "Tinggi (t)", type: "number", min: 0, step: "any", placeholder: "Masukkan tinggi" },
      { name: "sideA", label: "Sisi A", type: "number", min: 0, step: "any", placeholder: "Masukkan sisi A" },
      { name: "sideB", label: "Sisi B", type: "number", min: 0, step: "any", placeholder: "Masukkan sisi B" },
    ],
    formula(values) {
      const a = Number(values.base);
      const t = Number(values.height);
      const sideA = Number(values.sideA);
      const sideB = Number(values.sideB);
      if (!a || !t || a < 0 || t < 0) return { error: "Masukkan alas dan tinggi yang valid." };
      const area = (a * t) / 2;
      const results = [`Luas: ${area.toFixed(4)} satuan²`];
      if (sideA > 0 && sideB > 0) {
        const perimeter = a + sideA + sideB;
        results.push(`Keliling: ${perimeter.toFixed(4)} satuan`);
      } else {
        results.push(
          "Keliling: masukkan Sisi A dan Sisi B untuk menghitung keliling."
        );
      }
      return { results };
    },
  },
  sphere: {
    label: "Bola",
    inputs: [
      { name: "radius", label: "Jari-jari (r)", type: "number", min: 0, step: "any", placeholder: "Masukkan jari-jari" },
    ],
    formula(values) {
      const r = Number(values.radius);
      if (!r || r < 0) return { error: "Masukkan jari-jari yang valid." };
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
    label: "Tabung",
    inputs: [
      { name: "radius", label: "Jari-jari (r)", type: "number", min: 0, step: "any", placeholder: "Masukkan jari-jari" },
      { name: "height", label: "Tinggi (h)", type: "number", min: 0, step: "any", placeholder: "Masukkan tinggi" },
    ],
    formula(values) {
      const r = Number(values.radius);
      const h = Number(values.height);
      if (!r || !h || r < 0 || h < 0) return { error: "Masukkan jari-jari dan tinggi yang valid." };
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
    label: "Kubus",
    inputs: [
      { name: "side", label: "Panjang sisi (s)", type: "number", min: 0, step: "any", placeholder: "Masukkan panjang sisi" },
    ],
    formula(values) {
      const s = Number(values.side);
      if (!s || s < 0) return { error: "Masukkan panjang sisi yang valid." };
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

function renderInputs(shapeKey) {
  const shape = shapeDefinitions[shapeKey];
  inputsContainer.innerHTML = "";
  shape.inputs.forEach((input) => {
    const field = document.createElement("div");
    const label = document.createElement("label");
    label.htmlFor = input.name;
    label.textContent = input.label;
    const inputEl = document.createElement("input");
    inputEl.id = input.name;
    inputEl.name = input.name;
    inputEl.type = input.type;
    inputEl.min = input.min;
    inputEl.step = input.step;
    inputEl.placeholder = input.placeholder;
    inputEl.required = true;
    field.appendChild(label);
    field.appendChild(inputEl);
    inputsContainer.appendChild(field);
  });
  resultsContainer.innerHTML = `<p>Masukkan parameter untuk ${shape.label.toLowerCase()} dan klik Hitung.</p>`;
}

function getFormValues() {
  const formData = new FormData(document.getElementById("shapeForm"));
  const values = {};
  for (const [key, value] of formData.entries()) {
    values[key] = value.trim();
  }
  return values;
}

function renderResults(shapeKey) {
  const { error, results } = shapeDefinitions[shapeKey].formula(getFormValues());
  if (error) {
    resultsContainer.innerHTML = `<p class="error">${error}</p>`;
    return;
  }
  resultsContainer.innerHTML = "";
  results.forEach((item) => {
    const p = document.createElement("p");
    p.textContent = item;
    resultsContainer.appendChild(p);
  });
}

shapeSelect.addEventListener("change", (event) => {
  renderInputs(event.target.value);
});

calculateButton.addEventListener("click", () => {
  renderResults(shapeSelect.value);
});

resetButton.addEventListener("click", () => {
  document.getElementById("shapeForm").reset();
  renderInputs(shapeSelect.value);
});

renderInputs(shapeSelect.value);
