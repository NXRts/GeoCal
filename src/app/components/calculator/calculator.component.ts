import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  GeometryService,
  ShapeDefinition,
} from "../../services/geometry.service";
import { HistoryService } from "../../services/history.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-calculator",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./calculator.component.html",
  styleUrls: ["./calculator.component.css"],
})
export class CalculatorComponent implements OnInit, OnDestroy {
  shapes: ShapeDefinition[] = [];
  selectedShape!: ShapeDefinition;
  calculatorForm!: FormGroup;
  results: string[] = [];
  errorMessage: string = "";
  hasCalculated = false;

  // Real-time values for SVG binding
  svgValues: Record<string, string | number> = {};

  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private geometryService: GeometryService,
    private historyService: HistoryService,
  ) {}

  ngOnInit(): void {
    this.shapes = this.geometryService.getShapeDefinitions();
    // Default to the first shape (circle)
    if (this.shapes.length > 0) {
      this.selectShape(this.shapes[0].key);
    }
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  selectShape(shapeKey: string): void {
    const shape = this.geometryService.getShapeDefinition(shapeKey);
    if (!shape) return;

    this.selectedShape = shape;
    this.results = [];
    this.errorMessage = "";
    this.hasCalculated = false;

    // Rebuild form group
    const formControls: Record<string, any> = {};
    const initialSvgValues: Record<string, string | number> = {};

    shape.inputs.forEach((input) => {
      // Optional for sideA and sideB in triangle, required for others
      const isOptional =
        shape.key === "triangle" &&
        (input.name === "sideA" || input.name === "sideB");
      const validators = isOptional
        ? [Validators.min(0)]
        : [Validators.required, Validators.min(0.0001)];

      formControls[input.name] = ["", validators];
      initialSvgValues[input.name] = input.name; // Initial placeholder text like 'r', 'w', 'h'
    });

    this.calculatorForm = this.fb.group(formControls);
    this.svgValues = initialSvgValues;

    // Listen to form value changes for real-time SVG updates
    this.formSubscription?.unsubscribe();
    this.formSubscription = this.calculatorForm.valueChanges.subscribe(
      (values) => {
        this.errorMessage = "";
        shape.inputs.forEach((input) => {
          const val = values[input.name];
          // If empty or invalid, show placeholder letter, else show value
          if (
            val !== null &&
            val !== undefined &&
            val !== "" &&
            Number(val) >= 0
          ) {
            this.svgValues[input.name] = Number(val);
          } else {
            this.svgValues[input.name] =
              input.name === "radius"
                ? "r"
                : input.name === "width"
                  ? "w"
                  : input.name === "height"
                    ? "h"
                    : input.name === "base"
                      ? "a"
                      : input.name === "side"
                        ? "s"
                        : input.name;
          }
        });
      },
    );
  }

  onShapeChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    this.selectShape(selectEl.value);
  }

  calculate(): void {
    if (this.calculatorForm.invalid) {
      this.calculatorForm.markAllAsTouched();
      this.errorMessage =
        "Silakan isi semua parameter yang diperlukan dengan angka positif.";
      return;
    }

    const formValues = this.calculatorForm.value;
    const numericValues: Record<string, number> = {};

    // Map form values to numbers
    Object.keys(formValues).forEach((key) => {
      numericValues[key] = Number(formValues[key]);
    });

    const result = this.geometryService.calculate(
      this.selectedShape.key,
      numericValues,
    );

    if (result.error) {
      this.errorMessage = result.error;
      this.results = [];
    } else if (result.results) {
      this.results = result.results;
      this.errorMessage = "";
      this.hasCalculated = true;

      // Add to History Service
      const historyInputs = this.selectedShape.inputs.map((input) => {
        const value = numericValues[input.name];
        return {
          label: input.label,
          value: isNaN(value) ? 0 : value,
        };
      });

      this.historyService.addHistory(
        this.selectedShape.key,
        this.selectedShape.label,
        historyInputs,
        this.results,
      );
    }
  }

  resetForm(): void {
    this.calculatorForm.reset();
    this.results = [];
    this.errorMessage = "";
    this.hasCalculated = false;

    // Reset SVG labels
    this.selectedShape.inputs.forEach((input) => {
      this.svgValues[input.name] =
        input.name === "radius"
          ? "r"
          : input.name === "width"
            ? "w"
            : input.name === "height"
              ? "h"
              : input.name === "base"
                ? "a"
                : input.name === "side"
                  ? "s"
                  : input.name;
    });
  }
}
